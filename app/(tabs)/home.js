import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; // Using MaterialCommunityIcons for better fitness icons
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { auth, db } from '../../firebaseConfig';

// --- STUDENT NOTE: Constants for maintainability ---
// Using a "Cyber-Dark" palette to differentiate from generic health apps.
const COLORS = {
  background: '#0f172a',    // Deep slate
  cardBg: 'rgba(30, 41, 59, 0.7)', // Glassy dark
  primary: '#38bdf8',       // Electric Blue
  accent: '#a855f7',        // Purple for Gamification
  text: '#f8fafc',
  textSub: '#94a3b8',
  success: '#4ade80',
  food: '#10b981'           // Emerald for Food
};

const { width } = Dimensions.get('window');

// --- STUDENT NOTE: Reusable Component Strategy ---
// Instead of repeating BlurView code, I created a wrapper. 
// This reduces code duplication (DRY Principle) and ensures UI consistency.
const GlassContainer = ({ children, style, intensity = 20 }) => (
  <View style={[styles.glassWrapper, style]}>
    <BlurView intensity={intensity} tint="dark" style={styles.blurContent}>
      {children}
    </BlurView>
  </View>
);

// --- STUDENT NOTE: Activity Grid Item ---
// A dedicated component for the workout buttons ensures they are touch-friendly targets.
const ActivityButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.activityBtn} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.activityIconCircle, { backgroundColor: `${color}20` }]}>
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.activityLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Athlete');
  const [userGoal, setUserGoal] = useState('Stay Fit'); // Default fallback

  useEffect(() => {
    // --- STUDENT NOTE: Async Data Fetching ---
    // We fetch profile data on mount. 
    // Ideally, we would implement a caching strategy here later to reduce Firestore reads.
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return router.replace('/login');

        // Simple parsing of email for a display name
        const emailName = user.email.split('@')[0];
        setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));

        const docSnap = await getDoc(doc(db, 'profiles', user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Formatting goal text for display
          if (data.goal) {
            setUserGoal(data.goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
          }
        } else {
          router.replace('/setupProfile');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers ---
  const handleLogWorkout = (type) => {
    // STUDENT NOTE: In a future sprint, this will pass the 'type' param 
    // to the workout logger screen.
    Toast.show({
      type: 'info',
      text1: `Logging ${type}`,
      text2: 'Opening workout tracker...'
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.background, '#1e1b4b']} // Subtle shift to purple at bottom
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* --- SECTION 1: Header & Goal Edit --- */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}</Text>
            <TouchableOpacity style={styles.goalChip} onPress={() => router.push('/setupProfile')}>
              <Text style={styles.goalText}>{userGoal}</Text>
              <FontAwesome name="pencil" size={12} color={COLORS.primary} style={{marginLeft: 6}} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${userName}&background=random` }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>

        {/* --- SECTION 2: Motivational Quote --- */}
        {/* STUDENT NOTE: Hardcoded for MVP as per requirements. 
            Designed as a high-contrast card to grab attention immediately. */}
        <LinearGradient
          colors={[COLORS.primary, '#3b82f6']}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          style={styles.quoteCard}
        >
          <FontAwesome name="quote-left" size={20} color="rgba(255,255,255,0.3)" />
          <Text style={styles.quoteText}>
            "The only bad workout is the one that didn't happen."
          </Text>
        </LinearGradient>

        {/* --- NEW SECTION: Hey Coach Button --- */}
        <TouchableOpacity 
          style={styles.coachButton} 
          onPress={() => router.push('/(tabs)/chat')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.accent, '#7c3aed']}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            style={styles.coachGradient}
          >
            <View style={styles.coachContent}>
              <View>
                <Text style={styles.coachTitle}>Hey Coach!</Text>
                <Text style={styles.coachSubtitle}>Ask me anything about fitness</Text>
              </View>
              <MaterialCommunityIcons name="robot-excited" size={32} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* --- SECTION 3: Activity Command Center --- */}
        <Text style={styles.sectionTitle}>Log Activity</Text>
        <GlassContainer style={styles.activityGrid}>
          <View style={styles.row}>
            <ActivityButton icon="dumbbell" label="Gym" color="#f472b6" onPress={() => handleLogWorkout('Gym')} />
            <ActivityButton icon="run" label="Running" color="#4ade80" onPress={() => handleLogWorkout('Running')} />
            <ActivityButton icon="bike" label="Cycling" color="#fbbf24" onPress={() => handleLogWorkout('Cycling')} />
          </View>
          <View style={[styles.row, { marginTop: 15 }]}>
            <ActivityButton icon="rowing" label="Hyrox" color="#f87171" onPress={() => handleLogWorkout('Hyrox')} />
            <ActivityButton icon="yoga" label="Yoga" color="#818cf8" onPress={() => handleLogWorkout('Yoga')} />
            <ActivityButton icon="dots-horizontal" label="More" color="#94a3b8" onPress={() => {}} />
          </View>
        </GlassContainer>

        {/* --- NEW SECTION: Log Food Button --- */}
        <TouchableOpacity 
          style={styles.logFoodButton} 
          onPress={() => router.push('/(tabs)/diet')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="food-apple" size={24} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.logFoodText}>Log Food & Nutrition</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* --- SECTION 4: Gamification Teaser --- */}
        {/* STUDENT NOTE: This links to our future ML-powered gamification screen. 
            We show a 'Level' visual to encourage interaction. */}
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => { /* Navigate to Gamification */ }}>
          <GlassContainer style={styles.gameCard}>
            <View style={styles.gameContent}>
              <View>
                <Text style={styles.gameLabel}>Current Status</Text>
                <Text style={styles.gameLevel}>Level 5: Consistency King</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '65%' }]} />
                </View>
                <Text style={styles.xpText}>650 / 1000 XP</Text>
              </View>
              <Image 
                source={require('../../assets/images/appLogo.png')} // Using app logo as 'badge' for now
                style={styles.gameBadge}
              />
            </View>
          </GlassContainer>
        </TouchableOpacity>

        {/* --- SECTION 5: Fitness News Feed (Vertical) --- */}
        {/* STUDENT NOTE: Switched to vertical stacking for better readability. */}
        <Text style={styles.sectionTitle}>Trending News</Text>
        <View style={styles.newsContainer}>
          <View style={styles.newsCardVertical}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' }} style={styles.newsImageVertical} />
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsTitle}>5 Science-Backed Benefits of HIIT</Text>
              <Text style={styles.newsSubtitle}>High intensity interval training can boost...</Text>
            </View>
          </View>
          <View style={styles.newsCardVertical}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500' }} style={styles.newsImageVertical} />
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsTitle}>The Best Foods for Recovery</Text>
              <Text style={styles.newsSubtitle}>What to eat after a hard gym session.</Text>
            </View>
          </View>
          <View style={styles.newsCardVertical}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500' }} style={styles.newsImageVertical} />
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsTitle}>Sleep: The Hidden Muscle Builder</Text>
              <Text style={styles.newsSubtitle}>Why 8 hours is non-negotiable for gains.</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 20 }, // Added paddingBottom
  
  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 5 },
  goalChip: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(56, 189, 248, 0.15)', 
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    alignSelf: 'flex-start'
  },
  goalText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.cardBg },

  // Quote Card
  quoteCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20, // Reduced margin to fit Coach button close
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  quoteText: { color: '#fff', fontSize: 16, fontStyle: 'italic', fontWeight: '600', marginTop: 5 },

  // Coach Button
  coachButton: {
    marginBottom: 30,
    borderRadius: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  coachGradient: {
    padding: 20,
    borderRadius: 20,
  },
  coachContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coachTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  coachSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  // Sections
  sectionTitle: { fontSize: 18, color: COLORS.text, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },

  // Glass Container
  glassWrapper: { borderRadius: 20, overflow: 'hidden', backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  blurContent: { padding: 20 },

  // Activity Grid
  activityGrid: { paddingVertical: 25 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  activityBtn: { alignItems: 'center', width: width / 4.5 },
  activityIconCircle: {
    width: 55, height: 55, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  activityLabel: { color: COLORS.textSub, fontSize: 12, fontWeight: '500' },

  // Log Food Button
  logFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.food,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: COLORS.food,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  logFoodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Gamification
  gameCard: { marginBottom: 30 },
  gameContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gameLabel: { color: COLORS.textSub, fontSize: 12, textTransform: 'uppercase' },
  gameLevel: { color: COLORS.accent, fontSize: 18, fontWeight: 'bold', marginVertical: 5 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, width: 150, marginTop: 5 },
  progressBarFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },
  xpText: { color: COLORS.textSub, fontSize: 10, marginTop: 5 },
  gameBadge: { width: 60, height: 60, resizeMode: 'contain', opacity: 0.8 },

  // News Vertical
  newsContainer: {
    gap: 15,
  },
  newsCardVertical: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  newsImageVertical: {
    width: 100,
    height: 100,
  },
  newsTextContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  newsTitle: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  newsSubtitle: { color: COLORS.textSub, fontSize: 12 },
});