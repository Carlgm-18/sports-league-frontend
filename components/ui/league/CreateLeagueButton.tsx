import { Href, Link } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  href: Href;
}

const CreateLeagueButton = ({ href }: Props) => {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.button}>
        <Text style={styles.icon}>+</Text>
        <Text style={styles.text}>New league</Text>
      </Pressable>
    </Link>
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
    fontSize: 32,
    marginRight: 8,
    color: '#000',
    lineHeight: 28,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
});

export default CreateLeagueButton;
