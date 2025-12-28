import { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Make sure to install: npm install lucide-react-native
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Edit2,
  LogOut,
  MapPin,
  Moon,
  Ruler,
  Scale,
  Settings,
  Shield,
  Sun
} from 'lucide-react-native';

import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { auth } from '../../firebaseConfig';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ onBack }) {
  // --- State Management ---
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [location, setLocation] = useState('New York, USA');
  const router = useRouter();
  
  // User Stats
  const [weight, setWeight] = useState(75); // kg
  const [height, setHeight] = useState(180); // cm
  
  // Calculated BMI
  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
  
  // BMI Category Helper
  const getBmiCategory = (value) => {
    if (value < 18.5) return { label: 'Underweight', color: '#fbbf24' };
    if (value < 25) return { label: 'Healthy', color: '#4ade80' };
    if (value < 30) return { label: 'Overweight', color: '#fbbf24' };
    return { label: 'Obese', color: '#f87171' };
  };

  const bmiInfo = getBmiCategory(bmi);

  return (
    <View style={[styles.container, !isDarkTheme && styles.containerLight]}>
      <StatusBar 
        barStyle={isDarkTheme ? "light-content" : "dark-content"} 
        backgroundColor={isDarkTheme ? "#0f172a" : "#f8fafc"} 
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={[styles.iconButton, !isDarkTheme && styles.iconButtonLight]}>
            <ChevronLeft size={24} color={isDarkTheme ? "#f8fafc" : "#0f172a"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, !isDarkTheme && styles.textLight]}>Profile</Text>
          <TouchableOpacity style={[styles.iconButton, !isDarkTheme && styles.iconButtonLight]}>
            <Settings size={24} color={isDarkTheme ? "#f8fafc" : "#0f172a"} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          
          {/* --- Profile Card --- */}
          <View style={[styles.profileCard, !isDarkTheme && styles.cardLight]}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://ui-avatars.com/api/?name=Alex&background=random&size=200' }} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Edit2 size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.userName, !isDarkTheme && styles.textLight]}>Alex The Great</Text>
            <Text style={styles.userHandle}>@alex_fits_12</Text>

            <View style={styles.preferencesRow}>
              <View style={styles.preferenceChip}>
                <Text style={styles.preferenceText}>Muscle Gain</Text>
              </View>
              <View style={styles.preferenceChip}>
                <Text style={styles.preferenceText}>High Protein</Text>
              </View>
            </View>
          </View>

          {/* --- Physical Stats Dashboard --- */}
          <View style={styles.statsGrid}>
            {/* Weight */}
            <View style={[styles.statCard, !isDarkTheme && styles.cardLight]}>
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Scale size={20} color="#38BDF8" />
              </View>
              <View>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={[styles.statValue, !isDarkTheme && styles.textLight]}>{weight} kg</Text>
              </View>
            </View>

            {/* Height */}
            <View style={[styles.statCard, !isDarkTheme && styles.cardLight]}>
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Ruler size={20} color="#a855f7" />
              </View>
              <View>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={[styles.statValue, !isDarkTheme && styles.textLight]}>{height} cm</Text>
              </View>
            </View>

            {/* BMI (Full Width) */}
            <View style={[styles.bmiCard, !isDarkTheme && styles.cardLight]}>
              <View style={styles.bmiHeader}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}>
                  <Activity size={20} color="#4ade80" />
                </View>
                <View>
                  <Text style={styles.statLabel}>BMI Index</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                    <Text style={[styles.statValue, !isDarkTheme && styles.textLight]}>{bmi}</Text>
                    <Text style={[styles.bmiCategory, { color: bmiInfo.color }]}>{bmiInfo.label}</Text>
                  </View>
                </View>
              </View>
              {/* Visual BMI Bar */}
              <View style={styles.bmiBarBg}>
                <View style={[styles.bmiBarFill, { width: `${(bmi / 40) * 100}%`, backgroundColor: bmiInfo.color }]} />
              </View>
            </View>
          </View>

          {/* --- Settings Section --- */}
          <Text style={[styles.sectionTitle, !isDarkTheme && styles.textLight]}>Settings</Text>
          
          <View style={[styles.settingsContainer, !isDarkTheme && styles.cardLight]}>
            
            {/* Location Setting */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#e0f2fe' }]}>
                  <MapPin size={20} color="#0284c7" />
                </View>
                <View>
                  <Text style={[styles.settingLabel, !isDarkTheme && styles.textLight]}>Location</Text>
                  <TextInput 
                    value={location}
                    onChangeText={setLocation}
                    style={[styles.settingInput, !isDarkTheme && styles.textLight]} 
                  />
                </View>
              </View>
              <Edit2 size={16} color="#94a3b8" />
            </View>

            <View style={[styles.divider, !isDarkTheme && styles.dividerLight]} />

            {/* Theme Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#f3e8ff' }]}>
                  {isDarkTheme ? <Moon size={20} color="#7c3aed" /> : <Sun size={20} color="#ca8a04" />}
                </View>
                <Text style={[styles.settingLabel, !isDarkTheme && styles.textLight]}>Dark Theme</Text>
              </View>
              <Switch
                trackColor={{ false: "#cbd5e1", true: "#38BDF8" }}
                thumbColor={isDarkTheme ? "#fff" : "#f4f4f5"}
                onValueChange={() => setIsDarkTheme(!isDarkTheme)}
                value={isDarkTheme}
              />
            </View>

            <View style={[styles.divider, !isDarkTheme && styles.dividerLight]} />

            {/* Privacy Act */}
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#dcfce7' }]}>
                  <Shield size={20} color="#16a34a" />
                </View>
                <Text style={[styles.settingLabel, !isDarkTheme && styles.textLight]}>Privacy & Security</Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>

            <View style={[styles.divider, !isDarkTheme && styles.dividerLight]} />

            {/* Logout handler wired here for functionality */}
            <TouchableOpacity style={styles.settingRow} onPress={async () => {
                try {
                  await signOut(auth);
                  Toast.show({ type: 'success', text1: 'Signed out', text2: 'You have been logged out.' });
                  router.replace('/login');
                } catch (error) {
                  console.error('Logout failed', error);
                  Toast.show({ type: 'error', text1: 'Logout Failed', text2: error.message });
                }
              }}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#fee2e2' }]}>
                    <LogOut size={20} color="#dc2626" />
                  </View>
                  <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Log Out</Text>
                </View>
              </TouchableOpacity>
          </View>

          {/* --- Footer --- */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Version 1.0.2</Text>
            <View style={styles.builtByTag}>
              <Text style={styles.builtByText}>Built by Levva</Text>
            </View>
          </View>
          
          {/* Spacer for Floating Nav */}
          <View style={{ height: 100 }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Theme Colors ---
  container: { flex: 1, backgroundColor: '#0f172a' },
  containerLight: { backgroundColor: '#f8fafc' },
  
  textLight: { color: '#1e293b' },
  cardLight: { backgroundColor: '#fff', borderColor: '#e2e8f0' },
  iconButtonLight: { backgroundColor: '#f1f5f9' },
  dividerLight: { backgroundColor: '#e2e8f0' },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },

  content: {
    padding: 20,
  },

  // --- Profile Card ---
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#38BDF8',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#38BDF8',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  preferencesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  preferenceChip: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  preferenceText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },

  // --- Stats Grid ---
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bmiCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bmiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  bmiCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  bmiBarBg: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bmiBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // --- Settings ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  settingInput: {
    color: '#94a3b8',
    fontSize: 13,
    padding: 0,
    marginTop: 2,
    minWidth: 150,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginLeft: 64, // Align with text
  },

  // --- Footer ---
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
  },
  builtByTag: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  builtByText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});