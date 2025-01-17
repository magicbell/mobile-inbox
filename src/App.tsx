import React from 'react';

import CredentialsProvider from './hooks/useAuth';
import URLMemoProvider from './hooks/useURLMemo';
import Navigator from './Navigator';

function App() {
  return (
    <URLMemoProvider>
      <CredentialsProvider>
        <Navigator />
      </CredentialsProvider>
    </URLMemoProvider>
  );
}

export default App;
