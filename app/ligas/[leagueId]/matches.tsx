import { StyleSheet, ScrollView } from 'react-native';
// Asegúrate de poner la ruta correcta a tu componente
import { MatchCard, MatchCardProps } from '@/components/ui/MatchCard'; 

const MOCK_MATCHES: MatchCardProps[] = [
  {
    localTeam: { name: 'Los Espartanos' },
    visitorTeam: { name: 'Real Bañil' },
    dateTime: { dateTime: '2026-10-12T10:00:00Z', duration: 90 },
    refereeAssigned: 'Colegiado A. López',
    resultResumee: { localTotalScore: 2, visitorTotalScore: 1 }
  },
  {
    localTeam: { name: 'Rayo Vayacaño' },
    visitorTeam: { name: 'Aston Birra' },
    dateTime: { dateTime: '2026-10-12T12:00:00Z', duration: 90 },
    // Sin resultado y sin árbitro asignado aún
  }
];

export default function MatchesTab() {
  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.contentContainer}>
      {MOCK_MATCHES.map((match, index) => (
        <MatchCard key={index} {...match} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { padding: 16, width: '100%', maxWidth: 800, alignSelf: 'center' },
});