import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpPage: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    password: '',
    terms: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      password: '',
      terms: '',
    };

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter your password';
      isValid = false;
    }

    if (!agreed) {
      newErrors.terms = 'Please agree to the Terms and Privacy Policy';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      // Add your sign up logic here
      console.log('Sign up successful');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../assets/images/SignUp.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Title Section */}
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Sign up and get started</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) {
              setErrors(prev => ({ ...prev, name: '' }));
            }
          }}
          placeholderTextColor="#8896AB"
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
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

      {/* Terms Agreement */}
      <View style={styles.termsContainer}>
        <TouchableOpacity 
          onPress={() => {
            setAgreed(!agreed);
            if (errors.terms) {
              setErrors(prev => ({ ...prev, terms: '' }));
            }
          }}
          style={[styles.checkbox, errors.terms ? styles.checkboxError : null]}
        >
          {agreed && <View style={styles.checked} />}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          I agree with the Terms of Service and Privacy Policy
        </Text>
      </View>
      {errors.terms ? <Text style={[styles.errorText, { alignSelf: 'flex-start', marginLeft: 20 }]}>{errors.terms}</Text> : null}

      {/* Create Account Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? Sign In? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  illustrationContainer: {
    width: '100%',
    height: 150,
    marginTop: 120,
    marginBottom: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '100%',
    height: '120%',
    marginRight: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#037638',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#8896AB',
    marginBottom: 50,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#037638',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxError: {
    borderColor: '#EF4444',
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#037638',
    borderRadius: 2,
  },
  termsText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#037638',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#64748B',
  },
  signInLink: {
    fontSize: 14,
    color: '#037638',
    fontWeight: '500',
  },
});

export default SignUpPage; 