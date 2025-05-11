import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const menuItems = [
  { id: 'screen-time', title: 'Ekran Süresi ve Aktiviteler', icon: 'time-outline' },
  { id: 'photo-archive', title: 'Taratılan Fotoğraf Arşivi', icon: 'images-outline' },
  { id: 'completed-lessons', title: 'Tamamlanılan Eğitimler', icon: 'school-outline' },
  { id: 'cartoon-history', title: 'Çizgi Film ve Masal Geçmişi', icon: 'film-outline' },
  { id: 'completed-tasks', title: 'Tamamlanılan Görevler', icon: 'checkmark-done-outline' },
];

export default function ParentDashboard() {
  const [isParentSelected, setIsParentSelected] = useState(true);
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isParentSelected]);

  return (
    <View style={styles.container}>
      {/* Panel seçim butonları */}
      <View style={styles.panelSelection}>
        <Pressable
          style={[styles.panelButton, isParentSelected && styles.activeButton]}
          onPress={() => setIsParentSelected(true)}
        >
          <Text style={[styles.panelText, isParentSelected && styles.activeText]}>
            Ebeveyn Paneli
          </Text>
        </Pressable>
        <Pressable
          style={[styles.panelButton, !isParentSelected && styles.activeButton]}
          onPress={() => {
            setIsParentSelected(false);
            router.push('/'); // Çocuk paneline yönlendir
          }}
        >
          <Text style={[styles.panelText, !isParentSelected && styles.activeText]}>
            Çocuk Paneli
          </Text>
        </Pressable>
      </View>

      {/* Animasyonlu içerik */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        {isParentSelected && (
          <LinearGradient colors={['#E0F7FA', '#F0F4F8']} style={styles.linearGradient}>
            <View style={styles.welcomeBox}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>E</Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>Ebeveyn Paneline Hoşgeldin</Text>
                <Text style={styles.subText}>Miniğin neler yaptığına göz at!</Text>
              </View>
            </View>

            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                  onPress={() => router.push(`/parent/${item.id}`)}
                >
                  <View style={styles.menuContent}>
                    <Ionicons name={item.icon} size={20} color="#4A90E2" style={styles.menuIcon} />
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#4A90E2" />
                  </View>
                </Pressable>
              ))}
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Uygulama İçi Tercihler</Text>
              <Pressable
                style={styles.settingsButton}
                onPress={() => router.push('/parent/settings')}
              >
                <Ionicons name="settings-outline" size={20} color="#4A90E2" />
                <Text style={styles.settingsText}>Ayarlar</Text>
                <Ionicons name="chevron-forward" size={18} color="#4A90E2" />
              </Pressable>
            </View>
          </LinearGradient>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  panelSelection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    // gap: 16,
    marginTop: 50, // daha da aşağı alındı
  },
  panelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#E0F7FA',
  },
  activeButton: {
    backgroundColor: '#4A90E2',
  },
  panelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  activeText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 60, // içeriği daha da aşağı al
  },
  linearGradient: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    padding: 16,
  },
  welcomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  subText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 12,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
  },
  settingsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  settingsButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
    marginLeft: 8,
    flex: 1,
  },
});
