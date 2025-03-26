import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';
import AllNamaz from './src/pages/AllNamaz';
import FajarPage from './src/pages/prayers/FajarPage';
import ZuhrPage from './src/pages/prayers/ZuhrPage';
import AsarPage from './src/pages/prayers/AsarPage';
import MagribPage from './src/pages/prayers/MagribPage';
import EshaPage from './src/pages/prayers/EshaPage';
import CalendarPage from './src/pages/CalendarPage';
import SignUpPage from './src/pages/SignUpPage';
import SignInPage from './src/pages/SignInPage';
import ForgotPasswordPage from './src/pages/ForgotPasswordPage';
import EnterOTPPage from './src/pages/EnterOTPPage';
import ResetPasswordPage from './src/pages/ResetPasswordPage';
import { DateProvider } from './src/context/DateContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <DateProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignUp"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="SignIn" component={SignInPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
          <Stack.Screen name="EnterOTP" component={EnterOTPPage} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />
          <Stack.Screen name="AllNamaz" component={AllNamaz} />
          <Stack.Screen name="Calendar" component={CalendarPage} />
          <Stack.Screen name="Fajar" component={FajarPage} />
          <Stack.Screen name="Zuhr" component={ZuhrPage} />
          <Stack.Screen name="Asar" component={AsarPage} />
          <Stack.Screen name="Magrib" component={MagribPage} />
          <Stack.Screen name="Esha" component={EshaPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </DateProvider>
    </GestureHandlerRootView>
  );
}

export default App; 