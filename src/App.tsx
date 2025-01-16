import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Splash } from './screens/Splash';

import { routes, screenOptions } from './constants';
import { SignInScreen } from './screens/SignIn';
import HomeScreen from './screens/Home';
import CredentialsProvider from './hooks/useAuth';
import Navigator from './Navigator';
import Details from './screens/Details';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <CredentialsProvider>
      <Navigator
        loading={<Stack.Screen name={routes.splash} options={{ headerShown: false }} component={Splash} />}
        signedOut={
          <Stack.Screen
            name={routes.signIn}
            component={SignInScreen}
            options={{
              ...screenOptions,
              title: 'Sign in',
            }}
          />
        }
        signedIn={
          <>
            <Stack.Screen
              name={routes.home}
              component={HomeScreen}
              options={{
                ...screenOptions,
                title: 'Notifications',
              }}
            />
            <Stack.Screen name={routes.details} component={Details} options={{ ...screenOptions }} />
          </>
        }
      />
    </CredentialsProvider>
  );
}

export default App;
