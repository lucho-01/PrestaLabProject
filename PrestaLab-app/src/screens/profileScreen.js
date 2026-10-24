import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../contexts/userContext';
import { subscribeToLoans } from '../services/firestoreService';
import { logoutUser } from '../services/authService';
import Gloss from '../components/Gloss';

export default function ProfileScreen({ navigation }) {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    sanctions: 0,
  });

  useEffect(() => {
    const unsubscribe = subscribeToLoans(user?.uid, (loans) => {
      setStats({
        totalLoans: loans.length,
        activeLoans: loans.filter(loan => loan.estado === 'activo').length,
        sanctions: loans.filter(loan => loan.estado === 'sancionado').length,
      });
    });
    
    return () => unsubscribe();
  }, [user?.uid]);

  const handleSignOut = async () => {
    const result = await logoutUser();
    if (!result.success) {
      console.error('Error signing out:', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            Mi Perfil
          </Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.logoutText}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarRing}>
          {user?.photoURL ? (
            <Avatar.Image 
              size={184} 
              source={{ uri: user?.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, styles.avatar]}>
              <MaterialCommunityIcons name="account" size={80} color="#256B42" />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="pencil" size={20} color="#FEFFFE" />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>
        {user?.displayName || 'Usuario'}
      </Text>

      <View style={styles.statsCard}>
        <Gloss tone="light" />
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>
              Préstamos
            </Text>
            <Text style={styles.statValue}>
              {stats.totalLoans}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>
              Activos
            </Text>
            <Text style={styles.statValue}>
              {stats.activeLoans}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>
              Sanciones
            </Text>
            <Text style={styles.statValue}>
              {stats.sanctions}
            </Text>
          </View>
        </View>
      </View>

      <Card style={styles.menuCard}>
        <Card.Content style={styles.menuContent}>
          <Gloss tone="light" />
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons 
              name="history" 
              size={24} 
              color="#256B42" 
            />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>
                Historial de préstamos
              </Text>
              <Text style={styles.menuSubtitle}>
                Ver todos tus préstamos anteriores
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#256B42" 
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <Card.Content style={styles.menuContent}>
          <Gloss tone="light" />
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons 
              name="chart-line" 
              size={24} 
              color="#256B42" 
            />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>
                Estadísticas
              </Text>
              <Text style={styles.menuSubtitle}>
                Consumos y frecuencias de uso
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#256B42" 
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FBF6',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#181C1A',
  },
  logoutText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    fontWeight: '500',
    color: '#B3261E',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarRing: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#256B42',
    padding: 4,
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#DEE4E0',
  },
  avatarPlaceholder: {
    width: 184,
    height: 184,
    borderRadius: 92,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 100,
    bottom: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#256B42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#181C1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(37,107,66,0.45)',
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#256B42',
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#3E4941',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#181C1A',
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(37,107,66,0.45)',
    overflow: 'hidden',
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#181C1A',
  },
  menuSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#3E4941',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 100,
  },
});
