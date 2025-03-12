import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function StudentDetail() {
  const { student } = useLocalSearchParams();
  const studentData = JSON.parse(Array.isArray(student) ? student[0] : student);

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
  },
  studentText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
