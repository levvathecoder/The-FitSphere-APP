import { Pacifico_400Regular, useFonts } from '@expo-google-fonts/pacifico';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Pacifico_400Regular });

  if (!fontsLoaded) return null;
  return (
    <>
      <Stack>
        {/* The (loading) screen will be our new entry point */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        
        {/* This is the new screen we are adding */}
        <Stack.Screen 
          name="setupProfile" 
          options={{ 
            headerShown: true, 
            title: 'Setup Your Profile',
            headerStyle: { backgroundColor: '#233444' },
            headerTintColor: '#fff',
            gestureEnabled: false, // Prevents swiping back to home
          }} 
        />
        
        {/* This loads the tab bar */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
      </Stack>
      <Toast />
    </>
  );
}