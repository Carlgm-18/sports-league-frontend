import RgisterStep1 from '@/components/ui/register/RegisterStep1';
import RegisterStep2 from '@/components/ui/register/RegisterStep2';
import { userRegister } from '@/services/UserService';
import { UserCreateRequest, UserCreateResponse } from '@/types/api';
import { ApiResult } from '@/types/own';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    category: 'MALE',
    licenses: [] as { sport: string; number: string }[],
  });
  const [response, setResponse] =
    useState<ApiResult<UserCreateResponse> | null>(null);

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { confirmPassword, ...request } = formData;
    const result = await userRegister(request as UserCreateRequest);
    setResponse(result);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            <RgisterStep1
              formData={formData}
              updateForm={updateForm}
              onNext={() => {}} // Sugerencia: Eliminar el botón "Siguiente" dentro del componente
            />
          </View>
          <View style={styles.column}>
            <RegisterStep2
              formData={formData}
              updateForm={updateForm}
              onBack={() => {}} // Sugerencia: Eliminar el botón "Atrás" dentro del componente
              onSubmit={handleRegister}
            />
          </View>
        </View>
      </ScrollView>
      {response && (
        <View style={styles.responseContainer}>
          {response.ok ? (
            <View>
              <Text style={styles.responseSucces}>
                Usuario registrado exitosamente
              </Text>
              {/* <Text>
                Nombre completo: {response.data.firstName}{' '}
                {response.data.lastName}
              </Text>
              <Text>
                Email: {response.data.email}
              </Text>
              <Text>
                Categoria: {response.data.category}
              </Text>
              <Text>
                Licencias:
                {response.data.licenses
                  ? response.data.licenses
                      .map((e, l) => `${e}: ${l}`)
                      .join('\n')
                  : 'Ninguna licencia especificada'}
              </Text> */}
            </View>
          ) : (
            <Text style={styles.responseError}>
              {response.ok
                ? 'Usuario registrado exitosamente'
                : response.error
                  ? `Codigo: ${response.error.errorCode}\n
                    Mensaje: ${response.error.errorMessage}`
                  : 'Error al registrar su usuario'}
            </Text>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  columnsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 900,
    gap: 24,
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    minWidth: 320, // Asegura que en móvil se coloquen uno debajo del otro
  },

  responseContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },

  responseSucces: {
    fontSize: 16,
    color: '#1faa07',
    textAlign: 'center',
  },

  responseError: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
});
