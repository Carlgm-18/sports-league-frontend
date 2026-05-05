import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function GeneralInfoStep({ data, updateData }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Información General</Text>
        <Text style={styles.subtitle}>
          Configura los detalles principales de tu liga
        </Text>
      </View>

      <TextInput
        placeholder="Nombre de la liga"
        placeholderTextColor="#9CA3AF"
        value={data.name}
        onChangeText={(t) => updateData('name', t)}
        style={styles.input}
        maxLength={50}
      />
      <TextInput
        placeholder="Descripción"
        placeholderTextColor="#9CA3AF"
        value={data.description}
        onChangeText={(t) => updateData('description', t)}
        style={[styles.input, styles.textArea]}
        multiline
        maxLength={500}
      />
      <TextInput
        placeholder="URL del Icono"
        placeholderTextColor="#9CA3AF"
        value={data.iconImageUrl}
        onChangeText={(t) => updateData('iconImageUrl', t)}
        style={styles.input}
      />
      <TextInput
        placeholder="URL del Banner"
        placeholderTextColor="#9CA3AF"
        value={data.bannerImageUrl}
        onChangeText={(t) => updateData('bannerImageUrl', t)}
        style={styles.input}
      />
      <TextInput
        placeholder="URL de Ubicación (Google Maps, etc)"
        placeholderTextColor="#9CA3AF"
        value={data.locationUrl}
        onChangeText={(t) => updateData('locationUrl', t)}
        style={styles.input}
      />

      <TextInput
        placeholder="Fecha Inicio (YYYY-MM-DD)"
        placeholderTextColor="#9CA3AF"
        value={data.startDate}
        onChangeText={(t) => updateData('startDate', t)}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha Fin (YYYY-MM-DD)"
        placeholderTextColor="#9CA3AF"
        value={data.endDate}
        onChangeText={(t) => updateData('endDate', t)}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha Max. Inscripción (YYYY-MM-DD)"
        placeholderTextColor="#9CA3AF"
        value={data.maxInscriptionDate}
        onChangeText={(t) => updateData('maxInscriptionDate', t)}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    width: '100%',
  },
  headerContainer: {
    marginBottom: 8,
  },
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
  textArea: { height: 120, textAlignVertical: 'top' },
});
