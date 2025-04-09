import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { withDecay } from 'react-native-reanimated';

const melanomaSymptoms = require('@/assets/images/a-e_guidelines.png');

const Symptoms = () => {
  return (
    <ScrollView>
    <View className='bg-[#25292e] p-[10]'>
      <View className="text-custom-xlg font-extrabold text-white">
        <Text className="text-custom-xlg font-extrabold text-white">What is MELANOMA?</Text>
        <Text className="text-custom-sm font-semibold text-white">
            Melanoma is the most aggressive form of skin cancer that begins in melanocytes, the cells that produce melanin 
            (the pigment that gives skin its color). It typically appears as an unusual mole or develops from an existing mole, 
            and can occur anywhere on the body.
        </Text>
        <Text className="text-custom-xlg font-extrabold text-white mt-[10]">How dangerous is melanoma?</Text>
        <Text className="text-custom-sm font-semibold text-white">
            Melanoma is considered the most dangerous form of skin cancer because it can rapidly spread to other organs if not caught early. 
            While it accounts for only about 1% of all skin cancers, it causes the majority of skin cancer deaths due to its 
            aggressive nature and ability to metastasize.
        </Text>
        <Text className="text-custom-sm font-semibold text-white mt-[10]">• Risk factors for melanoma:</Text>
        <Text className="text-custom-md font-semibold text-white mt-[3]">• Fair skin, light hair, and light eyes</Text>
        <Text className="text-custom-md font-semibold text-white mt-[3]">• History of excessive UV exposure or sunburns</Text>
        <Text className="text-custom-md font-semibold text-white mt-[3]">• Family history of melanoma</Text>
        <Text className="text-custom-md font-semibold text-white mt-[3]">• Multiple moles or unusual moles</Text>
        <Text className="text-custom-md font-semibold text-white mt-[3]">• Weakened immune system</Text>
        <Text className="text-custom-md font-semibold text-white mt-[3]">• Previous history of skin cancer</Text>
        <Text className="text-custom-md font-semibold text-white mt-[3]">• Living closer to the equator or at higher elevations</Text>
      </View>
      <View>
        <Text className="text-custom-xlg font-extrabold text-white mt-[10]">Treatment options</Text>
        <Text className="text-custom-sm font-semibold text-white mt-[3]">The primary treatment depends on the stage of melanoma:</Text>
        <Text className="text-custom-sm font-semibold text-white mt-[3]">• Early-stage: Surgical removal of the melanoma and surrounding tissue</Text>
        <Text className="text-custom-sm font-semibold text-white mt-[3]">• Advanced stages: Combination of surgery, immunotherapy, targeted therapy, radiation therapy, and/or chemotherapy</Text>
        <Text className="text-custom-sm font-semibold text-white mt-[3]">• Regular follow-up care and skin checks are essential after treatment</Text>
        <Text className="text-custom-sm font-semibold text-white mt-[3]">• New targeted therapies and immunotherapies have significantly improved survival rates for advanced melanoma</Text>
      </View>
      <View>
        <Text className="text-custom-xlg font-extrabold text-white mt-[10]">Symptoms of Melanoma (ABCDE)</Text>
      </View>
      <View className='mt-[25]'>
        <Image source={melanomaSymptoms} style={styles.imageSize} />
        <Text className="text-custom-lg font-extrabold text-white">(Graphic by Sanford Health)</Text>
        <Text className="text-custom-lg font-extrabold text-white mt-[5]">1. Assymetry</Text>
        <Text className="text-custom-sm font-semibold text-white">If a mole were to be folded in half, would it match? If not, that is more suspicious.</Text>
        <Text className="text-custom-lg font-extrabold text-white mt-[3]">2. Borders</Text>
        <Text className="text-custom-sm font-semibold text-white">If a mole has jagged or scalloped edges it may be melanoma.</Text>
        <Text className="text-custom-lg font-extrabold text-white mt-[3]">3. Colors</Text>
        <Text className="text-custom-sm font-semibold text-white">Multicolored lesions, or more than three colors in one spot is a concerning feature.</Text>
        <Text className="text-custom-lg font-extrabold text-white mt-[3]">4. Diameter</Text>
        <Text className="text-custom-sm font-semibold text-white">Any mole greater than the size of a pencil eraser (six millimeters) should be checked.</Text>
        <Text className="text-custom-lg font-extrabold text-white mt-[3]">5. Evolving</Text>
        <Text className="text-custom-sm font-semibold text-white">Any mole that changes over time, whether in size, shape or color should be looked at by a doctor.</Text>

        <Text className="text-custom-xlg font-semibold text-white mt-[10]">“Skin checks are really important,” said Dr. Joanne Montgomery, a dermatologist at Sanford Fargo.</Text>
      </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    imageSize: {
        height: 320,
        width: "100%"
    }
});

export default Symptoms