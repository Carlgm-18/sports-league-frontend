import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function FaseScreen() {
  // Expo Router extrae automáticamente TODOS los parámetros de la URL
  const { id, faseId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estás en la Liga: {id}</Text>
      <Text style={styles.subtitle}>Viendo la Fase: {faseId}</Text>
      
      {/* Aquí ya meterías tu lógica: 
          if (faseData.tipo === 'GRUPOS') return <FaseGruposView />;
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  }
});