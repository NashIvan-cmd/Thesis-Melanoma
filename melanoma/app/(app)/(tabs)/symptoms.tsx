import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { withDecay } from 'react-native-reanimated';

const melanomaSymptoms = require('@/assets/images/a-e_guidelines.png');

const Symptoms = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView className='bg-slate-50'>
        <View className='p-[16]'>
          <View>
            <Text className="text-custom-xlg font-extrabold text-blue-800 mb-2">What is MELANOMA?</Text>
            <View className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4">
              <Text className="text-slate-700 text-custom-sm">
                Melanoma is the most aggressive form of skin cancer that begins in melanocytes, the cells that produce melanin 
                (the pigment that gives skin its color). It typically appears as an unusual mole or develops from an existing mole, 
                and can occur anywhere on the body.
              </Text>
            </View>
            
            <Text className="text-custom-xlg font-extrabold text-blue-800 mt-[10] mb-2">How dangerous is melanoma?</Text>
            <View className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4">
              <Text className="text-slate-700 text-custom-sm">
                Melanoma is considered the most dangerous form of skin cancer because it can rapidly spread to other organs if not caught early. 
                While it accounts for only about 1% of all skin cancers, it causes the majority of skin cancer deaths due to its 
                aggressive nature and ability to metastasize.
              </Text>
            </View>
            
            <Text className="text-custom-lg font-bold text-blue-800 mt-[10] mb-2">Risk factors for melanoma:</Text>
            <View className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4">
              <Text className="text-slate-700 text-custom-md mb-1">• Fair skin, light hair, and light eyes</Text>
              <Text className="text-slate-700 text-custom-md mb-1">• History of excessive UV exposure or sunburns</Text>
              <Text className="text-slate-700 text-custom-md mb-1">• Family history of melanoma</Text>
              <Text className="text-slate-700 text-custom-md mb-1">• Multiple moles or unusual moles</Text>
              <Text className="text-slate-700 text-custom-md mb-1">• Weakened immune system</Text>
              <Text className="text-slate-700 text-custom-md mb-1">• Previous history of skin cancer</Text>
              <Text className="text-slate-700 text-custom-md">• Living closer to the equator or at higher elevations</Text>
            </View>
          </View>
          
          <View>
            <Text className="text-custom-xlg font-extrabold text-blue-800 mt-[10] mb-2">Treatment options</Text>
            <View className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4">
              <Text className="text-slate-700 text-custom-sm mb-2">The primary treatment depends on the stage of melanoma:</Text>
              <Text className="text-slate-700 text-custom-sm mb-1">• Early-stage: Surgical removal of the melanoma and surrounding tissue</Text>
              <Text className="text-slate-700 text-custom-sm mb-1">• Advanced stages: Combination of surgery, immunotherapy, targeted therapy, radiation therapy, and/or chemotherapy</Text>
              <Text className="text-slate-700 text-custom-sm mb-1">• Regular follow-up care and skin checks are essential after treatment</Text>
              <Text className="text-slate-700 text-custom-sm">• New targeted therapies and immunotherapies have significantly improved survival rates for advanced melanoma</Text>
            </View>
          </View>
          
          <View>
            <Text className="text-custom-xlg font-extrabold text-blue-800 mt-[10] mb-2">Symptoms of Melanoma (ABCDE)</Text>
          </View>
          
          <View className='bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4'>
            <Image source={melanomaSymptoms} style={styles.imageSize} className="rounded-lg mb-2" />
            <Text className="text-slate-500 text-xs text-right mb-4">Graphic by Sanford Health</Text>
            
            <View className="mb-3 border-l-4 border-blue-500 pl-3">
              <Text className="text-blue-800 font-bold text-custom-lg">A: Asymmetry</Text>
              <Text className="text-slate-700 text-custom-sm">If a mole were to be folded in half, would it match? If not, that is more suspicious.</Text>
            </View>
            
            <View className="mb-3 border-l-4 border-blue-500 pl-3">
              <Text className="text-blue-800 font-bold text-custom-lg">B: Borders</Text>
              <Text className="text-slate-700 text-custom-sm">If a mole has jagged or scalloped edges it may be melanoma.</Text>
            </View>
            
            <View className="mb-3 border-l-4 border-blue-500 pl-3">
              <Text className="text-blue-800 font-bold text-custom-lg">C: Colors</Text>
              <Text className="text-slate-700 text-custom-sm">Multicolored lesions, or more than three colors in one spot is a concerning feature.</Text>
            </View>
            
            <View className="mb-3 border-l-4 border-blue-500 pl-3">
              <Text className="text-blue-800 font-bold text-custom-lg">D: Diameter</Text>
              <Text className="text-slate-700 text-custom-sm">Any mole greater than the size of a pencil eraser (six millimeters) should be checked.</Text>
            </View>
            
            <View className="mb-3 border-l-4 border-blue-500 pl-3">
              <Text className="text-blue-800 font-bold text-custom-lg">E: Evolving</Text>
              <Text className="text-slate-700 text-custom-sm">Any mole that changes over time, whether in size, shape or color should be looked at by a doctor.</Text>
            </View>
          </View>

          <View className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
            <Text className="text-blue-800 font-semibold italic">"Skin checks are really important," said Dr. Joanne Montgomery, a dermatologist at Sanford Fargo.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    imageSize: {
        height: 320,
        width: "104%"
    }
});

export default Symptoms