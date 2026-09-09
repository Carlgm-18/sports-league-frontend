import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const DEPORTES = ['Voley', 'Fútbol', 'Pádel'];

interface Step2Props {
  formData: any;
  updateForm: (field: string, value: any) => void;
}

export default function Step2({ formData, updateForm }: Step2Props) {
  const [tempLicense, setTempLicense] = useState({
    sport: DEPORTES[0],
    number: '',
  });

  const handleAddLicense = () => {
    if (!tempLicense.number.trim()) return;
    updateForm('licenses', [...formData.licenses, tempLicense]);
    setTempLicense((prev) => ({ ...prev, number: '' }));
  };

  const handleRemoveLicense = (indexToRemove: number) => {
    updateForm(
      'licenses',
      formData.licenses.filter(
        (_: any, index: number) => index !== indexToRemove,
      ),
    );
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre *"
          placeholderTextColor="#999"
          value={formData.firstName}
          onChangeText={(text) => updateForm('firstName', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="people-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos *"
          placeholderTextColor="#999"
          value={formData.lastName}
          onChangeText={(text) => updateForm('lastName', text)}
        />
      </View>

      <View style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleBtn,
            formData.category === 'Masculino' && styles.toggleBtnActive,
          ]}
          onPress={() => updateForm('category', 'MALE')}
        >
          <Text
            style={
              formData.category === 'MALE'
                ? styles.toggleTextActive
                : styles.toggleText
            }
          >
            Masculino
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.toggleBtn,
            formData.category === 'Femenino' && styles.toggleBtnActive,
          ]}
          onPress={() => updateForm('category', 'FEMALE')}
        >
          <Text
            style={
              formData.category === 'FEMALE'
                ? styles.toggleTextActive
                : styles.toggleText
            }
          >
            Femenino
          </Text>
        </Pressable>
      </View>

      {/* Sección Árbitro */}
      <View style={styles.refereeSection}>
        <Text style={styles.refereeTitle}>¿Eres árbitro?</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="card-outline"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Número de licencia"
            placeholderTextColor="#999"
            value={tempLicense.number}
            onChangeText={(text) =>
              setTempLicense({ ...tempLicense, number: text })
            }
          />
        </View>

        <View style={styles.sportsContainer}>
          {DEPORTES.map((deporte) => (
            <Pressable
              key={deporte}
              style={[
                styles.sportChip,
                tempLicense.sport === deporte && styles.sportChipActive,
              ]}
              onPress={() => setTempLicense({ ...tempLicense, sport: deporte })}
            >
              <Text
                style={
                  tempLicense.sport === deporte
                    ? styles.sportChipTextActive
                    : styles.sportChipText
                }
              >
                {deporte}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.secondaryButton} onPress={handleAddLicense}>
          <Ionicons name="add" size={20} color="#111827" style={styles.icon} />
          <Text style={styles.secondaryButtonText}>Añadir licencia</Text>
        </Pressable>

        {formData.licenses.map((lic: any, index: number) => (
          <View key={index} style={styles.licenseItem}>
            <Text style={styles.licenseItemText}>
              {lic.sport} - #{lic.number}
            </Text>
            <Pressable
              onPress={() => handleRemoveLicense(index)}
              style={styles.deleteIcon}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { width: '100%' },

  // Inputs base
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 56,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827' },

  // Selector Categoría
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    height: 56,
  },
  toggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: { fontSize: 15, color: '#6B7280', fontWeight: '500' },
  toggleTextActive: { fontSize: 15, color: '#111827', fontWeight: 'bold' },

  // Sección Árbitro
  refereeSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  refereeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  sportsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sportChip: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  sportChipActive: { backgroundColor: '#2196F3' },
  sportChipText: { color: '#6B7280', fontWeight: '500' },
  sportChipTextActive: { color: '#FFFFFF', fontWeight: 'bold' },

  licenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  licenseItemText: { fontSize: 15, color: '#111827', fontWeight: '500' },
  deleteIcon: { padding: 4 },

  // Botones
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  secondaryButtonText: { color: '#111827', fontSize: 15, fontWeight: '600' },
});
