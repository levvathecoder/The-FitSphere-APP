import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { auth } from '../firebaseConfig'; // Ensure this path matches your project structure

// --- THEME COLORS (Matching Login & App Theme) ---
const COLORS = {
  background: '#0f172a',    // Dark Slate
  primary: '#38bdf8',       // Electric Blue
  accent: '#a855f7',        // Purple
  text: '#f8fafc',          // White/Light Slate
  textSub: '#94a3b8',       // Gray
  cardBg: 'rgba(30, 41, 59, 0.7)', // Glassy Dark
  inputBg: 'rgba(30, 41, 59, 0.5)',
  border: 'rgba(255, 255, 255, 0.1)',
};

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({ 
        type: 'error', 
        text1: 'Missing Fields', 
        text2: 'Please fill in all fields to join.' 
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ 
        type: 'error', 
        text1: 'Password Mismatch', 
        text2: 'Please make sure your passwords match.' 
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Optional: Set the user's display name immediately
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: fullName });
      }
      
      // --- Solid Notification ---
      Toast.show({ 
        type: 'success', 
        text1: 'Profile Initialized', 
        text2: `Welcome to the team, ${fullName}.`,
        visibilityTime: 4000,
      });
      
      console.log('Sign up successful!');
      
      // Navigate to Home
      router.replace('/(tabs)/home'); 

    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Sign Up Failed', 
        text2: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Image */}
      <Image 
        source={require('../assets/images/bgimage.png')} 
        style={styles.backgroundImage}
        blurRadius={3} 
      />
      
      {/* Dark Overlay */}
      <View style={styles.overlay} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.avoider}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* --- Logo Section --- */}
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>Join The Squad</Text>
            <Text style={styles.subtitle}>Begin your transformation</Text>
          </View>

          {/* --- Glass Card --- */}
          <View style={styles.glassWrapper}>
            <BlurView intensity={40} tint="dark" style={styles.blurContent}>
              <Text style={styles.header}>Create Account</Text>
              <Text style={styles.subHeader}>Enter your details below</Text>

              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.textSub}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={18} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={COLORS.textSub}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={22} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textSub}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={22} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.textSub}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSignUp} 
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </BlurView> 
          </View> 
          {/* End of Glass Card */}

          {/* --- Login Link --- */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already a member? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.6, 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.7)', 
  },
  avoider: {
    flex: 1,
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 24, 
    paddingVertical: 40 
  },
  
  // Logo
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 30,
  },
  logoCircle: {
    width: 80, // Slightly smaller on signup to fit more fields
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.1)', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    //width: 45, 
    height: 45, 
    resizeMode: 'contain',
    tintColor: COLORS.primary, 
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontStyle: 'italic',
    fontFamily: 'Pacifico_400Regular',
  },
  subtitle: { 
    fontSize: 13, 
    fontWeight: '500',
    color: COLORS.textSub,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  
  // Glass Card
  glassWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  blurContent: {
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', 
  },

  header: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: COLORS.text, 
    marginBottom: 4, 
    textAlign: 'center', 
  },
  subHeader: { 
    fontSize: 13, 
    color: COLORS.textSub, 
    marginBottom: 24, 
    textAlign: 'center', 
  },

  // Inputs
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 12, // Reduced margin to fit more fields
    height: 52, // Slightly more compact
  },
  inputIcon: { 
    marginRight: 12,
    width: 24, 
    textAlign: 'center',
  },
  input: { 
    flex: 1, 
    height: '100%', 
    fontSize: 15, 
    color: COLORS.text,
  },
  
  // Button
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { 
    color: '#0f172a', 
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  // Login Link
  loginContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
    paddingBottom: 20,
  },
  loginText: { 
    fontSize: 14, 
    color: COLORS.textSub,
  },
  loginLink: { 
    color: COLORS.primary, 
    fontWeight: 'bold',
    fontSize: 14,
  },
});