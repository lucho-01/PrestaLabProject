import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await loginUser(email, password);
    
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
          theme={{ roundness: 16 }}
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
          theme={{ roundness: 16 }}
        />
        
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
        
        <Button
          mode="contained"
          onPress={handleSignIn}
          disabled={loading}
          style={[styles.button, { backgroundColor: '#256B42' }]}
          labelStyle={[styles.buttonLabel, { color: '#FEFFFE' }]}
          contentStyle={styles.buttonContent}
          theme={{ roundness: 28 }}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#181C1A',
    marginBottom: 32,
  },
  formContainer: {
    width: 336,
    height: 444,
    borderRadius: 28,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#E4EAE5',
  },
  label: {
    fontSize: 19,
    color: '#181C1A',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  error: {
    fontSize: 12,
    color: '#B3261E',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    height: 56,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    height: 56,
  },
  registerLink: {
    marginTop: 24,
  },
  registerText: {
    fontSize: 16,
    color: '#256B42',
  },
});
