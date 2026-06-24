import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// 1. IMPORTAMOS TUS TIPOS EXACTOS DESDE TU ARCHIVO
import {
  ClassificationPhaseDetails,
  TournamentPhaseDetails,
} from '@/types/api';
import { PhaseCard } from '@/components/ui/PhaseCard';

// Creamos un tipo unión para manejar ambos casos cómodamente
type Phase = ClassificationPhaseDetails | TournamentPhaseDetails;

// --- DATOS MOCK (Adaptados a tus tipos importados) ---
const MOCK_PHASES: any[] = [
  {
    id: 'fase-1', // Lo añadimos para react 'key' y navegación
    name: 'Fase de Grupos (Apertura)',
    startDate: '2026-09-01T10:00:00Z',
    endDate: '2026-11-30T23:59:59Z',
    sequenceOrder: 1,
    // Simulamos que el backend te devuelve un discriminador si no lo trae el type por defecto
    isClassification: true,
    groups: [
      { topWinners: 2, teams: [{}, {}, {}, {}] },
      { topWinners: 2, teams: [{}, {}, {}, {}] },
    ],
  },
  {
    id: 'fase-2',
    name: 'Playoffs Finales',
    startDate: '2026-12-05T10:00:00Z',
    endDate: '2026-12-20T23:59:59Z',
    sequenceOrder: 2,
    isClassification: false,
    matchesOrder: [
      { indexOrder: 1, match: {} },
      { indexOrder: 2, match: {} },
      { indexOrder: 3, match: {} },
    ],
  },
];

// --- PANTALLA PRINCIPAL ---
export default function PhasesTab() {
  const router = useRouter();
  const { leagueId } = useLocalSearchParams();

  const sortedPhases = [...MOCK_PHASES].sort((a, b) =>
    Number(a.sequenceOrder) - Number(b.sequenceOrder)
  );

  const handlePhasePress = (phaseId: string) => {
    router.push(`/ligas/${leagueId}/fases/${phaseId}` as any);
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {sortedPhases.map((phase, index) => (
        <View key={(phase as any).id || index}>
          <PhaseCard
            phase={phase}
            onPress={() => handlePhasePress((phase as any).id)}
          />

          {index < sortedPhases.length - 1 && (
            <View style={styles.connectorContainer}>
              <View style={styles.connectorLine} />
              <Ionicons name="arrow-down-circle" size={28} color="#D1D5DB" />
              <View style={styles.connectorLine} />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: {
    padding: 16,
    paddingTop: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  phaseDates: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  badgeActive: {
    backgroundColor: '#DEF7EC',
    color: '#03543F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  badgePending: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  badgeFinished: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryText: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 6,
    fontWeight: '500',
  },
  connectorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    height: 50,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
});
