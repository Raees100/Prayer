import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { authApi } from '../services/api';
import { router, useLocalSearchParams } from 'expo-router';


const VerifyOTPPage: React.FC = () => {
 
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Start OTP expiry timer
    const expiryInterval = setInterval(() => {
      setOtpExpiryTimer((prev) => {
        if (prev <= 0) {
          clearInterval(expiryInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(expiryInterval);
  }, []);

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setError(null);
      
      const otpString = otp.join('');
      if (otpString.length !== 5) {
        setError('Please enter the complete verification code');
        return;
      }

      setLoading(true);
      await authApi.verifyOTP({ email: email as string, otp: otpString });
      
      // Navigate to reset password page
      router.push({pathname:'/ResetPasswordPage', params: {email, otp: otpString }});
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError(null);
      setLoading(true);
      if (typeof email === 'string') {
        await authApi.forgotPassword({ email });
      } else {
        setError('Invalid email format');
      }
      setResendTimer(120); // Start 2-minute countdown
      setOtpExpiryTimer(300); // Reset 5-minute expiry timer
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Image 
          source={require('../assets/images/arrow_back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../assets/images/OTP.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Enter the OTP code we just sent to your registered email
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {otpExpiryTimer > 0 && (
        <Text style={styles.timerText}>
          OTP expires in {formatTime(otpExpiryTimer)}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive an OTP? </Text>
        {resendTimer > 0 ? (
          <Text style={styles.resendTimerText}>
            Resend in {formatTime(resendTimer)}
          </Text>
        ) : (
          <TouchableOpacity 
            onPress={handleResendOTP}
            disabled={loading}
          >
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        )}
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
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  illustrationContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  illustration: {
    width: '60%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#037638',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  timerText: {
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#037638',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#84D3A1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: '#666666',
    fontSize: 14,
  },
  resendLink: {
    color: '#037638',
    fontSize: 14,
    fontWeight: '600',
  },
  resendTimerText: {
    color: '#666666',
    fontSize: 14,
  },
});

export default VerifyOTPPage;