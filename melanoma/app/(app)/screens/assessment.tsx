import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAssessmentStore } from '@/services/useAssessmentStore';
import { router, useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const Assessment = () => {
  const navigation = useNavigation();
  const [showReasoning, setShowReasoning] = useState(false);
  const { 
    uri, 
    xCoordinate, 
    yCoordinate, 
    model_assessment,
    risk_assessment,
    risk_summary,
    body_part,
    createdAt
  } = useAssessmentStore.getState();
  
  // Calculate adjusted risk assessment score based on model assessment
  // const calculateAdjustedRiskScore = (baseScore: number, assessmentType: string) => {
  //   let score = baseScore || 0;
    
  //   // Apply score adjustments based on assessment type
  //   if (assessmentType === "Possibly Malignant") {
  //     score += 55;
  //   } else if (assessmentType === "Likely Malignant") {
  //     score += 70;
  //   }
    
  //   // Cap score at 100 maximum
  //   return Math.min(score, 100);
  // };
  
  // Static data for demonstration with adjusted risk score
  const assessmentData = {
    imageUrl: uri,
    model_assessment: model_assessment,
    risk_assessment: risk_assessment, // calculateAdjustedRiskScore(risk_assessment, model_assessment),
    risk_summary: risk_summary,
    body_part: body_part,
    createdAt: createdAt
  };

  // Determine styling based on assessment
  const isBenign = assessmentData.model_assessment === "Possibly Benign" || assessmentData.model_assessment === "Benign" || assessmentData.model_assessment === "Likely Benign";
  
  useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

  // Risk level categorization
  const getRiskLevel = (model_assessment: string) => {
    if (!model_assessment) return "Unknown";
    if (model_assessment === 'Likely Benign') return "Low Risk";
    if (model_assessment === 'Possibly Benign') return "Moderate Risk";
    if (model_assessment === 'Possibly Malignant') return "High Risk";
    if (model_assessment === 'Likely Malignant') return "Very High Risk";
    if (model_assessment === 'Benign') return "Low Risk";
    return "Unknown Risk";
  };
  
  const formatDate = (date: Date) => {
    if (!date) return "";
    if (!(date instanceof Date)) {
      // Try to convert string to Date
      try {
        date = new Date(date);
      } catch (e) {
        return "";
      }
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleNavigateToPhoto = () => {
    router.push("/(app)/(tabs)/(photo)");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* <TouchableOpacity 
            style={styles.backButton}
            onPress={handleNavigateToPhoto}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#1F2937" />
          </TouchableOpacity> */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Mole Assessment</Text>
            <Text style={styles.headerSubtitle}>
              {formatDate(assessmentData.createdAt as Date)} • {assessmentData.body_part || "Unspecified"}
            </Text>
          </View>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: assessmentData.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        {/* Assessment Box - Fixed for smaller screens */}
        <View style={[
  styles.assessmentBox, 
  { backgroundColor: isBenign ? '#DCFCE7' : '#FEE2E2' }
]}>
  {/* AI Assessment Section */}
  <View style={styles.assessmentSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>AI Analysis</Text>
      <Text style={styles.sectionSubtitle}>Machine Learning Model</Text>
    </View>
    <Text style={[
      styles.assessmentResult, 
      { color: isBenign ? '#15803D' : '#B91C1C' }
    ]}>
      {assessmentData.model_assessment || "Unknown"}
    </Text>
  </View>

  {/* Divider */}
  <View style={styles.assessmentDivider} />

  {/* Risk Score Section */}
  <View style={styles.assessmentSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Risk Assessment</Text>
      <Text style={styles.sectionSubtitle}>Dermatologist-Verified Model</Text>
    </View>
    <View style={styles.riskScoreRow}>
      <Text style={[
        styles.assessmentScore, 
        { color: isBenign ? '#15803D' : '#B91C1C' }
      ]}>
        {assessmentData.risk_assessment}%
      </Text>
      <Text style={[
        styles.riskLevel,
        { color: isBenign ? '#15803D' : '#B91C1C' }
      ]}>
        {getRiskLevel(assessmentData.model_assessment)}
      </Text>
    </View>
  </View>
</View>

        
        {/* Reasoning Section (Expandable) */}
        <View style={styles.reasoningContainer}>
          <TouchableOpacity 
            style={styles.reasoningHeader}
            onPress={() => setShowReasoning(!showReasoning)}
            activeOpacity={0.7}
          >
            <Text style={styles.reasoningTitle}>Assessment Reasoning</Text>
            <Feather 
              name={showReasoning ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#64748B" 
            />
          </TouchableOpacity>
          
          {showReasoning && (
            <View style={styles.reasoningContent}>
              <Text style={styles.reasoningText}>{assessmentData.risk_summary || "No reasoning available."}</Text>
            </View>
          )}
        </View>
        
        {/* Disclaimer Box */}
        <View style={styles.disclaimerBox}>
          <View style={styles.disclaimerHeader}>
            <Feather name="alert-triangle" size={20} color="#B45309" />
            <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This assessment is provided for informational purposes only and is not a medical diagnosis. 
            Please consult with a dermatologist for professional evaluation regardless of the assessment result.
          </Text>
        </View>
        
        {/* Spacing to ensure content isn't hidden behind fixed button on small screens */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Fixed Action Button at bottom */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={handleNavigateToPhoto}
        >
          <Text style={styles.actionButtonText}>Back to Main Screen</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding to account for fixed button
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  imageContainer: {
    width: '100%',
    height: width * 0.8, // Adjust based on width for consistency
    marginBottom: 16,
    backgroundColor: '#E5E7EB', // Placeholder color
  },
  image: {
    width: '100%',
    height: '100%',
  },
  assessmentBox: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  assessmentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  assessmentLeftColumn: {
    flex: 1,
    paddingRight: 8,
  },
  // assessmentResult: {
  //   fontSize: 22,
  //   fontWeight: '700',
  //   flexShrink: 1,
  //   flexWrap: 'wrap',
  // },
  // assessmentScore: {
  //   fontSize: 22,
  //   fontWeight: '700',
  //   textAlign: 'right',
  // },
  assessmentLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  assessmentSection: {
    flex: 1,
    paddingVertical: 8,
  },
  
  sectionHeader: {
    marginBottom: 8,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  
  sectionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  
  assessmentDivider: {
    width: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 16,
  },
  
  riskScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  
  riskLevel: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Update existing styles:
  assessmentResult: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  assessmentScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reasoningContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  reasoningHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reasoningTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  reasoningContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reasoningText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  disclaimerBox: {
    marginHorizontal: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#92400E',
    marginLeft: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 24,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 250, 251, 0.9)', // Slight translucent background
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
});

export default Assessment;