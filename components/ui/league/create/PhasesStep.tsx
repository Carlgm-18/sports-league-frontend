import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PhasesStep({ data, updateData }: any) {
  const addPhase = (type: 'TOURNAMENT' | 'CLASSIFICATION') => {
    const basePhase = {
      type, // Ayudará a diferenciar en tu frontend antes de enviarlo
      name: '',
      startDate: '',
      endDate: '',
      sequenceOrder: String(data.length + 1),
      rounds: [],
      ...(type === 'TOURNAMENT' ? { matchesOrder: [] } : { groups: [] }),
    };
    updateData([...data, basePhase]);
  };

  const updatePhase = (index: number, key: string, value: string) => {
    const newData = [...data];
    newData[index][key] = value;
    updateData(newData);
  };

  const removePhase = (indexToRemove: number) => {
    const newData = data.filter(
      (_: any, index: number) => index !== indexToRemove,
    );
    // Recalculamos el sequenceOrder para que no haya saltos ni duplicados
    const reorderedData = newData.map((phase: any, index: number) => ({
      ...phase,
      sequenceOrder: String(index + 1),
    }));
    updateData(reorderedData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Fases de la Liga</Text>
        <Text style={styles.subtitle}>
          Estructura tu liga en fases de torneo o clasificación
        </Text>
      </View>

      {data.map((phase: any, index: number) => (
        <View key={index} style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Text style={styles.phaseTitle}>
              Fase {index + 1} - {phase.type}
            </Text>
            <Pressable
              style={({ pressed, hovered }: any) => [
                (hovered || pressed) && { opacity: 0.6 },
              ]}
              onPress={() => removePhase(index)}
            >
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
            </Pressable>
          </View>
          <TextInput
            placeholder="Nombre de la fase"
            placeholderTextColor="#9CA3AF"
            onChangeText={(t) => updatePhase(index, 'name', t)}
            style={styles.input}
          />
          <View style={styles.row}>
            <TextInput
              placeholder="Fecha Inicio"
              placeholderTextColor="#9CA3AF"
              onChangeText={(t) => updatePhase(index, 'startDate', t)}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <View style={{ width: 12 }} />
            <TextInput
              placeholder="Fecha Fin"
              placeholderTextColor="#9CA3AF"
              onChangeText={(t) => updatePhase(index, 'endDate', t)}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
          </View>
        </View>
      ))}

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed, hovered }: any) => [
            styles.addButton,
            (hovered || pressed) && styles.addButtonDarkened,
          ]}
          onPress={() => addPhase('TOURNAMENT')}
        >
          <Text style={styles.addButtonText}>+ Fase Torneo</Text>
        </Pressable>
        <Pressable
          style={({ pressed, hovered }: any) => [
            styles.addButton,
            (hovered || pressed) && styles.addButtonDarkened,
          ]}
          onPress={() => addPhase('CLASSIFICATION')}
        >
          <Text style={styles.addButtonText}>+ Fase Clasificación</Text>
        </Pressable>
      </View>
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
  phaseCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  row: { flexDirection: 'row' },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  addButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonDarkened: { backgroundColor: '#E5E7EB' },
  addButtonText: { color: '#374151', fontSize: 14, fontWeight: 'bold' },
});
