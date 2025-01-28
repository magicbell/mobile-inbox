import { useURL, useLinkingURL } from 'expo-linking';

import React, { createContext, useContext, useEffect, useState } from 'react';

type URLMemoContextType = {
  url: string | null;
};

const URLMemoContext = createContext<URLMemoContextType | null>(null);

export const useURLMemo = () => {
  const context = useContext(URLMemoContext);
  if (!context) {
    throw new Error('useMemoURL must be used within a URLMemoProvider');
  }
  return context.url;
};

export default function URLMemoProvider({ children }: { children: React.ReactElement }) {
  const url = useURL();
  const linkingURL = useLinkingURL();
  const [lastURL, setLastURL] = useState<string | null>(url || linkingURL);

  useEffect(() => {
    setLastURL(url || linkingURL);
  }, [url, linkingURL]);

  return <URLMemoContext.Provider value={{ url: lastURL }}>{children}</URLMemoContext.Provider>;
}
