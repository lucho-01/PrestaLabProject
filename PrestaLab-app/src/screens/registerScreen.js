import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { registerUser } from '../services/authService';
import Gloss from '../components/Gloss';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const cleanName = name.trim();
    const cleanLastName = lastName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    
    if (!cleanName || !cleanLastName || !cleanPhone || !cleanEmail || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError('Ingresa un teléfono válido (mínimo 7 dígitos)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await registerUser(cleanEmail, password, cleanName, cleanLastName, cleanPhone);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Register
      </Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Gloss tone="light" />
          <Text style={styles.label}>
            Nombre
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
            outlineColor="#6E7A71"
            activeOutlineColor="#256B42"
            theme={{ roundness: 8 }}
          />
          
          <Text style={styles.label}>
            Apellido
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Tu apellido"
            value={lastName}
            onChangeText={setLastName}
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
            outlineColor="#6E7A71"
            activeOutlineColor="#256B42"
            theme={{ roundness: 8 }}
          />
          
          <Text style={styles.label}>
            Teléfono
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Tu teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
            outlineColor="#6E7A71"
            activeOutlineColor="#256B42"
            theme={{ roundness: 8 }}
          />
          
          <Text style={styles.label}>
            Correo
          </Text>
          <TextInput
            mode="outlined"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            outlineColor="#6E7A71"
            activeOutlineColor="#256B42"
            theme={{ roundness: 8 }}
          />
          
          <Text style={styles.label}>
            Contraseña
          </Text>
          <TextInput
            mode="outlined"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye' : 'eye-off'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            outlineColor="#6E7A71"
            activeOutlineColor="#256B42"
            theme={{ roundness: 8 }}
          />
          
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}
          
          <Button
            mode="contained"
            onPress={handleSignUp}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
            theme={{ roundness: 20 }}
          >
            {loading ? (
              <ActivityIndicator color="#FEFFFE" />
            ) : (
              'Registrarse'
            )}
          </Button>
        </View>
      </ScrollView>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta? Iniciar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#F5FBF6',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    fontWeight: '700',
    color: '#181C1A',
    marginBottom: 24,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  formContainer: {
    width: 336,
    borderRadius: 24,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(37,107,66,0.45)',
    overflow: 'hidden',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#256B42',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  error: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#B3261E',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#256B42',
  },
  buttonLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#FEFFFE',
  },
  buttonContent: {
    height: 56,
  },
  loginLink: {
    marginTop: 24,
  },
  loginText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#256B42',
  },
});
