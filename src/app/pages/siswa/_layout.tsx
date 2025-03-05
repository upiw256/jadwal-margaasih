import { View, Text, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchStudents } from '../../api';

export default function Page() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudentsData();
  }, []);

  const handleSearch = () => {
    const filtered = students.filter(student =>
      student.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  };
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    handleSearch();
  };
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">Pencarian Siswa</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        placeholder="Cari siswa berdasarkan nama"
      />
      <Button title="Cari" onPress={handleSearch} />
      <ScrollView className="mt-4">
        {filteredStudents.map((student) => (
          <View key={student.id} className="mb-2">
            <Text className="text-lg font-bold">{student.nama}</Text>
            <Text className="text-gray-600">Kelas: {student.nama_rombel}</Text>
            <Text className="text-gray-600">Jenis Kelamin: {student.jenis_kelamin}</Text>
            <Text className="text-gray-600">Tempat Lahir: {student.tempat_lahir}</Text>
            <Text className="text-gray-600">Tanggal Lahir: {student.tanggal_lahir}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

