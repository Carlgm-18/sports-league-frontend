import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

interface Props {
  onPress: () => void;
}

const CreateLeagueButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>+</Text>
      <Text style={styles.text}>New league</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
    color: '#000',
    lineHeight: 28,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default CreateLeagueButton;