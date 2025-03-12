import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, Alert } from "react-native";

export default function Page() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    Alert.alert("QR Code Scanned", `Data: ${data}`);
  };

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : ({ data }) => {
            console.log(data); // here you can get your barcode id or url
            handleBarCodeScanned({ data });
          }}
          style={styles.camera}
        />
        <View style={styles.frame} />
      </View>
      {scanned && (
        <Button
          title="Tap to Scan Again"
          onPress={() => setScanned(false)}
          color="#0e7490" // bg-cyan-700
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  cameraContainer: {
    width: "90%",
    height: "70%",
    position: "relative",
    marginBottom: 20,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  frame: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderWidth: 4,
    borderColor: "#fff",
    opacity: 0.5,
  },
});