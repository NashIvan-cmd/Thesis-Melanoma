import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function LogoScreen() {
  return (
    <View style={styles.container}>
      {/* Icon + Text Format */}
      <View style={styles.logoContainer}>
        <View style={styles.icon}>
          <View style={styles.scanLine} />
          <View style={styles.magnifier} />
          <View style={[styles.mole, styles.dot1]} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.appName}>Melanoma Tracker</Text>
          <Text style={styles.tagline}>Catch it early, live fully.</Text>
        </View>
      </View>

      {/* SVG Version */}
      <View style={styles.fullLogo}>
        <Svg width={300} height={80} viewBox="0 0 300 80">
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3498db" />
              <Stop offset="100%" stopColor="#9b59b6" />
            </LinearGradient>
          </Defs>

          {/* Circle Background */}
          <Circle cx="40" cy="40" r="30" fill="url(#gradient)" />

          {/* Magnifier */}
          <Circle cx="40" cy="40" r="15" fill="none" stroke="white" strokeWidth="3" />
          <Line x1="50" y1="50" x2="60" y2="60" stroke="white" strokeWidth="3" />

          {/* Scan Line */}
          <Rect x="10" y="40" width="60" height="2" fill="white" opacity="0.8" />

          {/* Mole */}
          <Circle cx="42" cy="42" r="5" fill="rgba(139, 69, 19, 0.6)" />

          {/* App Name */}
          <SvgText x="80" y="45" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#333">
            MelaScope
          </SvgText>
          <SvgText x="80" y="60" fontFamily="Arial" fontSize="12" fill="#777">
            Catch it early, live fully.
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'linear-gradient(135deg, #3498db, #9b59b6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    top: '50%',
  },
  magnifier: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
  },
  mole: {
    backgroundColor: 'rgba(139, 69, 19, 0.6)',
    borderRadius: 10,
    position: 'absolute',
  },
  dot1: {
    width: 15,
    height: 15,
    top: '45%',
    left: '45%',
  },
  textContainer: {
    flexShrink: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  tagline: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  fullLogo: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
  },
});
