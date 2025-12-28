import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Make sure to install: npm install lucide-react-native react-native-svg
import {
  ChevronLeft,
  MoreVertical,
  Send,
  User,
  Zap
} from 'lucide-react-native';

export default function ChatScreen({ topic = 'question', onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();
  const [isTyping, setIsTyping] = useState(false);

  // Initialize chat based on topic
  useEffect(() => {
    const initialGreetings = {
      workout: "Ready to crush it? 💪 Let's build your workout plan. What equipment do you have access to?",
      diet: "Fueling your body right is key! 🥑 Any dietary preferences or allergies I should know?",
      question: "I'm your fitness assistant. Ask me anything about training, recovery, or nutrition!",
      motivation: "Mindset is everything. 🧠 How are you feeling about your goals today?",
    };

    const initialText = initialGreetings[topic] || "Hello! I'm here to help you reach your fitness goals.";

    // Reset messages when topic changes
    setMessages([]);

    const timer = setTimeout(() => {
      setMessages([{
        id: 'init',
        text: initialText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 300);

    return () => clearTimeout(timer);
  }, [topic]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate Bot Reply
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'bot',
        text: "Got it! Incorporating that into your plan. Keep pushing! 🔥 (Demo Response)",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Light content status bar for dark background */}
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Modern Dark Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={28} color="#f8fafc" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBot}>
                {/* User icon in white */}
                <User size={22} color="#fff" strokeWidth={2.5} />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Coach</Text>
              <Text style={styles.headerSubtitle}>Always Active</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={24} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateLabelContainer}>
          <Text style={styles.dateLabel}>TODAY</Text>
        </View>

        {messages.map((msg) => (
          <View key={msg.id} style={[
            styles.messageRow, 
            msg.sender === 'user' ? styles.messageRowUser : styles.messageRowBot
          ]}>
            
            {msg.sender === 'bot' && (
              <View style={styles.avatarBotSmall}>
                <User size={16} color="#38BDF8" />
              </View>
            )}

            <View style={[
              styles.bubble,
              msg.sender === 'bot' ? styles.bubbleBot : styles.bubbleUser
            ]}>
              <Text style={[
                styles.messageText,
                msg.sender === 'bot' ? styles.textBot : styles.textUser
              ]}>
                {msg.text}
              </Text>
              <Text style={[
                styles.timestamp,
                msg.sender === 'bot' ? styles.timestampBot : styles.timestampUser
              ]}>
                {msg.timestamp}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowBot]}>
            <View style={styles.avatarBotSmall}>
              <User size={16} color="#38BDF8" />
            </View>
            <View style={[styles.bubble, styles.bubbleBot, styles.typingBubble]}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, { animationDelay: '150ms', marginLeft: 4 }]} />
              <View style={[styles.typingDot, { animationDelay: '300ms', marginLeft: 4 }]} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Input Area (Dark Mode) */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.footer}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Zap size={22} color="#38BDF8" fill="#38BDF8" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#64748b"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            selectionColor="#38BDF8"
          />
          
          <TouchableOpacity 
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled
            ]}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark Slate 900
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#0f172a', // Matches body for seamless look
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b', // Slight separation
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBot: {
    width: 42,
    height: 42,
    backgroundColor: '#38BDF8', // Sky Blue 400
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10, // Glowing effect for dark mode
    elevation: 4,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    backgroundColor: '#22c55e',
    borderWidth: 2.5,
    borderColor: '#0f172a', // Matches background
    borderRadius: 7,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#f8fafc', // White text
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38BDF8',
    letterSpacing: 0.3,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#1e293b', // Slate 800
    borderRadius: 12,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatContent: {
    paddingVertical: 24,
    paddingBottom: 40,
  },
  dateLabelContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    backgroundColor: '#1e293b', // Slate 800
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    letterSpacing: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '80%',
  },
  messageRowBot: {
    alignSelf: 'flex-start',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    maxWidth: '85%',
  },
  avatarBotSmall: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#1e293b', // Slate 800
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 'auto',
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
  },
  bubbleBot: {
    backgroundColor: '#1e293b', // Slate 800 (Dark Surface)
    borderBottomLeftRadius: 6,
  },
  bubbleUser: {
    backgroundColor: '#38BDF8', // Sky Blue
    borderBottomRightRadius: 6,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.4, // Increased glow for dark mode
    shadowRadius: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  textBot: {
    color: '#f8fafc', // Light Text
  },
  textUser: {
    color: '#fff', // White Text
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  timestampBot: {
    color: '#94a3b8', // Slate 400
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    minWidth: 60,
    justifyContent: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748b', // Slate 500
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: Platform.OS === 'ios' ? 70 : 60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b', // Slate 800 (Dark Input)
    borderRadius: 30,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, // Darker shadow
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700 border
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155', // Slate 700
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#f8fafc', // White text
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 100,
    fontWeight: '500',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  sendButtonActive: {
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#334155', // Slate 700
  },
});