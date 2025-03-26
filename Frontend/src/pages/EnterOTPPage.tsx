import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type EnterOTPScreenProps = NativeStackScreenProps<RootStackParamList, 'EnterOTP'>;

const EnterOTPPage: React.FC<EnterOTPScreenProps> = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (error) {
      setError('');
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input if backspace is pressed and current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOTP = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 5) {
      setError('Please enter the complete OTP code');
      return false;
    }
    if (!/^\d+$/.test(otpValue)) {
      setError('OTP should only contain numbers');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateOTP()) {
      setIsSubmitting(true);
      // Add your OTP verification logic here
      setTimeout(() => {
        setIsSubmitting(false);
        navigation.navigate('ResetPassword');
      }, 1500);
    }
  };

  const handleResendOTP = () => {
    setIsResending(true);
    // Add your resend OTP logic here
    setTimeout(() => {
      setIsResending(false);
      // Reset OTP fields
      setOtp(['', '', '', '', '']);
      // Focus on first input
      inputRefs.current[0]?.focus();
    }, 1500);
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
          source={require('../assets/images/OTP.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Title Section */}
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Enter the OTP code we just sent to your registered email
      </Text>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3, 4].map((index) => (
          <TextInput
            key={index}
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
            style={[styles.otpInput, error ? styles.inputError : null]}
            value={otp[index]}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            placeholder="•"
            placeholderTextColor="#8896AB"
          />
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Reset Password Button */}
      <TouchableOpacity 
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <View style={styles.submittingContainer}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.buttonText}> Verifying...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      {/* Resend OTP */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive an OTP? </Text>
        <TouchableOpacity 
          onPress={handleResendOTP}
          disabled={isResending}
        >
          <Text style={[styles.resendLink, isResending && styles.resendLinkDisabled]}>
            {isResending ? 'Sending...' : 'Resend OTP'}
          </Text>
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
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '40%',
    height: '80%',
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
    paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 55,
    height: 70,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    textAlign: 'center',
    fontSize: 20,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 32,
    textAlign: 'center',
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
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#64748B',
  },
  resendLink: {
    fontSize: 14,
    color: '#037638',
    fontWeight: '500',
  },
  resendLinkDisabled: {
    color: '#84D3A1',
  },
});

export default EnterOTPPage; 