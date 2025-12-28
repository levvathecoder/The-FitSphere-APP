import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';

// Make sure to install: npm install lucide-react-native react-native-svg
import { 
  ChevronLeft, 
  Plus, 
  Utensils, 
  Flame, 
  ScanBarcode,
  Droplets,
  Beef,
  Wheat
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DietScreen({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(27); // Default to today (dummy date)
  
  // Dummy User Data
  const userProfile = {
    goal: "Muscle Gain",
    preference: "High Protein",
    caloriesTarget: 2400,
    caloriesConsumed: 1450,
  };

  // Dummy Calendar Data
  const dates = [
    { day: 'Mon', date: 24 },
    { day: 'Tue', date: 25 },
    { day: 'Wed', date: 26 },
    { day: 'Thu', date: 27, active: true },
    { day: 'Fri', date: 28 },
    { day: 'Sat', date: 29 },
    { day: 'Sun', date: 30 },
  ];

  // Dummy Meal Data
  const meals = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      calories: 450,
      items: ['Oatmeal & Berries', '2 Boiled Eggs'],
      logged: true
    },
    {
      id: 'lunch',
      title: 'Lunch',
      calories: 720,
      items: ['Grilled Chicken Breast', 'Quinoa Salad', 'Avocado'],
      logged: true
    },
    {
      id: 'snack',
      title: 'Afternoon Snack',
      calories: 280,
      items: ['Greek Yogurt', 'Almonds'],
      logged: true
    },
    {
      id: 'dinner',
      title: 'Dinner',
      calories: 0,
      items: [],
      logged: false // Not logged yet
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* --- Fixed Header Section --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={28} color="#f8fafc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Diet Diary</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Alex&background=random' }} 
              style={styles.profileAvatar} 
            />
          </TouchableOpacity>
        </View>

        {/* Date Stripper (Calendar) */}
        <View style={styles.calendarContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
            {dates.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => setSelectedDate(item.date)}
                style={[
                  styles.dateItem, 
                  item.date === selectedDate && styles.dateItemActive
                ]}
              >
                <Text style={[styles.dateDay, item.date === selectedDate && styles.dateTextActive]}>{item.day}</Text>
                <Text style={[styles.dateNum, item.date === selectedDate && styles.dateTextActive]}>{item.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- MOVED: Fixed Action Buttons (Inside Header) --- */}
        <View style={styles.actionButtonsContainer}>
          {/* Manual Log Button */}
          <TouchableOpacity style={styles.manualButton}>
            <Plus size={24} color="#f8fafc" />
            <Text style={styles.manualButtonText}>Manual</Text>
          </TouchableOpacity>

          {/* Scan Button (Prominent) */}
          <TouchableOpacity style={styles.scanButton}>
            <View style={styles.scanIconContainer}>
              <ScanBarcode size={24} color="#0f172a" />
            </View>
            <Text style={styles.scanButtonText}>Scan Food</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Scrollable Content --- */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* --- Summary Card --- */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Daily Goal</Text>
              <Text style={styles.summaryGoalText}>{userProfile.goal} • {userProfile.preference}</Text>
            </View>
            <View style={styles.caloriesBadge}>
              <Flame size={14} color="#38BDF8" fill="#38BDF8" />
              <Text style={styles.caloriesText}>
                {userProfile.caloriesTarget - userProfile.caloriesConsumed} kcal left
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(userProfile.caloriesConsumed / userProfile.caloriesTarget) * 100}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>{userProfile.caloriesConsumed} consumed</Text>
              <Text style={styles.progressText}>{userProfile.caloriesTarget} target</Text>
            </View>
          </View>

          {/* Macro Split (Visual Only) */}
          <View style={styles.macroContainer}>
            <MacroItem icon={<Beef size={16} color="#38BDF8" />} label="Protein" val="110g" total="/ 180g" />
            <MacroItem icon={<Wheat size={16} color="#fbbf24" />} label="Carbs" val="140g" total="/ 220g" />
            <MacroItem icon={<Droplets size={16} color="#f87171" />} label="Fats" val="45g" total="/ 70g" />
          </View>
        </View>

        {/* --- Meal List --- */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealTitleRow}>
                  <View style={[styles.mealIcon, !meal.logged && styles.mealIconEmpty]}>
                    <Utensils size={18} color={meal.logged ? "#fff" : "#64748b"} />
                  </View>
                  <Text style={styles.mealName}>{meal.title}</Text>
                </View>
                {meal.logged ? (
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                ) : (
                  <TouchableOpacity style={styles.addMiniButton}>
                    <Plus size={16} color="#38BDF8" />
                  </TouchableOpacity>
                )}
              </View>

              {meal.logged ? (
                <View style={styles.foodList}>
                  {meal.items.map((item, idx) => (
                    <Text key={idx} style={styles.foodItem}>• {item}</Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyStateText}>Nothing logged yet.</Text>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component for Macros
function MacroItem({ icon, label, val, total }) {
  return (
    <View style={styles.macroItem}>
      <View style={styles.macroIconBg}>{icon}</View>
      <View>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          <Text style={{color: '#f8fafc', fontWeight: 'bold'}}>{val}</Text>
          <Text style={{color: '#64748b'}}> {total}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark Slate 900
  },
  header: {
    backgroundColor: '#0f172a',
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    zIndex: 10,
    // No "absolute" positioning needed here, it stays at the top naturally
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
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(30, 41, 59, 0.7)',
  },
  calendarContainer: {
    height: 60,
  },
  calendarScroll: {
    paddingHorizontal: 20,
  },
  dateItem: {
    width: 50,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1e293b', // Slate 800
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dateItemActive: {
    backgroundColor: '#38BDF8', // Sky Blue
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dateDay: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '600',
  },
  dateNum: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: 'bold',
  },
  dateTextActive: {
    color: '#0f172a', // Dark text on active blue
  },
  // --- New Styles for Buttons inside Header ---
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  manualButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 15,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38BDF8', // Sky Blue
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    flex: 1,
    maxWidth: 200,
    justifyContent: 'center',
  },
  scanIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#0f172a', // Dark text on blue
    fontWeight: '800',
    fontSize: 16,
  },
  // --- Content Styles ---
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  summaryCard: {
    backgroundColor: '#1e293b', // Slate 800
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryGoalText: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: 'bold',
  },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)', // Transparent Blue
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  caloriesText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  macroIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 16,
  },
  mealsSection: {
    gap: 16,
  },
  mealCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealIconEmpty: {
    backgroundColor: '#334155',
  },
  mealName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  mealCalories: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8',
  },
  addMiniButton: {
    padding: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
  },
  foodList: {
    paddingLeft: 48,
  },
  foodItem: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
  emptyStateText: {
    paddingLeft: 48,
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
});