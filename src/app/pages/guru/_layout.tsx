import React from "react"; // Add this line
import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { useWindowDimensions } from "react-native";
import { fetchTeacherSchedule, fetchTeachers } from "../../api";

interface Teacher {
  id: number;
  nama: string;
  nip: string;
}

interface Schedule {
  teacher_id: number;
  day_of_week: string;
  class_name: string;
  teacher_name: string;
  subject_name: string;
  start_time: string;
  end_time: string;
}

interface GroupedSchedule {
  [key: string]: Schedule[];
}

const dayNames: { [key: string]: string } = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

export default function Page() {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchPressed, setSearchPressed] = useState(false);
  const [schedules, setSchedules] = useState<{
    [key: number]: GroupedSchedule;
  }>({});
  const [scheduleNotFound, setScheduleNotFound] = useState<{
    [key: number]: boolean;
  }>({});
  const [visibleSchedules, setVisibleSchedules] = useState<{
    [key: number]: boolean;
  }>({});
  const layout = useWindowDimensions();

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const data = await fetchTeachers();
        if (data && Array.isArray(data)) {
          setTeachers(data);
        } else {
          console.error("Error: API response for teachers is not valid:", data);
        }
      } catch (error) {
        console.error("Error fetching teachers data:", error);
      }
    };

    fetchTeachersData();
  }, []);

  const handleSearch = () => {
    const filtered = teachers.filter((teacher) =>
      teacher.nama?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTeachers(filtered);
    setSearchPressed(true);
    setSchedules({}); // Clear the schedules data
    setScheduleNotFound({}); // Reset the schedule not found state
    setVisibleSchedules({}); // Reset the visible schedules state
  };

  const handleShowId = async (teacherId: number) => {
    setVisibleSchedules((prevVisible) => ({
      ...prevVisible,
      [teacherId]: !prevVisible[teacherId],
    }));

    if (!visibleSchedules[teacherId]) {
      try {
        const response = await fetchTeacherSchedule(teacherId);
        const data = response; // Extract the `data` key from the response
        if (Array.isArray(data)) {
          const grouped = groupByDayOfWeek(data as Schedule[]);
          setSchedules((prevSchedules) => ({
            ...prevSchedules,
            [teacherId]: grouped,
          }));
          setScheduleNotFound((prevNotFound) => ({
            ...prevNotFound,
            [teacherId]: false,
          }));
        } else {
          console.error(
            `Error: Expected schedule data for teacher ID ${teacherId} to be an array, but got:`,
            response
          );
          setSchedules((prevSchedules) => ({
            ...prevSchedules,
            [teacherId]: {},
          }));
          setScheduleNotFound((prevNotFound) => ({
            ...prevNotFound,
            [teacherId]: true,
          }));
        }
      } catch (error) {
        console.error(
          `Error fetching schedule for teacher ID ${teacherId}:`,
          error
        );
        setSchedules((prevSchedules) => ({
          ...prevSchedules,
          [teacherId]: {},
        }));
        setScheduleNotFound((prevNotFound) => ({
          ...prevNotFound,
          [teacherId]: true,
        }));
      }
    }
  };

  const groupByDayOfWeek = (schedule: Schedule[]): GroupedSchedule => {
    return schedule.reduce((acc, item) => {
      if (!acc[item.day_of_week]) {
        acc[item.day_of_week] = [];
      }
      acc[item.day_of_week].push(item);
      acc[item.day_of_week].sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      ); // Sort by start_time
      return acc;
    }, {} as GroupedSchedule);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center p-4 mt-4">
        <Text className="text-lg font-bold">Pencarian jadwal guru</Text>
        <View className="flex-row items-center mt-4 w-full">
          <TextInput
            className="border border-gray-300 rounded p-2 flex-1"
            placeholder="pencariaan berdasarkan nama guru..."
            value={search}
            onChangeText={setSearch}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            disabled={!search.trim()}
          />
        </View>
        {!searchPressed && teachers.length === 0 && (
          <Text className="mt-4 text-gray-500">Data guru belum tersedia</Text>
        )}
        {searchPressed && filteredTeachers.length === 0 && (
          <Text className="mt-4 text-gray-500">Guru belum memiliki jadwal</Text>
        )}
        {searchPressed &&
          filteredTeachers.length > 0 &&
          filteredTeachers.map((teacher) => (
            <View
              key={teacher.id}
              className="mt-4 p-2 border-b border-gray-200 w-full card"
            >
              <Text className="text-base">{teacher.nama}</Text>
              <Text className="text-sm text-gray-500">{teacher.nip}</Text>
              <Button title="jadwal" onPress={() => handleShowId(teacher.id)} />
              {visibleSchedules[teacher.id] &&
                schedules[teacher.id] &&
                Object.keys(schedules[teacher.id]).length > 0 && (
                  <View className="mt-4 w-full">
                    {Object.entries(schedules[teacher.id]).map(
                      ([day, items]) => (
                        <View key={day} className="mb-4">
                          <Text className="font-bold text-lg mb-2">
                            {dayNames[day] || day}
                          </Text>
                          {items.map((item, index) => (
                            <View
                              key={index}
                              className="mb-2 p-2 border border-gray-300 rounded"
                            >
                              <Text className="text-base font-semibold">
                                {item.class_name}
                              </Text>
                              <Text className="text-sm text-gray-600">
                                {item.subject_name}
                              </Text>
                              <Text className="text-sm text-gray-600">{`${item.start_time} - ${item.end_time}`}</Text>
                            </View>
                          ))}
                        </View>
                      )
                    )}
                  </View>
                )}
              {visibleSchedules[teacher.id] && scheduleNotFound[teacher.id] && (
                <Text className="mt-4 text-red-400">Jadwal belum ada</Text>
              )}
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
