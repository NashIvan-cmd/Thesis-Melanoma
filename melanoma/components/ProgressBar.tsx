import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

function ProgressBar() {
  // Get screen dimensions using React Native's Dimensions API
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Progress value={40} size="xl" orientation="horizontal">
          <ProgressFilledTrack />
        </Progress>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: 300,
  }
});

export default ProgressBar;