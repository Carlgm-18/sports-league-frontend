import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TeamCard } from '@/components/ui/TeamCard';

const MOCK_TEAMS = [
  { id: 1, name: 'Los Espartanos', players: 15 },
  { id: 2, name: 'Real Bañil', players: 10 },
  { id: 3, name: 'Rayo Vayacaño', players: 14 },
  { id: 4, name: 'Radio Patio', players: 9 },
  { id: 5, name: 'Las supernenas', players: 5 },
  { id: 6, name: 'Fangoria', players: 13 },
];

export default function TeamsTab() {
  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <Link href="/ligas/[id]/new-team" asChild>
        <Pressable style={styles.createTeamBanner}>
          <Ionicons name="add-circle" size={24} color="#2196F3" />
          <View style={styles.createTeamTextContainer}>
            <Text style={styles.createTeamTitle}>¿Tienes tu propio grupo?</Text>
            <Text style={styles.createTeamSubtitle}>
              Crea un equipo nuevo y únete a la liga
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>
      </Link>

      <Text style={styles.sectionTitle}>Equipos disponibles en la liga</Text>

    {MOCK_TEAMS.map(team => (
    <TeamCard 
        key={team.id}
        name={team.name}
        playersCount={team.players}
        coachName="Entrenador Ejemplo"
        iconImageUrl='https://es.vecteezy.com/arte-vectorial/425859-vector-icono-de-escudo'
        onPressJoin={() => console.log(`Solicitando unirse a ${team.name}`)}
    />
    ))}
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
  createTeamBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 24,
  },
  createTeamTextContainer: { flex: 1, marginLeft: 12 },
  createTeamTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E3A8A' },
  createTeamSubtitle: { fontSize: 14, color: '#3B82F6', marginTop: 2 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  teamPlayers: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  joinButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  joinButtonText: { color: '#4B5563', fontWeight: '600', fontSize: 13 },
});
