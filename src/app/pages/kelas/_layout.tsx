import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { useWindowDimensions } from "react-native";
import { fetchClassrooms, fetchClassroomSchedule } from "../../api";

interface Classroom {
  id: number;
  nama: string;
  ptk_id_str: string;
}

interface Schedule {
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
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
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
    const fetchClassroomsData = async () => {
      try {
        const data = await fetchClassrooms();
        if (data && Array.isArray(data)) {
          setClassrooms(data);
        } else {
          console.error("API response is not valid:", data);
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    fetchClassroomsData();
  }, []);

  const handleSearch = () => {
    const filtered = classrooms.filter((classroom) =>
      classroom.nama.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredClassrooms(filtered);
    setSearchPressed(true);
    setSchedules({}); // Clear the schedules data
    setScheduleNotFound({}); // Reset the schedule not found state
    setVisibleSchedules({}); // Reset the visible schedules state
  };

  const handleShowId = async (classroomId: number) => {
    setVisibleSchedules((prevVisible) => ({
      ...prevVisible,
      [classroomId]: !prevVisible[classroomId],
    }));

    if (!visibleSchedules[classroomId]) {
      try {
        const data = await fetchClassroomSchedule(classroomId);
        const grouped = groupByDayOfWeek(data as Schedule[]);
        setSchedules((prevSchedules) => ({
          ...prevSchedules,
          [classroomId]: grouped,
        }));
        setScheduleNotFound((prevNotFound) => ({
          ...prevNotFound,
          [classroomId]: false,
        }));
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setSchedules((prevSchedules) => ({
          ...prevSchedules,
          [classroomId]: {},
        }));
        setScheduleNotFound((prevNotFound) => ({
          ...prevNotFound,
          [classroomId]: true,
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
      return acc;
    }, {} as GroupedSchedule);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center p-4 mt-4">
        <Text className="text-lg font-bold">Pencarian jadwal kelas</Text>
        <View className="flex-row items-center mt-4 w-full">
          <TextInput
            className="border border-gray-300 rounded p-2 flex-1"
            placeholder="pencariaan berdasarkan nama kelas..."
            value={search}
            onChangeText={setSearch}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            disabled={!search.trim()}
          />
        </View>
        {searchPressed &&
          filteredClassrooms.length > 0 &&
          filteredClassrooms.map((classroom) => (
            <View
              key={classroom.id}
              className="mt-4 p-2 border-b border-gray-200 w-full card"
            >
              <Text className="text-base">{classroom.nama}</Text>
              <Text className="text-sm text-gray-500">
                Walikelas: {classroom.ptk_id_str}
              </Text>
              <Button
                title="jadwal"
                onPress={() => handleShowId(classroom.id)}
              />
              {visibleSchedules[classroom.id] &&
                schedules[classroom.id] &&
                Object.keys(schedules[classroom.id]).length > 0 && (
                  <View className="mt-4 w-full">
                    {Object.entries(schedules[classroom.id]).map(
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
                                {item.subject_name}
                              </Text>
                              <Text className="text-sm text-gray-600">
                                {item.teacher_name}
                              </Text>
                              <Text className="text-sm text-gray-600">{`${item.start_time} - ${item.end_time}`}</Text>
                            </View>
                          ))}
                        </View>
                      )
                    )}
                  </View>
                )}
              {visibleSchedules[classroom.id] &&
                scheduleNotFound[classroom.id] && (
                  <Text className="mt-4 text-red-500">Jadwal belum ada</Text>
                )}
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
