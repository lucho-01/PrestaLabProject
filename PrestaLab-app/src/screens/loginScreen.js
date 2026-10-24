import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { loginUser } from '../services/authService';
import Gloss from '../components/Gloss';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    
    if (!cleanEmail || !cleanPassword) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await loginUser(cleanEmail, cleanPassword);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login
      </Text>
      
      <View style={styles.formContainer}>
        <Gloss tone="light" />
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
          onPress={handleSignIn}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
          theme={{ roundness: 20 }}
        >
          {loading ? (
            <ActivityIndicator color="#FEFFFE" />
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </View>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          Registrarse
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5FBF6',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    fontWeight: '700',
    color: '#181C1A',
    marginBottom: 32,
  },
  formContainer: {
    width: 336,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
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
  registerLink: {
    marginTop: 24,
  },
  registerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#256B42',
  },
});
