import React from 'react';

import CredentialsProvider from './hooks/useAuth';
import Navigator from './Navigator';

function App() {
  return (
    <CredentialsProvider>
      <Navigator />
    </CredentialsProvider>
  );
}

export default App;
