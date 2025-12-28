 import React, { useRef, useEffect } from 'react';

import {

  View,

  TouchableOpacity,

  StyleSheet,

  Dimensions,

  Animated,

  Platform,

  PanResponder,

  Text

} from 'react-native';

import { Tabs } from 'expo-router';

import { MaterialCommunityIcons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');


// --- CONFIGURATION ---

const TAB_MARGIN = 20; // Margin on sides of the floating bar

const BAR_WIDTH = width - (TAB_MARGIN * 2);

const TAB_WIDTH = BAR_WIDTH / 5; // 5 Tabs


// --- CUSTOM TAB BAR COMPONENT ---

function CustomTabBar({ state, descriptors, navigation }) {

  // Animation Value

  const translateX = useRef(new Animated.Value(0)).current;


  // Animate indicator when active tab changes

  useEffect(() => {

    Animated.spring(translateX, {

      toValue: state.index * TAB_WIDTH,

      useNativeDriver: true,

      damping: 15,

      mass: 1,

      stiffness: 120,

    }).start();

  }, [state.index]);


  // --- GESTURE HANDLER (Slide to Switch) ---

  const panResponder = useRef(

    PanResponder.create({

      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {

        // Optional: Add haptic feedback here

      },

      onPanResponderMove: (evt, gestureState) => {

        const { moveX } = gestureState;

        // Calculate which tab index the finger is currently over

        // We subtract TAB_MARGIN because the bar starts after the margin

        const relativeX = moveX - TAB_MARGIN;

       

        // Determine index

        let newIndex = Math.floor(relativeX / TAB_WIDTH);

       

        // Clamp index between 0 and 4 to prevent errors

        newIndex = Math.max(0, Math.min(newIndex, state.routes.length - 1));


        // Navigate only if the index changes

        if (newIndex !== state.index) {

          const route = state.routes[newIndex];

          navigation.navigate(route.name);

        }

      },

      onPanResponderTerminationRequest: () => false,

      onPanResponderRelease: () => {},

    })

  ).current;


  return (

    <View style={styles.container}>

      {/* Apply PanHandlers to the TabBar container so dragging anywhere

        on the bar triggers the slide logic.

      */}

      <View style={styles.tabBar} {...panResponder.panHandlers}>

       

        {/* Sliding Active Indicator (The Glowing Pill) */}

        <Animated.View

          style={[

            styles.activeIndicator,

            { transform: [{ translateX }] }

          ]}

        >

          <View style={styles.activeGlow} />

        </Animated.View>


        {/* Tab Icons */}

        {state.routes.map((route, index) => {

          const { options } = descriptors[route.key];

          const isFocused = state.index === index;


          const onPress = () => {

            const event = navigation.emit({

              type: 'tabPress',

              target: route.key,

              canPreventDefault: true,

            });


            if (!isFocused && !event.defaultPrevented) {

              navigation.navigate(route.name);

            }

          };


          // Icon Mapping based on Route Name

          let iconName;

          let labelName;

         

          if (route.name === 'home') { iconName = 'home-variant'; labelName = 'Home'; }

          else if (route.name === 'chat') { iconName = 'robot'; labelName = 'Coach'; }

          else if (route.name === 'diet') { iconName = 'food-apple'; labelName = 'Diet'; }

          else if (route.name === 'gamification') { iconName = 'trophy-outline'; labelName = 'Game'; }

          else if (route.name === 'nearby') { iconName = 'map-marker-radius'; labelName = 'NearBy'; }


          return (

            <TouchableOpacity

              key={index}

              onPress={onPress}

              style={styles.tabItem}

              activeOpacity={0.8}

            >

              <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>

                <MaterialCommunityIcons

                  name={iconName}

                  size={isFocused ? 22 : 24}

                  color={isFocused ? '#0f172a' : '#94a3b8'}

                />

               

                {/* Label appears only when focused */}

                {isFocused && (

                  <Text style={styles.label} numberOfLines={1}>

                    {labelName}

                  </Text>

                )}

              </View>

            </TouchableOpacity>

          );

        })}

      </View>

    </View>

  );

}


// --- MAIN LAYOUT EXPORT ---

export default function TabLayout() {

  return (

    <Tabs

      tabBar={props => <CustomTabBar {...props} />}

      screenOptions={{

        headerShown: false,

        // Hide standard tab bar since we are using a custom one

        tabBarStyle: {

          display: 'none',

        },

      }}

    >

      <Tabs.Screen name="home" options={{ title: 'Home' }} />

      <Tabs.Screen name="chat" options={{ title: 'Coach' }} />

      <Tabs.Screen name="diet" options={{ title: 'Diet' }} />

      <Tabs.Screen name="gamification" options={{ title: 'Game Plan' }} />

      <Tabs.Screen name="nearby" options={{ title: 'Near-By' }} />

     

      {/* Hidden Profile Route (Accessible from Home Header) */}

      <Tabs.Screen

        name="profile"

        options={{

          href: null,

        }}

      />

    </Tabs>

  );

}


// --- STYLES ---

const styles = StyleSheet.create({

  container: {

    position: 'absolute',

    bottom: Platform.OS === 'ios' ? 30 : 20,

    left: TAB_MARGIN,

    right: TAB_MARGIN,

    alignItems: 'center',

    backgroundColor: 'transparent',

    zIndex: 1000,

  },

  tabBar: {

    flexDirection: 'row',

    width: BAR_WIDTH,

    height: 70,

    // --- Liquid Glass Effect ---

    backgroundColor: 'rgba(30, 41, 59, 0.85)', // Semi-transparent Dark Slate

    borderRadius: 35, // Fully rounded pill

    alignItems: 'center',

    justifyContent: 'flex-start',

    // Shadow / Glow

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 10 },

    shadowOpacity: 0.4,

    shadowRadius: 20,

    elevation: 10,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.1)', // Subtle glass border

    overflow: 'hidden', // Ensures indicator stays inside

  },

  tabItem: {

    width: TAB_WIDTH,

    height: '100%',

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 2,

  },

  activeIndicator: {

    position: 'absolute',

    left: 0,

    width: TAB_WIDTH,

    height: '100%',

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 1,

  },

  activeGlow: {

    width: 60,

    height: 60,

    borderRadius: 30,

    backgroundColor: '#38BDF8', // Sky Blue

    shadowColor: '#38BDF8',

    shadowOffset: { width: 0, height: 0 },

    shadowOpacity: 0.8, // Stronger glow

    shadowRadius: 20,

    elevation: 5,

    opacity: 0.9, // Slight transparency for liquid feel

  },

  iconWrapper: {

    alignItems: 'center',

    justifyContent: 'center',

    height: '100%',

    width: '100%',

  },

  iconWrapperActive: {

    // Shifts up slightly to make room for text

    paddingBottom: 2,

  },

  label: {

    color: '#0f172a',

    fontSize: 10,

    fontWeight: '700',

    marginTop: 2,

  },

}); 