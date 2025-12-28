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
  Dimensions,
  TextInput,
  Platform,
  Alert
} from 'react-native';

// Make sure to install: npm install lucide-react-native
import { 
  ChevronLeft, 
  Search, 
  Navigation, 
  Star,
  Dumbbell,
  Trees,
  Footprints,
  Bell
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function NearbyScreen({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  // Dummy Data for Nearby Places
  const places = [
    { 
      id: 1, 
      name: 'Iron Paradise Gym', 
      type: 'Gym', 
      rating: 4.8, 
      distance: '0.8 km', 
      address: '124 Spartan Ave',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
      coords: { top: '30%', left: '40%' } 
    },
    { 
      id: 2, 
      name: 'Riverfront Trail', 
      type: 'Path', 
      rating: 4.9, 
      distance: '1.2 km', 
      address: 'Entrance at 5th St',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500',
      coords: { top: '50%', left: '70%' } 
    },
    { 
      id: 3, 
      name: 'City Park Loop', 
      type: 'Park', 
      rating: 4.5, 
      distance: '2.5 km', 
      address: 'Central District',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500',
      coords: { top: '65%', left: '25%' } 
    },
  ];

  const categories = ['All', 'Gym', 'Park', 'Path'];

  const handleSetReminder = (placeName) => {
    Alert.alert(
      "Reminder Set! ⏰",
      `We'll remind you to hit ${placeName} tomorrow morning at 7:00 AM.`,
      [{ text: "Let's Go!" }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* --- Simulated Map Background --- */}
      <View style={styles.mapContainer}>
        {/* Map Grid Pattern (Visual Only) */}
        <View style={styles.mapGridHorizontal} />
        <View style={[styles.mapGridHorizontal, { top: '40%' }]} />
        <View style={[styles.mapGridHorizontal, { top: '70%' }]} />
        <View style={styles.mapGridVertical} />
        <View style={[styles.mapGridVertical, { left: '60%' }]} />
        
        {/* Map Roads (Visual Only) */}
        <View style={styles.roadMain} />
        <View style={styles.roadCross} />

        {/* User Location Marker */}
        <View style={styles.userLocation}>
          <View style={styles.userLocationPulse} />
          <View style={styles.userLocationDot} />
        </View>

        {/* Place Markers */}
        {places.map((place) => (
          <TouchableOpacity 
            key={place.id}
            style={[styles.markerContainer, { top: place.coords.top, left: place.coords.left }]}
            onPress={() => setSelectedPlace(place)}
          >
            <View style={[
              styles.markerBubble, 
              selectedPlace?.id === place.id && styles.markerBubbleActive
            ]}>
              {place.type === 'Gym' && <Dumbbell size={14} color="#fff" />}
              {place.type === 'Path' && <Footprints size={14} color="#fff" />}
              {place.type === 'Park' && <Trees size={14} color="#fff" />}
            </View>
            <View style={styles.markerArrow} />
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Floating Header --- */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={28} color="#0f172a" />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput 
              placeholder="Find gyms, parks..." 
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity style={styles.filterButton}>
            <Navigation size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Categories Chips */}
        <View style={styles.categoryRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryChip, 
                  selectedCategory === cat && styles.categoryChipActive
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* --- Bottom Sheet Cards List --- */}
      <View style={styles.bottomSheet}>
        <Text style={styles.sectionTitle}>Nearby & Trending</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.cardsScroll}
          decelerationRate="fast"
          snapToInterval={width * 0.75 + 16} 
        >
          {places.map((place) => (
            <TouchableOpacity 
              key={place.id} 
              style={[
                styles.card,
                selectedPlace?.id === place.id && styles.cardActive
              ]}
              onPress={() => setSelectedPlace(place)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: place.image }} style={styles.cardImage} />
              
              <View style={styles.cardContent}>
                {/* --- Action Buttons (Moved to Top) --- */}
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.cardRemindButton} 
                    onPress={() => handleSetReminder(place.name)}
                  >
                    <Bell size={14} color="#38BDF8" />
                    <Text style={styles.cardRemindText}>Remind</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.cardGoButton}>
                    <Navigation size={14} color="#0f172a" />
                    <Text style={styles.cardGoText}>Go Now</Text>
                  </TouchableOpacity>
                </View>

                {/* Info Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{place.name}</Text>
                    <Text style={styles.cardSubtitle}>{place.type} • {place.distance}</Text>
                  </View>
                  <View style={styles.cardRating}>
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.cardRatingText}>{place.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b', 
  },
  safeArea: {
    zIndex: 20,
  },
  // --- Map Styling ---
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1e293b', 
    overflow: 'hidden',
  },
  mapGridHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#334155',
    top: '20%',
  },
  mapGridVertical: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#334155',
    left: '30%',
  },
  roadMain: {
    position: 'absolute',
    width: '120%',
    height: 12,
    backgroundColor: '#475569',
    top: '55%',
    left: -20,
    transform: [{ rotate: '-10deg' }],
  },
  roadCross: {
    position: 'absolute',
    width: 12,
    height: '120%',
    backgroundColor: '#475569',
    left: '50%',
    top: -20,
    transform: [{ rotate: '15deg' }],
  },
  userLocation: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#38BDF8',
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 2,
  },
  userLocationPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    zIndex: 1,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerBubble: {
    padding: 8,
    backgroundColor: '#a855f7',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerBubbleActive: {
    backgroundColor: '#38BDF8',
    transform: [{ scale: 1.2 }],
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff', 
    marginTop: -2,
  },
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    height: '100%',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#0f172a',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryRow: {
    marginTop: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#0f172a',
  },
  // --- Bottom Sheet ---
  bottomSheet: {
    position: 'absolute',
    bottom: 90, // Lifted up to clear the floating nav bar (approx 70px + margin)
    left: 0,
    right: 0,
    // Removed background color to make it look like floating cards
    paddingVertical: 10,
    height: 280, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 16,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardsScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: width * 0.75, 
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardActive: {
    borderColor: '#38BDF8',
    borderWidth: 1.5,
  },
  cardImage: {
    width: '100%',
    height: 100, // Slightly shorter to fit buttons
    backgroundColor: '#334155',
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10, // Added margin top since buttons are above
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardRatingText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -24, // Pull up to overlap image slightly or sit tight
    backgroundColor: '#1e293b', // Match card bg to cover image bottom
    paddingTop: 8,
    borderRadius: 12,
  },
  cardRemindButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0f172a', 
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  cardRemindText: {
    color: '#38BDF8',
    fontWeight: '600',
    fontSize: 12,
  },
  cardGoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#38BDF8',
    paddingVertical: 8,
    borderRadius: 12,
  },
  cardGoText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
  },
});