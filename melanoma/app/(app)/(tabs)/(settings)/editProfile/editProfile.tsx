import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const EditProfile = () => {

  // Navigation handlers
  const handleChangePassword = () => {
    router.navigate("/editProfile/changePassword")
  };

  const handleResetPassword = () => {
    // navigation.navigate();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account Security</Text>
        <Text style={styles.headerSubtitle}>Manage your account authentication</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsContainer}>
        {/* Username option - commented out as requested */}
        {/* 
        <TouchableOpacity 
          style={styles.optionItem} 
          onPress={() => navigation.navigate('ChangeUsername')}
        >
          <View style={styles.optionIconContainer}>
            <Text style={styles.optionIcon}>👤</Text>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Change Username</Text>
            <Text style={styles.optionDescription}>Update your account username</Text>
          </View>
        </TouchableOpacity>
        */}

        {/* Change Password Option */}
        <TouchableOpacity 
          style={styles.optionItem} 
          onPress={handleChangePassword}
        >
          <View style={styles.optionIconContainer}>
            <Text style={styles.optionIcon}>🔒</Text>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Change Password</Text>
            <Text style={styles.optionDescription}>Update your current password</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Reset Password Option */}
        <TouchableOpacity 
          style={styles.optionItem} 
          onPress={handleResetPassword}
        >
          <View style={styles.optionIconContainer}>
            <Text style={styles.optionIcon}>🔄</Text>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Reset Password</Text>
            <Text style={styles.optionDescription}>Create a new password if you forgot yours</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityIcon}>🛡️</Text>
        <Text style={styles.securityText}>
          We recommend using a strong password that you don't use elsewhere.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 12,
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
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E6ED',
    marginHorizontal: 20,
  },
  securityNotice: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
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
    color: '#5D4037',
    lineHeight: 20,
  },
});

export default EditProfile;