import { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Make sure to install: npm install lucide-react-native
import {
    CheckCircle2,
    ChevronLeft,
    Clock,
    Crown,
    Droplets,
    Flame,
    Footprints,
    Lock,
    Sword,
    Trophy
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function GamificationScreen({ onBack }) {
  // Dummy User State
  const [xp, setXp] = useState(650);
  const totalXp = 1000;
  const level = 5;
  
  // Dummy Daily Quests Data
  const [quests, setQuests] = useState([
    { id: 1, title: 'Hydration Hero', subtitle: 'Drink 2L Water', icon: <Droplets size={20} color="#38BDF8" />, progress: 1.5, target: 2, unit: 'L', completed: false, streak: 12 },
    { id: 2, title: 'Step Master', subtitle: '10,000 Steps', icon: <Footprints size={20} color="#4ade80" />, progress: 6500, target: 10000, unit: '', completed: false, streak: 5 },
    { id: 3, title: 'Zone 2 Cardio', subtitle: '30 Mins Active', icon: <Clock size={20} color="#fbbf24" />, progress: 30, target: 30, unit: 'm', completed: true, streak: 21 },
    { id: 4, title: 'Stand Up', subtitle: '1 Hour Standing', icon: <UserStandIcon />, progress: 45, target: 60, unit: 'm', completed: false, streak: 3 },
  ]);

  // Dummy Campaign Data (The Workout Plan)
  const campaign = {
    name: "The Iron Fortress",
    chapter: "Chapter 1: Foundation",
    currentLevel: 12, // Day 12
    totalLevels: 30,
    todayMission: "Chest & Shoulders Siege",
    difficulty: "Medium",
    loot: "50 XP + Rare Badge"
  };

  const toggleQuest = (id) => {
    // Logic to toggle completion for demo purposes
    setQuests(prev => prev.map(q => 
      q.id === id ? { ...q, completed: !q.completed } : q
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* --- Header: Player Stats --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={28} color="#f8fafc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Player Profile</Text>
          <TouchableOpacity style={styles.rankButton}>
            
          </TouchableOpacity>
        </View>

        {/* Level & XP Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelInfo}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Alex&background=random' }} 
              style={styles.avatar} 
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.playerName}>Alex The Great</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>LVL {level}</Text>
                </View>
              </View>
              <Text style={styles.playerTitle}>Consistency King</Text>
              
              {/* XP Bar */}
              <View style={styles.xpContainer}>
                <View style={styles.xpBarBg}>
                  <View style={[styles.xpBarFill, { width: `${(xp / totalXp) * 100}%` }]} />
                </View>
                <Text style={styles.xpText}>{xp} / {totalXp} XP to Level {level + 1}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* --- Section 1: Campaign Mode (Workout) --- */}
        <Text style={styles.sectionTitle}>Current Campaign</Text>
        <TouchableOpacity activeOpacity={0.9} style={styles.campaignCard}>
          {/* Background Image Overlay Effect would go here */}
          <View style={styles.campaignHeader}>
            <View style={styles.campaignIconBg}>
              <Sword size={24} color="#a855f7" />
            </View>
            <View>
              <Text style={styles.campaignTitle}>{campaign.name}</Text>
              <Text style={styles.campaignSubtitle}>{campaign.chapter}</Text>
            </View>
            <View style={styles.streakBadge}>
              <Flame size={16} color="#ef4444" fill="#ef4444" />
              <Text style={styles.streakText}>12 Day Streak</Text>
            </View>
          </View>

          <View style={styles.missionCard}>
            <Text style={styles.missionLabel}>TODAY'S QUEST • LEVEL {campaign.currentLevel}</Text>
            <Text style={styles.missionTitle}>{campaign.todayMission}</Text>
            
            <View style={styles.lootRow}>
              <Text style={styles.lootText}>Rewards: {campaign.loot}</Text>
            </View>

            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playButtonText}>START MISSION</Text>
            </TouchableOpacity>
          </View>

          {/* Level Progress Visual */}
          <View style={styles.levelMap}>
            <View style={[styles.mapNode, styles.nodeCompleted]}><CheckCircle2 size={12} color="#fff" /></View>
            <View style={[styles.mapLine, styles.lineCompleted]} />
            <View style={[styles.mapNode, styles.nodeActive]}><View style={styles.nodeInner} /></View>
            <View style={styles.mapLine} />
            <View style={styles.mapNode}><Lock size={12} color="#64748b" /></View>
            <View style={styles.mapLine} />
            <View style={styles.mapNode}><Trophy size={12} color="#64748b" /></View>
          </View>
        </TouchableOpacity>

        {/* --- Section 2: Daily Side Quests (Habits) --- */}
        <Text style={styles.sectionTitle}>Daily Side Quests</Text>
        <View style={styles.questGrid}>
          {quests.map((quest) => (
            <TouchableOpacity 
              key={quest.id} 
              onPress={() => toggleQuest(quest.id)}
              activeOpacity={0.8}
              style={[
                styles.questCard, 
                quest.completed && styles.questCardCompleted
              ]}
            >
              <View style={styles.questHeader}>
                <View style={[styles.questIconBg, { backgroundColor: quest.completed ? 'rgba(74, 222, 128, 0.2)' : '#1e293b' }]}>
                  {quest.completed ? <CheckCircle2 size={20} color="#4ade80" /> : quest.icon}
                </View>
                {quest.streak > 0 && (
                  <View style={styles.questStreak}>
                    <Flame size={10} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.questStreakText}>{quest.streak}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.questInfo}>
                <Text style={[styles.questTitle, quest.completed && styles.textCompleted]}>{quest.title}</Text>
                <Text style={styles.questSubtitle}>{quest.subtitle}</Text>
              </View>

              {/* Mini Progress Bar for incomplete items */}
              {!quest.completed && (
                <View style={styles.miniProgressContainer}>
                  <View style={styles.miniProgressBg}>
                    <View style={[styles.miniProgressFill, { width: `${(quest.progress / quest.target) * 100}%` }]} />
                  </View>
                  <Text style={styles.miniProgressText}>
                    {quest.progress}/{quest.target}{quest.unit}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Custom Icon for Standing
const UserStandIcon = () => (
  <View style={{ width: 2, height: 12, backgroundColor: '#f87171', borderRadius: 1 }}>
    <View style={{ width: 6, height: 6, backgroundColor: '#f87171', borderRadius: 3, position: 'absolute', top: -8, left: -2 }} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark Slate 900
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#0f172a',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  rankButton: {
    padding: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.15)', // Amber tint
    borderRadius: 12,
  },
  // Level Card
  levelCard: {
    marginHorizontal: 20,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#a855f7', // Purple Accent
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  levelBadge: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  playerTitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  xpContainer: {
    gap: 6,
  },
  xpBarBg: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#a855f7',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 10,
    color: '#a855f7',
    fontWeight: '600',
    textAlign: 'right',
  },
  // Sections
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 16,
  },
  // Campaign Card
  campaignCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#a855f7', // Purple border for "Epic" feel
    marginBottom: 30,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  campaignIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  campaignSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  streakBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)', // Red tint
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '700',
  },
  missionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  missionLabel: {
    fontSize: 10,
    color: '#a855f7',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  lootRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  lootText: {
    fontSize: 12,
    color: '#fbbf24',
    fontStyle: 'italic',
  },
  playButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  // Level Map Visual
  levelMap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  mapNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  nodeCompleted: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  nodeActive: {
    borderColor: '#a855f7',
    backgroundColor: '#0f172a',
  },
  nodeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a855f7',
  },
  mapLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  lineCompleted: {
    backgroundColor: '#a855f7',
  },
  // Side Quests Grid
  questGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  questCard: {
    width: (width - 52) / 2, // 2 column grid
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  questCardCompleted: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // Dimmed when done
    borderColor: '#4ade80',
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  questStreakText: {
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: '700',
  },
  questInfo: {
    marginBottom: 12,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  textCompleted: {
    color: '#4ade80',
    textDecorationLine: 'line-through',
  },
  questSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
  },
  miniProgressContainer: {
    gap: 4,
  },
  miniProgressBg: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  miniProgressText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right',
  },
});