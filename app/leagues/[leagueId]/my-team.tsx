import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_MY_TEAM = {
  name: 'Rayo Vayacaño',
  coach: 'Carlos Martínez',
  roster: ['Juan Pérez', 'Miguel Gómez', 'Álex Ruiz', 'David Torres'],
};

export default function MyTeamTab() {
  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <View style={styles.myTeamHeader}>
          <View style={styles.shieldDummy}>
            <Ionicons name="shield-outline" size={28} color="#9CA3AF" />
          </View>
          <View>
            <Text style={styles.myTeamTitle}>{MOCK_MY_TEAM.name}</Text>
            <Text style={styles.myTeamSubtitle}>
              Entrenador: {MOCK_MY_TEAM.coach}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitleSmall}>Plantilla actual</Text>

        {MOCK_MY_TEAM.roster.map((player, index) => (
          <View key={index} style={styles.playerRow}>
            <Ionicons name="person-circle-outline" size={24} color="#6B7280" />
            <Text style={styles.playerName}>{player}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: {
    padding: 16,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  myTeamHeader: { flexDirection: 'row', alignItems: 'center' },
  shieldDummy: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myTeamTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  myTeamSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  playerName: { fontSize: 15, color: '#111827', marginLeft: 12 },
});
