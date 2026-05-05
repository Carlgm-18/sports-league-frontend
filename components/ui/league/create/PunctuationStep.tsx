import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PunctuationStep({ data, updateData }: any) {
  const addRule = () => {
    updateData([
      ...data,
      { localScore: 0, visitorScore: 0, localPoints: 0, visitorPoints: 0 },
    ]);
  };

  const updateRule = (index: number, key: string, value: number) => {
    const newData = [...data];
    newData[index][key] = value;
    updateData(newData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Sistema de Puntuación</Text>
        <Text style={styles.subtitle}>
          Añade reglas para el reparto de puntos
        </Text>
      </View>

      {data.map((rule: any, index: number) => (
        <View key={index} style={styles.ruleCard}>
          <Text style={styles.ruleTitle}>Regla {index + 1}</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Goles/Puntos Local"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              onChangeText={(t) => updateRule(index, 'localScore', parseInt(t))}
              style={styles.input}
            />
            <TextInput
              placeholder="Goles/Puntos Vis."
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              onChangeText={(t) =>
                updateRule(index, 'visitorScore', parseInt(t))
              }
              style={styles.input}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              placeholder="Puntos Clasif. Local"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              onChangeText={(t) =>
                updateRule(index, 'localPoints', parseInt(t))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Puntos Clasif. Vis."
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              onChangeText={(t) =>
                updateRule(index, 'visitorPoints', parseInt(t))
              }
              style={styles.input}
            />
          </View>
        </View>
      ))}

      <Pressable
        style={({ pressed, hovered }: any) => [
          styles.addButton,
          (hovered || pressed) && styles.addButtonDarkened,
        ]}
        onPress={addRule}
      >
        <Text style={styles.addButtonText}>+ Añadir Regla de Puntuación</Text>
      </Pressable>
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
  ruleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDarkened: { backgroundColor: '#E5E7EB' },
  addButtonText: { color: '#374151', fontSize: 15, fontWeight: 'bold' },
});
