import { Colors } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


export type LeagueCardProps = {
  name: string;
  description: string;
  iconImageUrl?: string;
  bannerImageUrl?: string;
};

export const LEAGUE_CARD_WIDTH = 300;

export const LeagueCard = ({ name, description, iconImageUrl, bannerImageUrl }: LeagueCardProps) => {
  return (
    <View style={leagueStyles.cardContainer}>
      {/* Sección Superior: Banner e Icono */}
      <View style={leagueStyles.bannerSection}>
        {bannerImageUrl ? (
          <Image source={{ uri: bannerImageUrl }} style={leagueStyles.bannerImage} />
        ) : (
          // Marcador de posición si no hay banner
          <View style={leagueStyles.bannerPlaceholder} />
        )}
        
        {/* Logo Circular (Hardcoded en el centro para la plantilla) */}
        <View style={leagueStyles.logoContainer}>
          {iconImageUrl ? (
            <Image source={{ uri: iconImageUrl }} style={leagueStyles.logoImage} />
          ) : (
            // Marcador de posición si no hay logo
            <View style={leagueStyles.logoPlaceholder} />
          )}
        </View>
      </View>

      {/* Sección Inferior: Texto de Información */}
      <View style={leagueStyles.contentSection}>
        <Text style={leagueStyles.leagueName}>{name}</Text>
        <Text style={leagueStyles.leagueDescription} numberOfLines={6}>
          {description}
        </Text>
      </View>
    </View>
  );
};


const leagueStyles = StyleSheet.create({
  cardContainer: {
    width: LEAGUE_CARD_WIDTH,
    maxWidth: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden', 
  },
  bannerSection: {
    height: 150,
    backgroundColor: Colors.dark.cardFill,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerPlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra interna para el logo
    elevation: 2, 
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: Colors.dark.cardFill, // Logo gris oscuro
  },
  contentSection: {
    padding: 20,
    backgroundColor: Colors.light.cardFill,
    height: 220,
  },
  leagueName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: 10,
  },
  leagueDescription: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginTop: 8,
  },
});
