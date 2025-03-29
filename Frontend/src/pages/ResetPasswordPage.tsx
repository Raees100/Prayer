import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type ResetPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPasswordPage: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      password: '',
      confirmPassword: '',
    };

    if (!password.trim()) {
      newErrors.password = 'Please enter your new password';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      // Add your password reset logic here
      setTimeout(() => {
        setIsSubmitting(false);
        navigation.navigate('Login', {
          message: 'Password reset successfully. Please log in with your new password.',
        }); // Navigate to login page after successful reset
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
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
          source={require('../assets/images/Reset.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Title Section */}
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your new password</Text>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: '' }));
              }
            }}
            secureTextEntry={!showPassword}
            placeholderTextColor="#8896AB"
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Image 
              source={showPassword 
                ? require('../assets/images/eye-icon-visible.png')
                : require('../assets/images/eye-icon-invisible.png')
              }
              style={[styles.icon, { tintColor: password ? '#1E293B' : '#8896AB' }]}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <View style={[styles.passwordContainer, errors.confirmPassword ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }
            }}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="#8896AB"
          />
          <TouchableOpacity 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Image 
              source={showConfirmPassword 
                ? require('../assets/images/eye-icon-visible.png')
                : require('../assets/images/eye-icon-invisible.png')
              }
              style={[styles.icon, { tintColor: confirmPassword ? '#1E293B' : '#8896AB' }]}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <View style={styles.submittingContainer}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.buttonText}> Submitting...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
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
    height: 250,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '80%',
    height: '100%',
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
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
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
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  eyeIcon: {
    padding: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#037638',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#037638',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ResetPasswordPage; 