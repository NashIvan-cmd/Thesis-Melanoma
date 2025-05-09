import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import BackButton from '@/components/backButton';
import { useSession } from '@/services/authContext';
import { API_URL } from '@env';

interface PasswordErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}


const ChangePassword = () => {
  const navigation = useNavigation();
  
  const { userId, accessToken } = useSession();
  // State for form fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for validation and visibility
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Real-time validation for the new password field
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isSameDbPassword, setIsSameDbPassword] = useState(true);
  
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
  
  // Form submission handler
  const handleSubmit = async() => {
    // Reset previous errors
    setErrors({});
    let newErrors: PasswordErrors = {};
    let isValid = true;
    
    // Validate old password
    if (!oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
      isValid = false;
    }
    
    // Validate new password
    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      // Get specific error message based on what requirement is missing
      newErrors.newPassword = getPasswordValidationError(newPasswordValidation);
      isValid = false;
    }
    
    // Check if new password is same as old password
    if (newPassword === oldPassword) {
      newErrors.newPassword = 'New password must be different from current password';
      isValid = false;
    }
    
    // Validate confirm password
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (isValid) {
      // Handle password change logic here
      // This would typically involve an API call to your backend
      const result = await fetch(`${API_URL}/v1/password/change`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "authorization": accessToken ? `Bearer ${accessToken}` : ''
        },
        body: JSON.stringify({
            userId,
            newPassword,
            oldPassword
        })
      })  
      
      const data = await result.json();

      console.log({ data });
      if (data.success == false) {
        setIsSameDbPassword(false);       
        return;
      } 

      Alert.alert(
        "Success",
        "Your password has been changed successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
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
        <Text style={styles.headerTitle}>Change Password</Text>
        <Text style={styles.headerSubtitle}>Update your account password</Text>
      </View>
      
      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Current Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={(text) => {
                setOldPassword(text);
                // Clear any previous errors when user is typing
                if (errors.oldPassword) {
                  setErrors({...errors, oldPassword: ''});
                }
              }}
              placeholder="Enter current password"
              placeholderTextColor="#A0AEC0"
            />
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              <Text style={styles.visibilityIcon}>{showOldPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.oldPassword && (
            <Text style={styles.errorText}>{errors.oldPassword}</Text>
        )}
            <Text style={styles.errorText} className='mt-3'>{!isSameDbPassword ? 'Current password invalid' : ''}</Text>
        </View>
        
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
      </View>
      
      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityIcon}>🔒</Text>
        {/* <Text style={styles.securityText}>
          For security reasons, you'll be asked to log in again after changing your password.
        </Text> */}
      </View>
      
      {/* Submit Button */}
      <View className='items-center'>
        <Text style={styles.errorText} className='mt-3'>{!isSameDbPassword ? 'Current password invalid' : ''}</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update Password</Text>
      </TouchableOpacity>
      
      {/* Cancel Button */}
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
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
    margin: 16,
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
  submitButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

export default ChangePassword;