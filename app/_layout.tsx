import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/hooks/authProvider';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="leagues/[leagueId]" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="user/me" />
          </Stack>
        </SafeAreaView>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
