import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function AuthGate() {
  const router = useRouter();

  useEffect(() => {
    // This 'listener' checks for login state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        router.replace('/(tabs)/home'); // Send to home screen
      } else {
        // User is signed out
        router.replace('/login'); // Send to login screen
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    // This is our "Loading" screen
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#233444" />
    </View>
  );
}