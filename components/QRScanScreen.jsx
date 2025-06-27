// QRScanScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../utils/requests'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRScanScreen() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  // Request camera permissions on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  // Reset scanner when screen comes back into focus
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
    }, [])
  );

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
    console.log('aisuhdisauhdisajd',data)
    // Extract branch ID from URL
    if (data.startsWith(BASE_URL)) {
      console.log('valid qr', data);

      const branchId = data.split('/').pop();

      console.log('branch id', branchId);

      navigation.navigate('ProductScreen', {
        branchId: branchId,
      });
    } else {
      console.log('Invalid QR', data);
      setScanned(false);
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      
      {/* Scanner overlay with dark background */}
      <View style={styles.overlay}>
        {/* Top dark area */}
        <View style={[styles.overlaySection, styles.topOverlay]} />
        
        {/* Middle section with side dark areas */}
        <View style={styles.middleSection}>
          <View style={[styles.overlaySection, styles.sideOverlay]} />
          <View style={styles.scanContainer}>
            <View style={styles.scanFrame} />
            {/* <View style={styles.scanAnimatedLine} /> */}
            <Text style={styles.scanText}>Align QR code within frame</Text>
          </View>
          <View style={[styles.overlaySection, styles.sideOverlay]} />
        </View>

        {/* Bottom dark area */}
        <View style={[styles.overlaySection, styles.bottomOverlay]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySection: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  middleSection: {
    flexDirection: 'row',
    flex: 0, // Disable vertical expansion
  },
  sideOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanContainer: {
    position: 'relative',
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#F7A300',
    backgroundColor: 'transparent',
  },
  scanAnimatedLine: {
    position: 'absolute',
    height: 2,
    width: '90%',
    backgroundColor: '#ff4141',
    top: '50%',
  },
  scanText: {
    position: 'absolute',
    bottom: -40,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});