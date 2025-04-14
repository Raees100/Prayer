import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DateProvider } from '@/context/DateContext';
import { AuthProvider } from '@/context/AuthContext';
import { NamazProvider } from '@/context/NamazContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <DateProvider>
      <NamazProvider>
    <SafeAreaView style={styles.container}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="SignInPage">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="AllNamaz" options={{ headerShown: false }} />
        <Stack.Screen name="CalenderPage" options={{ headerShown: false }} />
        <Stack.Screen name="VerifyOTPPage" options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPasswordPage" options={{ headerShown: false }} />
        <Stack.Screen name="ResetPasswordPage" options={{ headerShown: false }} />
        <Stack.Screen name="SignInPage" options={{ headerShown: false }} />
        <Stack.Screen name="SignUpPage" options={{ headerShown: false }} />
        <Stack.Screen name="FajarPage" options={{ headerShown: false }} />
        <Stack.Screen name="ZuhrPage" options={{ headerShown: false }} />
        <Stack.Screen name="AsarPage" options={{ headerShown: false }} />
        <Stack.Screen name="MaghribPage" options={{ headerShown: false }} />
        <Stack.Screen name="EshaPage" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </SafeAreaView>
    </NamazProvider>
    </DateProvider>
    </GestureHandlerRootView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});