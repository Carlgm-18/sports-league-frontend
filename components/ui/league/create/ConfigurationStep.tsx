import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function ConfigurationStep({ data, updateData }: any) {
  const handleChange = (key: string, value: string | number) => {
    updateData({ ...data, [key]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Configuración del Deporte</Text>
        <Text style={styles.subtitle}>
          Define las reglas y características del deporte
        </Text>
      </View>

      <TextInput
        placeholder="Nombre del Deporte"
        placeholderTextColor="#9CA3AF"
        value={data.sportName}
        onChangeText={(t) => handleChange('sportName', t)}
        style={styles.input}
      />
      <TextInput
        placeholder="Categoría (MALE, FEMALE, MIXED)"
        placeholderTextColor="#9CA3AF"
        value={data.category}
        onChangeText={(t) => handleChange('category', t)}
        style={styles.input}
      />

      <TextInput
        placeholder="Min. Integrantes Femeninos"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={String(data.minTeamFemaleIntegrants)}
        onChangeText={(t) =>
          handleChange('minTeamFemaleIntegrants', parseInt(t) || 0)
        }
        style={styles.input}
      />
      <TextInput
        placeholder="Min. Miembros por Equipo"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={String(data.minTeamMembers)}
        onChangeText={(t) => handleChange('minTeamMembers', parseInt(t) || 0)}
        style={styles.input}
      />
      <TextInput
        placeholder="Max. Miembros por Equipo"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={String(data.maxTeamMembers)}
        onChangeText={(t) => handleChange('maxTeamMembers', parseInt(t) || 0)}
        style={styles.input}
      />
      <TextInput
        placeholder="Duración Jornada (semanas)"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={String(data.roundDuration)}
        onChangeText={(t) => handleChange('roundDuration', parseInt(t) || 0)}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, width: '100%' },
  headerContainer: { marginBottom: 8 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: { fontSize: 15, color: '#6B7280' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
  },
});
