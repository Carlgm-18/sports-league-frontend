import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function PhasesStep({ data, updateData }: any) {
  const addPhase = (type: 'TOURNAMENT' | 'CLASSIFICATION') => {
    const basePhase = {
      type,
      name: '',
      startDate: '',
      endDate: '',
      sequenceOrder: String(data.length + 1),
      rounds: [],
      ...(type === 'TOURNAMENT'
        ? { matchesOrder: [], numberOfRounds: '' }
        : { groups: [] }),
    };
    updateData([...data, basePhase]);
  };

  const updatePhase = (index: number, key: string, value: any) => {
    const newData = [...data];
    newData[index][key] = value;
    updateData(newData);
  };

  const removePhase = (indexToRemove: number) => {
    const newData = data.filter(
      (_: any, index: number) => index !== indexToRemove,
    );
    const reorderedData = newData.map((phase: any, index: number) => ({
      ...phase,
      sequenceOrder: String(index + 1),
    }));
    updateData(reorderedData);
  };

  const addGroup = (phaseIndex: number) => {
    const newData = [...data];
    if (!newData[phaseIndex].groups) newData[phaseIndex].groups = [];
    newData[phaseIndex].groups.push({ name: '', topWinners: 1 });
    updateData(newData);
  };

  const updateGroup = (
    phaseIndex: number,
    groupIndex: number,
    key: string,
    value: string | number,
  ) => {
    const newData = [...data];
    newData[phaseIndex].groups[groupIndex][key] = value;
    updateData(newData);
  };

  const removeGroup = (phaseIndex: number, groupIndexToRemove: number) => {
    const newData = [...data];
    newData[phaseIndex].groups = newData[phaseIndex].groups.filter(
      (_: any, i: number) => i !== groupIndexToRemove,
    );
    updateData(newData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Fases de la Liga</Text>
        <Text style={styles.subtitle}>
          Estructura tu liga en fases de torneo o clasificación
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {data.map((phase: any, index: number) => (
          <View key={index} style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseTitle}>
                Fase {index + 1} -{' '}
                {phase.type === 'TOURNAMENT' ? 'Torneo' : 'Clasificación'}
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
              value={phase.name}
              onChangeText={(t) => updatePhase(index, 'name', t)}
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                placeholder="Inicio (YYYY-MM-DD)"
                placeholderTextColor="#9CA3AF"
                value={phase.startDate}
                onChangeText={(t) => updatePhase(index, 'startDate', t)}
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <View style={{ width: 12 }} />
              <TextInput
                placeholder="Fin (YYYY-MM-DD)"
                placeholderTextColor="#9CA3AF"
                value={phase.endDate}
                onChangeText={(t) => updatePhase(index, 'endDate', t)}
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
            </View>

            <View style={styles.configContainer}>
              <Text style={styles.configTitle}>Configuración de Fase</Text>

              {phase.type === 'TOURNAMENT' && (
                <View>
                  <Text style={styles.configLabel}>
                    Nº de rondas o niveles (ej. 3 para Cuartos, Semi, Final):
                  </Text>
                  <TextInput
                    placeholder="Nº de rondas"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={String(phase.numberOfRounds || '')}
                    onChangeText={(t) =>
                      updatePhase(index, 'numberOfRounds', t)
                    }
                    style={styles.input}
                  />
                </View>
              )}

              {phase.type === 'CLASSIFICATION' && (
                <View>
                  <Text style={styles.configLabel}>
                    Grupos de clasificación:
                  </Text>
                  {phase.groups?.map((group: any, gIndex: number) => (
                    <View key={gIndex} style={styles.groupCard}>
                      <View style={styles.groupHeader}>
                        <Text style={styles.groupTitle}>
                          Grupo {gIndex + 1}
                        </Text>
                        <Pressable onPress={() => removeGroup(index, gIndex)}>
                          <Ionicons
                            name="close-circle-outline"
                            size={20}
                            color="#DC2626"
                          />
                        </Pressable>
                      </View>
                      <TextInput
                        placeholder="Nombre del grupo (Ej. Grupo A)"
                        placeholderTextColor="#9CA3AF"
                        value={group.name}
                        onChangeText={(t) =>
                          updateGroup(index, gIndex, 'name', t)
                        }
                        style={styles.input}
                      />
                      <TextInput
                        placeholder="Nº de clasificados (Ej. 2)"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        value={String(group.topWinners || '')}
                        onChangeText={(t) =>
                          updateGroup(
                            index,
                            gIndex,
                            'topWinners',
                            parseInt(t) || 0,
                          )
                        }
                        style={styles.input}
                      />
                    </View>
                  ))}
                  <Pressable
                    style={({ pressed, hovered }: any) => [
                      styles.addSmallButton,
                      (hovered || pressed) && styles.addSmallButtonDarkened,
                    ]}
                    onPress={() => addGroup(index)}
                  >
                    <Text style={styles.addSmallButtonText}>
                      + Añadir Grupo
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={styles.addPhaseColumn}>
          <Pressable
            style={({ pressed, hovered }: any) => [
              styles.addButton,
              (hovered || pressed) && styles.addButtonDarkened,
            ]}
            onPress={() => addPhase('TOURNAMENT')}
          >
            <Text style={styles.addButtonText}>+ Torneo</Text>
          </Pressable>
          <Pressable
            style={({ pressed, hovered }: any) => [
              styles.addButton,
              (hovered || pressed) && styles.addButtonDarkened,
            ]}
            onPress={() => addPhase('CLASSIFICATION')}
          >
            <Text style={styles.addButtonText}>+ Clasificación</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, width: '100%' },
  headerContainer: { marginBottom: 8, alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  horizontalScroll: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  phaseCard: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    alignSelf: 'flex-start',
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
  row: { flexDirection: 'row', marginBottom: 12 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#111827',
    marginBottom: 10,
  },
  configContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  configTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  configLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  groupCard: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  addPhaseColumn: { width: 160, justifyContent: 'center' },
  addButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonDarkened: { backgroundColor: '#E5E7EB' },
  addButtonText: { color: '#374151', fontSize: 13, fontWeight: 'bold' },
  addSmallButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addSmallButtonDarkened: { backgroundColor: '#D1D5DB' },
  addSmallButtonText: { color: '#374151', fontSize: 13, fontWeight: 'bold' },
});
