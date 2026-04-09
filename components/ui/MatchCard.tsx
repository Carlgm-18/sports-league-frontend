import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export type MatchCardProps = {
  localTeam: { name: string; iconImageUrl?: string };
  visitorTeam: { name: string; iconImageUrl?: string };
  dateTime?: { dateTime: string; duration: number };
  refereeAssigned?: string;
  resultResumee?: { localTotalScore: number; visitorTotalScore: number };
};

export const MatchCard = ({
  localTeam,
  visitorTeam,
  dateTime,
  refereeAssigned,
  resultResumee,
}: MatchCardProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const formattedDate = dateTime
    ? new Date(dateTime.dateTime).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Acuerdo pendiente';
  const formattedReferee = refereeAssigned
    ? refereeAssigned
    : 'Asignación pendiente';

  // Si hay resultado, mostramos los números, si no, mostramos el "VS"
  const showResult = resultResumee !== undefined;

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: themeColors.cardFill,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      {/* Cabecera: Fecha y Hora */}
      <View style={styles.headerRow}>
        <Ionicons
          name="calendar-outline"
          size={14}
          color={themeColors.textSecondary}
        />
        <Text style={[styles.dateText, { color: themeColors.textSecondary }]}>
          {formattedDate}
        </Text>
      </View>

      {/* Cuerpos: Equipos y Resultado */}
      <View style={styles.teamsRow}>
        {/* Local */}
        <View style={styles.teamBlock}>
          <View
            style={[
              styles.teamIconContainer,
              {
                backgroundColor: themeColors.cardBanner,
                borderColor: themeColors.background,
              },
            ]}
          />
          <Text
            style={[styles.teamName, { color: themeColors.text }]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {localTeam.name}
          </Text>
        </View>

        {/* Marcador central */}
        <View style={styles.scoreContainer}>
          {showResult ? (
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreText, { color: themeColors.text }]}>
                {resultResumee.localTotalScore}
              </Text>
              <Text
                style={[
                  styles.scoreDivider,
                  { color: themeColors.textSecondary },
                ]}
              >
                -
              </Text>
              <Text style={[styles.scoreText, { color: themeColors.text }]}>
                {resultResumee.visitorTotalScore}
              </Text>
            </View>
          ) : (
            <Text style={[styles.vsText, { color: themeColors.textSecondary }]}>
              VS
            </Text>
          )}
        </View>

        {/* Visitante */}
        <View style={styles.teamBlock}>
          <View
            style={[
              styles.teamIconContainer,
              {
                backgroundColor: themeColors.cardBanner,
                borderColor: themeColors.background,
              },
            ]}
          />
          <Text
            style={[styles.teamName, { color: themeColors.text }]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {visitorTeam.name}
          </Text>
        </View>
      </View>

      {/* Footer: Árbitro y Botones de acción */}
      <View style={styles.footerRow}>
        <View style={styles.refereeInfo}>
          <Ionicons
            name="person-outline"
            size={14}
            color={themeColors.textSecondary}
          />
          <Text
            style={[styles.refereeText, { color: themeColors.textSecondary }]}
          >
            {formattedReferee}
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: themeColors.actionButton },
            ]}
          >
            <Ionicons name="stats-chart" size={20} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamBlock: { flex: 1, alignItems: 'center' },
  teamIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  teamName: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  scoreContainer: { width: 80, alignItems: 'center', justifyContent: 'center' },
  vsText: { fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: { fontSize: 22, fontWeight: 'bold' },
  scoreDivider: { fontSize: 20, marginHorizontal: 8 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  refereeInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  refereeText: { fontSize: 12, marginLeft: 6 },
  buttonsRow: { flexDirection: 'row' },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
