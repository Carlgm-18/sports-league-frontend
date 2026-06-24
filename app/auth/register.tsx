import RegisterStep1 from '@/components/ui/register/RegisterStep1';
import RegisterStep2 from '@/components/ui/register/RegisterStep2';
import { userRegister } from '@/services/UserService';
import {
    UserCategory,
    UserCreateRequest,
    UserCreateResponse,
} from '@/types/api';
import { ApiResult } from '@/types/own';
import { Link } from 'expo-router';

import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<UserCreateRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    category: 'MALE' as any,
    licenses: [],
  });
  const [response, setResponse] =
    useState<ApiResult<UserCreateResponse> | null>(null);

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const result = await userRegister(formData);
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
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Únete para gestionar tus ligas y equipos
          </Text>
        </View>

        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            <RegisterStep1 formData={formData} updateForm={updateForm} />
          </View>
          <View style={styles.column}>
            <RegisterStep2 formData={formData} updateForm={updateForm} />
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Pressable
            style={({ pressed, hovered }: any) => [
              styles.primaryButton,
              (hovered || pressed) && styles.primaryButtonDarkened,
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.primaryButtonText}>Crear cuenta</Text>
          </Pressable>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <Link href="/auth/login" asChild>
              <Pressable>
                {({ pressed, hovered }: any) => (
                  <Text
                    style={[
                      styles.loginText,
                      (hovered || pressed) && styles.loginTextDarkened,
                    ]}
                  >
                    Iniciar sesión
                  </Text>
                )}
              </Pressable>
            </Link>
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

  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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

  footerContainer: {
    width: '100%',
    maxWidth: 900,
    marginTop: 24,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  primaryButtonDarkened: {
    backgroundColor: '#1565C0', // Un azul más oscuro para el estado presionado/hover
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: { color: '#6B7280', fontSize: 15 },
  loginText: {
    color: '#2196F3',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginTextDarkened: {
    color: '#1565C0',
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
