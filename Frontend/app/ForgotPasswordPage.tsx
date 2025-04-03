import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { authApi } from '../services/api';
import { router } from 'expo-router';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    try {
      setError(null);
      
      if (!email) {
        setError('Please enter your email address');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      setLoading(true);
      await authApi.forgotPassword({ email });
      
      // Navigate to OTP verification page
      router.push({pathname:'/VerifyOTPPage', params:{ email }});
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Image 
          source={require('../assets/images/arrow_back.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Header Image */}
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../assets/images/Forget.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Image 
          source={require('../assets/images/Forget1.png')}
          style={styles.illustration1}
          resizeMode="contain"
        />
      </View>

      {/* Title Section */}
      <Text style={styles.title}>Forget Password</Text>
      <Text style={styles.subtitle}>
        Provide your account email or phone number to reset your password!
      </Text>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) {
              setError(null);
            }
          }}
          placeholderTextColor="#8896AB"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000000',
  },
  illustrationContainer: {
    width: '100%',
    height: 150,
    marginTop: 50,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '80%',
    height: '100%',
  },
  illustration1: {
    width: '80%',
    height: '100%',
    position: 'absolute',
    marginRight: -122,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#037638',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8896AB',
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#037638',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#037638',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#84D3A1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordPage;