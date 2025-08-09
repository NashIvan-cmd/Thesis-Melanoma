import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { 
  Checkbox, 
  CheckboxIndicator, 
  CheckboxIcon, 
  CheckboxLabel 
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { useSession } from '@/services/authContext';
import { API_URL } from '@env';
import { accessTokenInterceptor } from '@/interceptor/accessToken.interceptor';

export default function DeleteAccount() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { userId, accessToken } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation();
  
  // Reset agreement checkbox whenever the screen comes into focus
  useEffect(() => {
    const resetAgreement = () => {
      setAgreedToTerms(false);
    };
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', resetAgreement);
    
    // Clean up listener when component unmounts
    return unsubscribe;
  }, [navigation]);

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/account/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      accessTokenInterceptor(data);
      // Check if the request was successful
      if (response.ok) {
        console.log(`Successfully deleted account for user: ${userId}`);
        return { success: true, data };
      }
      
      // If status is 207, it means partial deletion (some operations failed)
      if (response.status === 207) {
        console.warn('Partial account deletion:', data);
        return { 
          success: false, 
          partial: true, 
          data,
          message: data.message || 'Some parts of your account could not be deleted'
        };
      }
      
      // Otherwise it's a regular error
      console.error(`Error deleting account: Status ${response.status}`, data);
      throw new Error(data.message || 'Failed to delete account');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!agreedToTerms) {
      Alert.alert(
        "Confirmation Required",
        "Please confirm that you understand the consequences of account deletion by checking the box."
      );
      return;
    }

    setIsDeleting(true);
    
    try {
      // Show confirmation dialog
      Alert.alert(
        "Delete Account",
        "This action cannot be undone. Are you absolutely sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setIsDeleting(false)
          },
          {
            text: "Delete Permanently",
            style: "destructive",
            onPress: async () => {
              try {
                const result = await deleteAccount();
                
                if (result.success) {
                  // Show farewell message before redirecting on complete success
                  Alert.alert(
                    "Account Deleted",
                    "We're sorry to see you go. If you ever have skin health concerns in the future, we'll be here to help.",
                    [
                      {
                        text: "OK",
                        onPress: () => router.replace('/sign-in')
                      }
                    ]
                  );
                } else if (result.partial) {
                  // Handle partial deletion - some parts were deleted successfully
                  Alert.alert(
                    "Account Partially Deleted",
                    `${result.message}. Some of your information may still be in our system. Please contact support for complete removal.`,
                    [
                      {
                        text: "OK",
                        onPress: () => router.replace('/sign-in')
                      }
                    ]
                  );
                } else {
                  // Should not typically happen, but handle unknown result states
                  throw new Error('Unknown deletion result state');
                }
              } catch (error) {
                let errorMessage = "Failed to delete account. Please try again later.";
                
                if (error instanceof Error) {
                  if (error.message.includes("health data") || error.message.includes("assessments")) {
                    errorMessage = "Unable to delete your health data. Please contact support for assistance.";
                  } else if (error.message.includes("images") || error.message.includes("files") || error.message.includes("storage")) {
                    errorMessage = "Unable to delete your stored images. Please contact support for assistance.";
                  }
                }
                
                Alert.alert("Error", errorMessage);
                setIsDeleting(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete account. Please try again later.");
      setIsDeleting(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        <View className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Delete Your Account</Text>
          
          <Text className="text-red-600 font-semibold mb-6">
            Warning: This action cannot be undone.
          </Text>
          
          <Text className="text-gray-700 mb-4">
            Deleting your account will permanently remove:
          </Text>
          
          <View className="mb-6 space-y-2 pl-4">
            <Text className="text-gray-700">• All your saved mole images and history</Text>
            <Text className="text-gray-700">• All your skin assessments and reports</Text>
            <Text className="text-gray-700">• Your user profile and preferences</Text>
            <Text className="text-gray-700">• All tracking data and analysis results</Text>
          </View>
          
          <Text className="text-gray-700 mb-6">
            This information cannot be recovered once your account is deleted. If you have medical data you wish to keep, please export it before proceeding with deletion.
          </Text>
          
          <View className="flex-row items-start mb-8 bg-gray-50 p-4 rounded-lg">
            <Checkbox
              value="agree"
              isChecked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
              size="md"
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel className="ml-3 flex-shrink">
                <Text className="text-gray-800">
                  I understand that deleting my account will permanently erase all my data and this action cannot be reversed.
                </Text>
              </CheckboxLabel>
            </Checkbox>
          </View>
        </View>

        <View className="items-center space-y-2">
          <Button
            size="lg"
            className={`w-full mb-1 ${agreedToTerms ? 'bg-rose-600 active:bg-rose-700' : 'bg-rose-400'}`}
            onPress={handleDeleteAccount}
            disabled={!agreedToTerms || isDeleting}
          >
            <ButtonText>{isDeleting ? "Processing..." : "Delete My Account"}</ButtonText>
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full border-gray-300 active:bg-gray-100"
            onPress={() => router.back()}
          >
            <ButtonText className="text-gray-700">Cancel</ButtonText>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}