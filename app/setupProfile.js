import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
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
import { auth, db } from '../firebaseConfig';
import { BlurView } from 'expo-blur';

// --- THEME COLORS ---
const COLORS = {
  background: '#0f172a',    // Dark Slate
  primary: '#38bdf8',       // Electric Blue
  accent: '#a855f7',        // Purple
  text: '#f8fafc',          // White/Light Slate
  textSub: '#94a3b8',       // Gray
  cardBg: 'rgba(30, 41, 59, 0.7)', // Glassy Dark
  inputBg: 'rgba(30, 41, 59, 0.5)',
  border: 'rgba(255, 255, 255, 0.1)',
  success: '#4ade80',
};

const TOTAL_STEPS = 4; // Consolidated into 4 logical sections

// --- Reusable Option Button ---
const OptionButton = ({ label, icon, isSelected, onPress, style }) => (
  <TouchableOpacity
    style={[
      styles.option, 
      isSelected && styles.optionSelected, 
      style
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon && <Text style={styles.optionIcon}>{icon}</Text>}
    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
      {label}
    </Text>
    {isSelected && (
      <View style={styles.checkCircle}>
        <FontAwesome name="check" size={10} color="#0f172a" />
      </View>
    )}
  </TouchableOpacity>
);

// --- Reusable Text Input ---
const StyledTextInput = ({ placeholder, value, onChangeText, keyboardType = 'default', label }) => (
  <View style={styles.inputWrapper}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSub}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

// --- Progress Bar ---
const ProgressIndicator = ({ currentStep }) => (
  <View style={styles.progressContainer}>
    {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.progressDot,
          index + 1 <= currentStep ? styles.progressDotActive : styles.progressDotInactive,
        ]}
      />
    ))}
  </View>
);

export default function SetupProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // --- COMPLETE DATA STRUCTURE FOR ML MODELS ---
  const [formData, setFormData] = useState({
    // Step 1: The Basics (Hard Constraints)
    age: '',
    height: '',
    weight: '',
    gender: null,
    
    // Step 2: The "Burnout Predictor" Inputs (Mental/Lifestyle)
    jobActivity: null, // 'sedentary', 'light', 'heavy'
    sleepHours: null,  // '<5', '5-7', '7-9', '9+'
    stressLevel: null, // 'low', 'medium', 'high'
    experienceLevel: null, // 'beginner', 'intermediate', 'advanced'

    // Step 3: The "Form Corrector" & Logistics (Safety & Access)
    injuries: [], // Array of selected injuries
    equipment: null, // 'gym', 'dumbbells', 'bodyweight'
    
    // Step 4: The "Progressive Overload" (Goals)
    goal: null, 
    trainingDays: null, // '2', '3', '4', '5+'
  });

  // Helper to update form data
  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper for Multi-Select (Injuries)
  const toggleInjury = (injury) => {
    setFormData(prev => {
      const current = prev.injuries || [];
      if (current.includes(injury)) {
        return { ...prev, injuries: current.filter(i => i !== injury) };
      } else {
        return { ...prev, injuries: [...current, injury] };
      }
    });
  };

  // --- Validation Logic ---
  const isStepValid = () => {
    switch (step) {
      case 1: // Basics
        return formData.age && formData.height && formData.weight && formData.gender;
      case 2: // Lifestyle (Burnout)
        return formData.jobActivity && formData.sleepHours && formData.stressLevel && formData.experienceLevel;
      case 3: // Logistics
        return formData.equipment !== null; // Injuries optional
      case 4: // Goals
        return formData.goal && formData.trainingDays;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      setStep(step + 1);
    } else {
      Toast.show({ type: 'error', text1: 'Missing Info', text2: 'Please complete all fields to continue.' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // --- Save to Firestore ---
  const handleSaveProfile = async () => {
    if (!isStepValid()) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, {
        ...formData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
      });

      Toast.show({ type: 'success', text1: 'Profile Initialized', text2: 'AI Models Calibrating...' });
      
      // Simulate "Calibration" delay for effect
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1500);

    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error Saving', text2: error.message });
      setLoading(false);
    }
  };

  // --- Render Steps ---
  const renderCurrentStep = () => {
    switch (step) {
      case 1: // Bio-Metrics
        return (
          <View>
            <Text style={styles.sectionHeader}>Step 1: The Hardware</Text>
            <Text style={styles.subHeader}>We need your specs to calculate baselines.</Text>
            
            <View style={styles.glassWrapper}>
              <BlurView intensity={30} tint="dark" style={styles.blurContent}>
                <View style={styles.rowInputs}>
                  <View style={{flex: 1, marginRight: 10}}>
                    <StyledTextInput label="Age" placeholder="25" value={formData.age} onChangeText={(v) => handleUpdate('age', v)} keyboardType="numeric" />
                  </View>
                  <View style={{flex: 1}}>
                    <StyledTextInput label="Height (cm)" placeholder="175" value={formData.height} onChangeText={(v) => handleUpdate('height', v)} keyboardType="numeric" />
                  </View>
                </View>
                <StyledTextInput label="Current Weight (kg)" placeholder="70" value={formData.weight} onChangeText={(v) => handleUpdate('weight', v)} keyboardType="numeric" />
                
                <Text style={styles.fieldLabel}>Biological Sex (For Hormonal Baseline)</Text>
                <View style={styles.rowOptions}>
                  <OptionButton style={{ flex: 1, marginRight: 8 }} label="Male" isSelected={formData.gender === 'male'} onPress={() => handleUpdate('gender', 'male')} />
                  <OptionButton style={{ flex: 1, marginLeft: 8 }} label="Female" isSelected={formData.gender === 'female'} onPress={() => handleUpdate('gender', 'female')} />
                </View>
              </BlurView>
            </View>
          </View>
        );

      case 2: // Lifestyle (Burnout Model Inputs)
        return (
          <View>
            <Text style={styles.sectionHeader}>Step 2: The Lifestyle</Text>
            <Text style={styles.subHeader}>This data powers our "Burnout Prediction" engine.</Text>
            
            <View style={styles.glassWrapper}>
              <BlurView intensity={30} tint="dark" style={styles.blurContent}>
                
                <Text style={styles.fieldLabel}>Daily Job Activity</Text>
                <OptionButton label="Sedentary (Desk Job)" isSelected={formData.jobActivity === 'sedentary'} onPress={() => handleUpdate('jobActivity', 'sedentary')} />
                <OptionButton label="Lightly Active (Walking/Standing)" isSelected={formData.jobActivity === 'light'} onPress={() => handleUpdate('jobActivity', 'light')} />
                <OptionButton label="Heavy Labor (Construction/Physical)" isSelected={formData.jobActivity === 'heavy'} onPress={() => handleUpdate('jobActivity', 'heavy')} />

                <Text style={[styles.fieldLabel, { marginTop: 15 }]}>Average Sleep</Text>
                <View style={styles.rowOptions}>
                  <OptionButton style={{flex: 1, marginRight: 5}} label="< 5h" isSelected={formData.sleepHours === '<5'} onPress={() => handleUpdate('sleepHours', '<5')} />
                  <OptionButton style={{flex: 1, marginHorizontal: 5}} label="5-7h" isSelected={formData.sleepHours === '5-7'} onPress={() => handleUpdate('sleepHours', '5-7')} />
                  <OptionButton style={{flex: 1, marginLeft: 5}} label="7h+" isSelected={formData.sleepHours === '7+'} onPress={() => handleUpdate('sleepHours', '7+')} />
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 15 }]}>Stress Levels</Text>
                <View style={styles.rowOptions}>
                  <OptionButton style={{flex: 1, marginRight: 5}} label="Low" isSelected={formData.stressLevel === 'low'} onPress={() => handleUpdate('stressLevel', 'low')} />
                  <OptionButton style={{flex: 1, marginHorizontal: 5}} label="Med" isSelected={formData.stressLevel === 'medium'} onPress={() => handleUpdate('stressLevel', 'medium')} />
                  <OptionButton style={{flex: 1, marginLeft: 5}} label="High" isSelected={formData.stressLevel === 'high'} onPress={() => handleUpdate('stressLevel', 'high')} />
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 15 }]}>Training Experience</Text>
                <OptionButton label="Beginner (0-1 Years)" isSelected={formData.experienceLevel === 'beginner'} onPress={() => handleUpdate('experienceLevel', 'beginner')} />
                <OptionButton label="Intermediate (1-3 Years)" isSelected={formData.experienceLevel === 'intermediate'} onPress={() => handleUpdate('experienceLevel', 'intermediate')} />
                <OptionButton label="Advanced (3+ Years)" isSelected={formData.experienceLevel === 'advanced'} onPress={() => handleUpdate('experienceLevel', 'advanced')} />

              </BlurView>
            </View>
          </View>
        );

      case 3: // Logistics & Form Corrector
        return (
          <View>
            <Text style={styles.sectionHeader}>Step 3: Logistics & Safety</Text>
            <Text style={styles.subHeader}>Inputs for the Computer Vision & Rec Engine.</Text>
            
            <View style={styles.glassWrapper}>
              <BlurView intensity={30} tint="dark" style={styles.blurContent}>
                
                <Text style={styles.fieldLabel}>Equipment Access</Text>
                <OptionButton label="Full Commercial Gym" icon="🏢" isSelected={formData.equipment === 'gym'} onPress={() => handleUpdate('equipment', 'gym')} />
                <OptionButton label="Dumbbells / Home Gym" icon="🏠" isSelected={formData.equipment === 'dumbbells'} onPress={() => handleUpdate('equipment', 'dumbbells')} />
                <OptionButton label="Bodyweight Only" icon="🧘" isSelected={formData.equipment === 'bodyweight'} onPress={() => handleUpdate('equipment', 'bodyweight')} />

                <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Injuries (Select all that apply)</Text>
                <Text style={styles.helperText}>The AI will auto-filter dangerous exercises.</Text>
                
                <View style={styles.chipContainer}>
                  {['Knees', 'Lower Back', 'Shoulders', 'Wrists'].map((injury) => (
                    <TouchableOpacity
                      key={injury}
                      style={[
                        styles.chip,
                        formData.injuries.includes(injury) && styles.chipSelected
                      ]}
                      onPress={() => toggleInjury(injury)}
                    >
                      <Text style={[styles.chipText, formData.injuries.includes(injury) && styles.chipTextSelected]}>
                        {injury}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

              </BlurView>
            </View>
          </View>
        );

      case 4: // Goals & Adherence
        return (
          <View>
            <Text style={styles.sectionHeader}>Step 4: The Mission</Text>
            <Text style={styles.subHeader}>Defining success parameters.</Text>
            
            <View style={styles.glassWrapper}>
              <BlurView intensity={30} tint="dark" style={styles.blurContent}>
                
                <Text style={styles.fieldLabel}>Primary Objective</Text>
                <OptionButton label="Hypertrophy (Muscle Gain)" icon="💪" isSelected={formData.goal === 'muscle'} onPress={() => handleUpdate('goal', 'muscle')} />
                <OptionButton label="Fat Loss (Cutting)" icon="🔥" isSelected={formData.goal === 'fat_loss'} onPress={() => handleUpdate('goal', 'fat_loss')} />
                <OptionButton label="Strength & Power" icon="🏋️" isSelected={formData.goal === 'strength'} onPress={() => handleUpdate('goal', 'strength')} />
                <OptionButton label="General Athleticism" icon="🏃" isSelected={formData.goal === 'athletic'} onPress={() => handleUpdate('goal', 'athletic')} />

                <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Weekly Commitment</Text>
                <View style={styles.rowOptions}>
                  <OptionButton style={{flex: 1, marginRight: 5}} label="2 Days" isSelected={formData.trainingDays === '2'} onPress={() => handleUpdate('trainingDays', '2')} />
                  <OptionButton style={{flex: 1, marginHorizontal: 5}} label="3 Days" isSelected={formData.trainingDays === '3'} onPress={() => handleUpdate('trainingDays', '3')} />
                  <OptionButton style={{flex: 1, marginLeft: 5}} label="4+ Days" isSelected={formData.trainingDays === '4+'} onPress={() => handleUpdate('trainingDays', '4+')} />
                </View>

              </BlurView>
            </View>
          </View>
        );
      default:
        return null;
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
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.avoider}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.headerContainer}>
            {/* <Text style={styles.appName}>F.I.T. AI</Text> */}
            <ProgressIndicator currentStep={step} />
          </View>

          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <View style={styles.navContainer}>
            {step > 1 && (
              <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.nextButton, !isStepValid() && styles.disabledButton]} 
              onPress={step < TOTAL_STEPS ? nextStep : handleSaveProfile}
              disabled={loading} // Keep active even if invalid to show toast, logic handled in function
            >
              {loading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.nextButtonText}>
                  {step < TOTAL_STEPS ? 'Next Step' : 'Initialize Agent'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.6 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.85)' }, // Stronger overlay
  avoider: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, paddingBottom: 50 },

  // Header
  headerContainer: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  appName: { fontSize: 24, fontWeight: '800', color: COLORS.text, letterSpacing: 2, marginBottom: 20 },
  
  // Progress Bar
  progressContainer: { flexDirection: 'row', width: '100%', gap: 8 },
  progressDot: { height: 6, flex: 1, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' },
  progressDotActive: { backgroundColor: COLORS.primary },
  progressDotInactive: { backgroundColor: 'rgba(255,255,255,0.1)' },

  // Section Headers
  sectionHeader: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subHeader: { fontSize: 14, color: COLORS.textSub, marginBottom: 24 },

  // Glass Container
  glassWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // Helper background
  },
  blurContent: { padding: 20 },

  // Inputs
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { color: COLORS.textSub, fontSize: 12, marginBottom: 6, fontWeight: '600', marginLeft: 4 },
  inputContainer: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  input: { fontSize: 16, color: COLORS.text },

  // Options
  fieldLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  helperText: { fontSize: 12, color: COLORS.textSub, marginBottom: 10, marginTop: -5 },
  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)', // Tinted Primary
    borderColor: COLORS.primary,
  },
  optionIcon: { fontSize: 18, marginRight: 12 },
  optionText: { fontSize: 15, color: COLORS.textSub, flex: 1 },
  optionTextSelected: { color: COLORS.text, fontWeight: '600' },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center'
  },
  rowOptions: { flexDirection: 'row', justifyContent: 'space-between' },

  // Chips (Injuries)
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: 'rgba(248, 113, 113, 0.2)', // Red tint for injury
    borderColor: '#f87171',
  },
  chipText: { fontSize: 13, color: COLORS.textSub },
  chipTextSelected: { color: '#f87171', fontWeight: '600' },

  // Navigation Buttons
  navContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  backButton: {
    paddingVertical: 16, paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
    marginRight: 10,
  },
  backButtonText: { color: COLORS.textSub, fontWeight: '600', fontSize: 16 },
  
  nextButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: { backgroundColor: '#334155', shadowOpacity: 0 },
  nextButtonText: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
});