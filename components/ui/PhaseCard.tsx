import { ClassificationPhaseDetails, TournamentPhaseDetails } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, Text, StyleSheet } from 'react-native';

// Creamos un tipo unión para manejar ambos casos cómodamente
type Phase = ClassificationPhaseDetails | TournamentPhaseDetails;
export const PhaseCard = ({
  phase,
  onPress,
}: {
  phase: Phase & { isClassification?: boolean };
  onPress: () => void;
}) => {
  const cardBg = '#FFFFFF';
  const borderColor = '#E5E7EB';

  const now = new Date();
  const startDate = new Date(phase.startDate);
  const endDate = new Date(phase.endDate);

  let status: 'finished' | 'active' | 'pending' = 'pending';
  if (now > endDate) status = 'finished';
  else if (now >= startDate && now <= endDate) status = 'active';

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
  };
  const dateStr = `${startDate.toLocaleDateString('es-ES', formatOptions)} - ${endDate.toLocaleDateString('es-ES', formatOptions)}`;

  // Determinamos el tipo. (Ajusta la lógica si tu backend te manda un campo 'type' en lugar de usar duck-typing)
  const isClassification = phase.isClassification || 'groups' in phase;

  const summaryText = isClassification
    ? `${(phase as ClassificationPhaseDetails).groups?.length || 0} Grupos formados`
    : `${(phase as TournamentPhaseDetails).matchesOrder?.length || 0} Partidos eliminatorios`;

  const PhaseIcon = isClassification ? 'grid-outline' : 'trophy-outline';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBg, borderColor: borderColor },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={PhaseIcon} size={20} color="#4B5563" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.phaseName}>{phase.name}</Text>
          <Text style={styles.phaseDates}>{dateStr}</Text>
        </View>

        {status === 'active' && (
          <Text style={styles.badgeActive}>En curso</Text>
        )}
        {status === 'pending' && (
          <Text style={styles.badgePending}>Próxima</Text>
        )}
        {status === 'finished' && (
          <Text style={styles.badgeFinished}>Finalizada</Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
        <Text style={styles.summaryText}>{summaryText}</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color="#9CA3AF"
          style={{ marginLeft: 'auto' }}
        />
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
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
});
