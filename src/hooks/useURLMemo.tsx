import { useURL } from 'expo-linking';

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
  const [lastURL, setLastURL] = useState<string | null>(url);

  useEffect(() => {
    setLastURL(url);
  }, [url]);

  return <URLMemoContext.Provider value={{ url: lastURL }}>{children}</URLMemoContext.Provider>;
}
