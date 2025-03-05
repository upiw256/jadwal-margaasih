import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchStudents } from '../../api'; // Pastikan ini benar dan sudah di-setup

export default function Page() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data siswa dari API
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
        setFilteredStudents(data); // Menyaring data siswa awal
        setLoading(false); // Menandakan bahwa data sudah selesai diambil
      } catch (error) {
        console.error(error);
        setLoading(false); // Jika error, tetap set loading false
      }
    };
    fetchStudentsData();
  }, []);

  // Fungsi untuk memfilter siswa berdasarkan nama
  const handleSearch = () => {
    const filtered = students.filter(student =>
      student.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">Pencarian Siswa</Text>
      
      {/* Input Pencarian */}
      <TextInput
        className="border border-gray-300 p-2 mb-4"
        value={searchQuery}
        onChangeText={setSearchQuery} // Menggunakan onChangeText untuk update searchQuery
        placeholder="Cari siswa berdasarkan nama"
      />
      
      {/* Tombol Cari Menggunakan TouchableOpacity */}
      <TouchableOpacity
        onPress={handleSearch}
        className="bg-blue-500 py-2 px-4 rounded-md mb-4"
      >
        <Text className="text-white text-center font-semibold">Cari</Text>
      </TouchableOpacity>

      {/* Menampilkan indikator loading jika data masih diambil */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
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
      )}
    </View>
  );
}
