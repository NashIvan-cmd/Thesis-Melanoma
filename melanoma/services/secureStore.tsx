import * as SecureStore from 'expo-secure-store';

const saveSecureStore = async(key: string, value: string) => {
    
}

const getValue = async(key: string)  => {
    const result = await SecureStore.getItemAsync(key);
    
    if (!result) {   
        return "The key provided have no corressponding value"
    }

    return result;
} 