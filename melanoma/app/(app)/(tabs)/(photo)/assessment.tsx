import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAssessmentStore } from '@/services/useAssessmentStore';

const { width } = Dimensions.get('window');

const Assessment = () => {
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
  // Static data for demonstration
  const assessmentData = {
    imageUrl: uri,
    model_assessment: model_assessment,
    risk_assessment: risk_assessment,
    risk_summary: risk_summary,
    body_part: body_part,
    createdAt: createdAt
  };

  // Determine styling based on assessment
  const isBenign = assessmentData.model_assessment === "Benign";
  
  // Risk level categorization
  const getRiskLevel = (score: number) => {
    if (score < 25) return "Low";
    if (score < 60) return "Moderate";
    return "High";
  };
  
  const formatDate = (date: Date | string) => {
    if (!(date instanceof Date)) return;
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container} className='p-2'>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mole Assessment</Text>
          <Text style={styles.headerSubtitle}>
            {formatDate(assessmentData.createdAt)} • {assessmentData.body_part}
          </Text>
        </View>
        
        {/* Image Section - 40% of screen height */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: assessmentData.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        {/* Assessment Box */}
        <View style={[
          styles.assessmentBox, 
          { backgroundColor: isBenign ? '#DCFCE7' : '#FEE2E2' }
        ]}>
          <View style={styles.assessmentContent}>
            <View>
              <Text style={[
                styles.assessmentResult, 
                { color: isBenign ? '#15803D' : '#B91C1C' }
              ]}>
                {assessmentData.model_assessment}
              </Text>
              <Text style={styles.assessmentLabel}>AI Assessment</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[
                styles.assessmentScore, 
                { color: isBenign ? '#15803D' : '#B91C1C' }
              ]}>
                {assessmentData.risk_assessment}%
              </Text>
              <Text style={styles.assessmentLabel}>
                Risk Score • {getRiskLevel(assessmentData.risk_assessment)}
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
              <Text style={styles.reasoningText}>{assessmentData.risk_summary}</Text>
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
        
        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Find a Dermatologist Near You</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    width: width,
    height: width * 0.8, // Approx 40% of screen height on most devices
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
    alignItems: 'center',
  },
  assessmentResult: {
    fontSize: 24,
    fontWeight: '700',
  },
  assessmentScore: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'right',
  },
  assessmentLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
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
  actionButton: {
    marginHorizontal: 16,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
});

export default Assessment;