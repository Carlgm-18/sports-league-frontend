import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export type MatchCardProps = {
  localTeam: {
    name: string;
    iconImageUrl?: string;
  };
  visitorTeam: {
    name: string;
    iconImageUrl?: string;
  };
  dateTime?: { // Objeto DateTimeSlot del YAML
    dateTime: string; 
    duration: number;
  }; 
  refereeAssigned?: string; // No está en Details pero lo necesitamos
  resultResumee?: { // Objeto ResultResumee del YAML
    localTotalScore: number;
    visitorTotalScore: number;
  };
};

export const MatchCard = ({ localTeam, visitorTeam, dateTime, refereeAssigned, resultResumee }: MatchCardProps) => {
  
    const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

//   const formattedDate = dateTime ? new Date(dateTime.dateTime).toLocaleDateString('es-ES') : "Acuerdo pendiente";
//   const formattedReferee = refereeAssigned ? refereeAssigned : "Asignación pendiente";
//   const formattedResult = resultResumee ? `${resultResumee.localTotalScore} - ${resultResumee.visitorTotalScore}` : "No disputado";

  return (
    <View style={[styles.cardContainer, { backgroundColor: themeColors.cardFill, borderColor: themeColors.cardBorder }]}>
      
      <View style={styles.teamsRow}>
        <View style={[styles.teamIconContainer, { backgroundColor: themeColors.cardBanner, borderColor: themeColors.background }]}>
        </View>
        <Text style={[styles.vsText, { color: themeColors.textSecondary }]}>VS</Text>
        <View style={[styles.teamIconContainer, { backgroundColor: themeColors.cardBanner, borderColor: themeColors.background }]}>
        </View>
      </View>

      <View style={styles.teamNamesRow}>
        <Text style={[styles.teamName, { color: themeColors.text }]}>{localTeam.name}</Text>
        <Text style={[styles.teamName, { color: themeColors.text }]}>{visitorTeam.name}</Text>
      </View>


      <View style={styles.buttonsRow}>
        <Pressable style={[styles.actionButton, { backgroundColor: themeColors.actionButton }]}>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    elevation: 3,
  },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  vsText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  teamNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    marginHorizontal: 15,
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});