import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Input, InputField } from '@/components/ui/input';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import BackButton from '@/components/backButton';
import { API_URL } from '@env';
import { router } from 'expo-router';

interface PasswordErrors {
  email?: string;
  verificationCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ForgetPassword = () => {
  const navigation = useNavigation();
  
  // State for form fields
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Verification process states
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [code, setCode] = useState('');
  
  // State for validation and visibility
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Real-time validation for the new password field
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Password validation function
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    };
  };

  // Get specific validation error message
  const getPasswordValidationError = (validation: any) => {
    if (!validation.hasMinLength) return 'Password must be at least 8 characters long';
    if (!validation.hasUpperCase) return 'Password must include at least one uppercase letter (A-Z)';
    if (!validation.hasLowerCase) return 'Password must include at least one lowercase letter (a-z)';
    if (!validation.hasNumber) return 'Password must include at least one number (0-9)';
    if (!validation.hasSpecialChar) return 'Password must include at least one special character (!@#$%^&*)';
    return '';
  };
  
  // Send verification code to email
  const handleSendVerificationCode = async() => {
    // Reset previous errors
    setErrors({});
    
    // Validate email
    if (!email.trim()) {
      setErrors({ email: 'Email address is required' });
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    // Simulate sending verification code
    setSendingEmail(true);
    
    const result = await fetch(`${API_URL}/v1/password/verify/details/reset`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email 
        })
    });

    const data = await result.json();
    // Simulate API call for sending verification code
    console.log({ data });

    if (data) { 
        setTimeout(() => {
          setSendingEmail(false);
          setEmailSent(true);
          setCode(data.code);
          Alert.alert(
            "Verification Code Sent",
            "A verification code has been sent to your email address. Please check your inbox.",
            [{ text: "OK" }]
          );
        }, 1500);
    } 
  };
  
  // Verify the code sent to email
  const handleVerifyCode = () => {
    // Reset previous errors
    setErrors({});
    
    // Validate verification code
    if (!verificationCode.trim()) {
      setErrors({ verificationCode: 'Verification code is required' });
      return;
    } else if (verificationCode.length < 4) {
      setErrors({ verificationCode: 'Please enter a valid verification code' });
      return;
    }
    
    // Simulate verifying code
    setVerifyingCode(true);
    if (code == verificationCode) {
         setTimeout(() => {
            setVerifyingCode(false);
            setEmailVerified(true);
            Alert.alert(
                "Email Verified",
                "Your email has been verified successfully. Please create your new password.",
                [{ text: "OK" }]
            );
            }, 1500);
    } else if (code != verificationCode) {
        setErrors({ verificationCode: 'Verification code incorrect' });
        setVerifyingCode(false);
        return;
    }
    
  };
  
  // Form submission handler for password reset
  const handleSubmit = async() => {
    // Reset previous errors
    setErrors({});
    let newErrors: PasswordErrors = {};
    let isValid = true;
    
    // Validate new password
    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      // Get specific error message based on what requirement is missing
      newErrors.newPassword = getPasswordValidationError(newPasswordValidation);
      isValid = false;
    }
    
    // Validate confirm password
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (isValid) {
      setIsVerifying(true);
      
      try {
        // Password reset API call would go here
        const result = await fetch(`${API_URL}/v1/password/reset`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                newPassword
            })
        });
        
        const data = await result.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to reset password');
        } else {
            setTimeout(() => {
              setIsVerifying(false);
              Alert.alert(
                "Success",
                "Your password has been reset successfully.",
                [{ text: "OK", onPress: () => router.navigate('/sign-in') }]
              );
            }, 1500);
        }
        console.log({ data });
        // Simulate API call success
      } catch (error) {
        setIsVerifying(false);
      }
    } else {
      setErrors(newErrors);
    }
  };
  
  // Password strength indicator
  const getPasswordStrength = () => {
    if (!newPassword) return { label: '', color: '#E0E6ED' };
    
    const { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = validatePassword(newPassword);
    const criteria = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
    const metCriteria = criteria.filter(Boolean).length;
    
    if (metCriteria <= 2) return { label: 'Weak', color: '#FF5252' };
    if (metCriteria <= 4) return { label: 'Moderate', color: '#FFC107' };
    return { label: 'Strong', color: '#4CAF50' };
  };
  
  const passwordStrength = getPasswordStrength();
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View className='mb-2'>
        <BackButton></BackButton>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <Text style={styles.headerSubtitle}>
          {!emailVerified 
            ? "Enter your email to receive a verification code" 
            : "Create a new password for your account"}
        </Text>
      </View>
      
      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Email Field (always visible) */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // Clear any previous errors when user is typing
                if (errors.email) {
                  setErrors({...errors, email: ''});
                }
              }}
              placeholder="Enter your email address"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!emailSent} // Disable after sending verification code
            />
          </View>
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>
        
        {/* Send Verification Code Button (only if email not verified) */}
        {!emailSent && (
          <TouchableOpacity 
            style={[styles.verifyButton, sendingEmail && styles.buttonDisabled]} 
            onPress={handleSendVerificationCode}
            disabled={sendingEmail}
          >
            <Text style={styles.verifyButtonText}>
              {sendingEmail ? 'Sending Code...' : 'Send Verification Code'}
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Verification Code Field (only after email sent) */}
        {emailSent && !emailVerified && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={verificationCode}
                  onChangeText={(text) => {
                    setVerificationCode(text);
                    // Clear any previous errors when user is typing
                    if (errors.verificationCode) {
                      setErrors({...errors, verificationCode: ''});
                    }
                  }}
                  placeholder="Enter verification code"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
              {errors.verificationCode && (
                <Text style={styles.errorText}>{errors.verificationCode}</Text>
              )}
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.resendButton]} 
                onPress={handleSendVerificationCode}
                disabled={sendingEmail}
              >
                <Text style={styles.resendButtonText}>
                  {sendingEmail ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.verifyButton, verifyingCode && styles.buttonDisabled]} 
                onPress={handleVerifyCode}
                disabled={verifyingCode}
              >
                <Text style={styles.verifyButtonText}>
                  {verifyingCode ? 'Verifying...' : 'Verify Code'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.securityNotice}>
              <Text style={styles.securityIcon}>📧</Text>
              <Text style={styles.securityText}>
                Please check your email inbox for the verification code. If you don't see it, check your spam folder.
              </Text>
            </View>
          </>
        )}
        
        {/* Password Fields (only show after email verification) */}
        {emailVerified && (
          <>
            {/* New Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setPasswordTouched(true);
                    // Clear any previous errors when user is typing
                    if (errors.newPassword) {
                      setErrors({...errors, newPassword: ''});
                    }
                  }}
                  placeholder="Enter new password"
                  placeholderTextColor="#A0AEC0"
                />
                <TouchableOpacity
                  style={styles.visibilityToggle}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Text style={styles.visibilityIcon}>{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {/* Display real-time validation feedback if user has started typing */}
              {passwordTouched && newPassword && !validatePassword(newPassword).isValid && (
                <Text style={styles.errorText}>{getPasswordValidationError(validatePassword(newPassword))}</Text>
              )}
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
              
              {/* Password strength indicator */}
              {newPassword ? (
                <View style={styles.strengthContainer}>
                  <View style={[styles.strengthBar, { backgroundColor: passwordStrength.color }]} />
                  <Text style={styles.strengthText}>{passwordStrength.label}</Text>
                </View>
              ) : null}
              
              {/* Dynamic Password requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password requirements:</Text>
                <View style={styles.requirementsList}>
                  {newPassword ? (
                    <>
                      <Text style={[
                        styles.requirementItem, 
                        validatePassword(newPassword).hasMinLength ? styles.requirementMet : styles.requirementNotMet
                      ]}>
                        {validatePassword(newPassword).hasMinLength ? '✓' : '•'} At least 8 characters
                      </Text>
                      <Text style={[
                        styles.requirementItem, 
                        validatePassword(newPassword).hasUpperCase ? styles.requirementMet : styles.requirementNotMet
                      ]}>
                        {validatePassword(newPassword).hasUpperCase ? '✓' : '•'} Uppercase letter (A-Z)
                      </Text>
                      <Text style={[
                        styles.requirementItem, 
                        validatePassword(newPassword).hasLowerCase ? styles.requirementMet : styles.requirementNotMet
                      ]}>
                        {validatePassword(newPassword).hasLowerCase ? '✓' : '•'} Lowercase letter (a-z)
                      </Text>
                      <Text style={[
                        styles.requirementItem, 
                        validatePassword(newPassword).hasNumber ? styles.requirementMet : styles.requirementNotMet
                      ]}>
                        {validatePassword(newPassword).hasNumber ? '✓' : '•'} Number (0-9)
                      </Text>
                      <Text style={[
                        styles.requirementItem, 
                        validatePassword(newPassword).hasSpecialChar ? styles.requirementMet : styles.requirementNotMet
                      ]}>
                        {validatePassword(newPassword).hasSpecialChar ? '✓' : '•'} Special character (!@#$%^&*)
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.requirementItem}>• At least 8 characters</Text>
                      <Text style={styles.requirementItem}>• Uppercase letter (A-Z)</Text>
                      <Text style={styles.requirementItem}>• Lowercase letter (a-z)</Text>
                      <Text style={styles.requirementItem}>• Number (0-9)</Text>
                      <Text style={styles.requirementItem}>• Special character (!@#$%^&*)</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            
            {/* Confirm New Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    // Clear any previous errors when user is typing
                    if (errors.confirmPassword) {
                      setErrors({...errors, confirmPassword: ''});
                    }
                  }}
                  placeholder="Confirm new password"
                  placeholderTextColor="#A0AEC0"
                />
                <TouchableOpacity
                  style={styles.visibilityToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.visibilityIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
            
            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityText}>
                Please ensure you remember your new password. You'll use it to log in to your account.
              </Text>
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, isVerifying && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={isVerifying}
            >
              <Text style={styles.submitButtonText}>
                {isVerifying ? 'Processing...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {/* Cancel Button */}
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => router.navigate("/sign-in")}
        disabled={isVerifying || sendingEmail || verifyingCode}
      >
        <Text style={styles.cancelButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
    marginVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2C3E50',
  },
  visibilityToggle: {
    padding: 10,
  },
  visibilityIcon: {
    fontSize: 20,
    color: '#A0AEC0',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    marginTop: 6,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBar: {
    height: 6,
    width: 100,
    borderRadius: 3,
    marginRight: 8,
  },
  strengthText: {
    fontSize: 14,
    color: '#4A5568',
  },
  requirementsContainer: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  requirementsList: {
    paddingLeft: 8,
  },
  requirementItem: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  requirementMet: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  requirementNotMet: {
    color: '#7F8C8D',
    fontWeight: '400',
  },
  securityNotice: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: '#1A237E',
    lineHeight: 20,
  },
  verifyButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resendButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 8,
    padding: 16,
    flex: 0.48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resendButtonText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgetPassword;