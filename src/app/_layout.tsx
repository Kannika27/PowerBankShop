import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme, View, StyleSheet, Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { loadAuthToken } from '../lib/api';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthToken().then((token) => {
      const authenticated = !!token;
      setHasToken(authenticated);
      setLoading(false);

      const inLogin = segments[0] === 'login';
      if (!authenticated && !inLogin) {
        router.replace('/login');
      } else if (authenticated && inLogin) {
        router.replace('/');
      }
    });
  }, [segments]);

  if (loading) {
    return null;
  }
  SplashScreen.hideAsync();

  return (
    <View style={styles.webWrapper}>
      <View style={styles.phoneContainer}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <AnimatedSplashOverlay />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="index" />
            <Stack.Screen name="explore" />
          </Stack>
        </ThemeProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  phoneContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
});
