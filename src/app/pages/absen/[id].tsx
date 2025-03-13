import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function StudentDetail() {
  const { student } = useLocalSearchParams();
  const studentData = JSON.parse(Array.isArray(student) ? student[0] : student);
  const router = useRouter();

  const handleAttendance = async () => {
    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const body = {
      student_id: studentData.id,
      date: date,
      present: true,
    };

    console.log("Request body:", body); // Log the request body

    try {
      const response = await fetch("https://sman1margaasih.sch.id/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer Sman1margaasih*`, // Replace with the actual token
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        Alert.alert("Success", studentData.nama+" Berhasil Absen", [
          { text: "OK", onPress: () => router.push("/pages/absen") }
        ]);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        Alert.alert("Error", "Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      Alert.alert("Error", "Failed to mark attendance");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      <View style={styles.studentInfo}>
        <Text style={styles.studentText}>Name: {studentData.nama}</Text>
        <Text style={styles.studentText}>Class: {studentData.nama_rombel}</Text>
        <Text style={styles.studentText}>NISN: {studentData.nisn}</Text>
        <Text style={styles.studentText}>Gender: {studentData.jenis_kelamin}</Text>
        <Text style={styles.studentText}>Birth Date: {studentData.tanggal_lahir}</Text>
        <Text style={styles.studentText}>Phone: {studentData.nomor_telepon_seluler}</Text>
      </View>
      <Button title="Absensi Hadir" onPress={handleAttendance} color="#0e7490" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  studentInfo: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  studentText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
