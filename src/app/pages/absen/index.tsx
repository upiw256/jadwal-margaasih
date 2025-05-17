import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button } from "react-native";
import { fetchStudents } from '../../api';
import { useRouter } from "expo-router";

export default function Page() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    setCameraActive(false); // Close the camera
    try {
      const students = await fetchStudents();
      const student = students.find(student => student.peserta_didik_id === data);
      if (student) {
        router.push({
          pathname: `/pages/absen/[id]`,
          params: { student: JSON.stringify(student) }
        });
      } else {
        Alert.alert("Error", "Student not found");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      Alert.alert("Error", "Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraActive && (
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
      )}
      {scanned && (
        <Button
          title="Tap to Scan Again"
          onPress={() => {
            setScanned(false);
            setCameraActive(true); // Reopen the camera
          }}
          color="#0e7490" // bg-cyan-700
        />
      )}
      {loading && (
        <ActivityIndicator size="large" color="#0e7490" style={styles.loading} />
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
  loading: {
    marginTop: 20,
  },
});
