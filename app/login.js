import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

// --- THEME COLORS (Matching the Cyber-Dark Aesthetic) ---
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ 
        type: 'error', 
        text1: 'Missing Fields', 
        text2: 'Please enter both email and password.' 
      });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // --- Solid Notification ---
      Toast.show({ 
        type: 'success', 
        text1: 'Access Granted', 
        text2: 'Welcome back, Operator.',
        visibilityTime: 4000,
      });
      
      console.log('Login successful!');
      
      // Navigate to Home
      router.replace('/(tabs)/home'); 

    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Access Denied', 
        text2: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Image - You can keep your image or use a gradient if preferred */}
      <Image 
        source={require('../assets/images/bgimage.png')} 
        style={styles.backgroundImage}
        blurRadius={3} // Increased blur for better readability
      />
      
      {/* Overlay to ensure text contrast if image is too bright */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.avoider}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* --- Logo Section --- */}
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>FitSphere</Text>
            <Text style={styles.subtitle}>"Fit body, Fit mind"</Text>
          </View>

          {/* --- Glass Card --- */}
          <View style={styles.glassWrapper}>
            <BlurView intensity={40} tint="dark" style={styles.blurContent}>
              <Text style={styles.header}>Welcome Back</Text>
              <Text style={styles.subHeader}>Sign in to continue your journey</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={18} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textSub}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Forgot Password */}
              <TouchableOpacity onPress={() => {}} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin} 
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </BlurView> 
          </View> 
          {/* End of Glass Card */}

          {/* --- Sign Up Link --- */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
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
    backgroundColor: COLORS.background, // Fallback background
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.6, // Dim image slightly
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.7)', // Dark overlay for "Cyber" feel
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
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(229, 231, 231, 0.1)', // Glow effect behind logo
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 60, 
    height: 60, 
    resizeMode: 'contain',
    tintColor: COLORS.primary, // Optional: Tint logo to match theme if it's an icon
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.text,
    letterSpacing: 2,
    //textTransform: 'uppercase',
  },
  subtitle: { 
    fontSize: 14, 
    fontWeight: '500',
    color: COLORS.textSub,
    marginTop: 8,
    letterSpacing: 1,
  },
   appName: {
     fontSize: 28,
     fontWeight: '800',
     textAlign: 'center',
     color: COLORS.text,
     letterSpacing: 2,
     fontStyle: 'italic',
     fontFamily: 'Pacifico_400Regular',
   },
  
  // Glass Card
  glassWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 30,
  },
  blurContent: {
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Additional dark tint
  },

  header: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: COLORS.text, 
    marginBottom: 8, 
    textAlign: 'center', 
  },
  subHeader: { 
    fontSize: 14, 
    color: COLORS.textSub, 
    marginBottom: 32, 
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
    marginBottom: 16,
    height: 56,
  },
  inputIcon: { 
    marginRight: 12,
    width: 24, // Fixed width for alignment
    textAlign: 'center',
  },
  input: { 
    flex: 1, 
    height: '100%', 
    fontSize: 16, 
    color: COLORS.text,
  },
  
  forgotPassword: { 
    alignSelf: 'flex-end', 
    marginBottom: 24,
  },
  forgotPasswordText: { 
    color: COLORS.primary, 
    fontSize: 14, 
    fontWeight: '600',
  },
  
  // Button
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { 
    color: '#0f172a', // Dark text on bright button for contrast
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  // Signup
  signupContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  signupText: { 
    fontSize: 14, 
    color: COLORS.textSub,
  },
  signupLink: { 
    color: COLORS.primary, 
    fontWeight: 'bold',
    fontSize: 14,
  },
});