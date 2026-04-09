import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function LeagueDetailsScreen() {
  const { leagueId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Liga</Text>
      <Text style={styles.subtitle}>Has entrado a la liga con el ID: {leagueId}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});