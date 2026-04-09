import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export type TeamCardProps = {
  name: string;
  iconImageUrl?: string;
  playersCount: number;
  maxPlayers?: number;
  coachName?: string;
  onPressJoin?: () => void;
};

export const TeamCard = ({
  name,
  iconImageUrl,
  playersCount,
  maxPlayers = 15,
  coachName,
  onPressJoin,
}: TeamCardProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const isFull = playersCount >= maxPlayers;

  return (
    <View style={[
      styles.cardContainer, 
      { backgroundColor: themeColors.cardFill, borderColor: themeColors.cardBorder }
    ]}>
      <View style={styles.contentRow}>
        
        {/* Escudo del equipo */}
        <View style={[
          styles.teamIconContainer, 
          { backgroundColor: themeColors.cardBanner, borderColor: themeColors.background }
        ]}>
          <Ionicons name="shield-outline" size={24} color={themeColors.textSecondary} />
        </View>

        {/* Información Central */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.teamName, { color: themeColors.text }]} numberOfLines={1}>
              {name}
            </Text>
            {/* Etiqueta de estado (Reclutando vs Lleno) */}
            <View style={[
              styles.badge, 
              { backgroundColor: isFull ? '#FEE2E2' : '#DEF7EC' } // Rojo suave si está lleno, verde si hay hueco
            ]}>
              <Text style={[
                styles.badgeText, 
                { color: isFull ? '#991B1B' : '#03543F' }
              ]}>
                {isFull ? 'Lleno' : 'Fichando'}
              </Text>
            </View>
          </View>

          {coachName && (
            <Text style={[styles.coachText, { color: themeColors.textSecondary }]}>
              Míster: {coachName}
            </Text>
          )}

          <View style={styles.playersRow}>
            <Ionicons name="people-outline" size={14} color={themeColors.textSecondary} />
            <Text style={[styles.playersText, { color: themeColors.textSecondary }]}>
              {playersCount} / {maxPlayers} jugadores
            </Text>
          </View>
        </View>
      </View>

      {/* Footer: Acción */}
      <View style={[styles.footerRow, { borderTopColor: themeColors.cardBorder }]}>
        <Pressable 
          style={[
            styles.actionButton, 
            { backgroundColor: isFull ? '#F3F4F6' : themeColors.actionButton }
          ]}
          onPress={onPressJoin}
          disabled={isFull}
        >
          <Text style={[
            styles.actionButtonText, 
            { color: isFull ? '#9CA3AF' : '#FFFFFF' }
          ]}>
            {isFull ? 'Plantilla cerrada' : 'Solicitar unirse'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
    overflow: 'hidden', // Para que el footer se ajuste bien
  },
  contentRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  teamIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12, // Escudos un poco más cuadrados quedan muy bien
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  coachText: {
    fontSize: 13,
    marginBottom: 6,
  },
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playersText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  footerRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.01)', // Un levísimo oscurecimiento para diferenciar el footer
  },
  actionButton: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});