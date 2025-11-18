import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Client, Notification } from 'magicbell-js/user-client';
import { useCredentials } from '../hooks/useAuth';

type MagicBellContextType = {
  client: Client | null;
  notifications: Notification[];
  isLoading: boolean;
  error: Error | null;
  fetchNotifications: (params?: {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    status?: string;
    category?: string;
    topic?: string;
  }) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  archiveNotification: (notificationId: string) => Promise<void>;
};

const MagicBellContext = createContext<MagicBellContextType | undefined>(
  undefined
);

export const useMagicBell = () => {
  const context = useContext(MagicBellContext);
  if (!context) {
    throw new Error('useMagicBell must be used within MagicBellProvider');
  }
  return context;
};

type MagicBellProviderProps = {
  children: ReactNode;
};

export default function MagicBellProvider({ children }: MagicBellProviderProps) {
  const [credentials] = useCredentials();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create client with JWT token
  const client = useMemo(() => {
    if (!credentials?.userJWT) {
      return null;
    }
    return new Client({
      token: credentials.userJWT,
    });
  }, [credentials?.userJWT]);

  const fetchNotifications = useCallback(
    async (params?: {
      limit?: number;
      startingAfter?: string;
      endingBefore?: string;
      status?: string;
      category?: string;
      topic?: string;
    }) => {
      if (!client) {
        setError(new Error('MagicBell client not initialized'));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await client.notifications.listNotifications({
          limit: params?.limit || 50,
          ...params,
        });

        // The SDK returns HttpResponse<NotificationCollection>
        // NotificationCollection has an optional data field
        setNotifications(response.data?.data || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch notifications');
        setError(error);
        console.error('Error fetching notifications:', error);
        // Ensure notifications is set to empty array on error
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!client) return;

      try {
        await client.notifications.markNotificationRead(notificationId);

        // Optimistically update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, readAt: new Date().toISOString() }
              : notification
          )
        );
      } catch (err) {
        console.error('Error marking notification as read:', err);
        throw err;
      }
    },
    [client]
  );

  const markAsUnread = useCallback(
    async (notificationId: string) => {
      if (!client) return;

      try {
        await client.notifications.markNotificationUnread(notificationId);

        // Optimistically update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, readAt: null }
              : notification
          )
        );
      } catch (err) {
        console.error('Error marking notification as unread:', err);
        throw err;
      }
    },
    [client]
  );

  const archiveNotification = useCallback(
    async (notificationId: string) => {
      if (!client) return;

      try {
        await client.notifications.archiveNotification(notificationId);

        // Optimistically update local state
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
      } catch (err) {
        console.error('Error archiving notification:', err);
        throw err;
      }
    },
    [client]
  );

  const value = useMemo(
    () => ({
      client,
      notifications,
      isLoading,
      error,
      fetchNotifications,
      refreshNotifications,
      markAsRead,
      markAsUnread,
      archiveNotification,
    }),
    [
      client,
      notifications,
      isLoading,
      error,
      fetchNotifications,
      refreshNotifications,
      markAsRead,
      markAsUnread,
      archiveNotification,
    ]
  );

  return (
    <MagicBellContext.Provider value={value}>
      {children}
    </MagicBellContext.Provider>
  );
}
