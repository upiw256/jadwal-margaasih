import { useState, useEffect } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useWindowDimensions } from "react-native";
import { fetchClassrooms, fetchClassroomSchedule } from "../../api";

type Classroom = {
  id: number;
  nama: string;
};

type Schedule = {
  day_of_week: string;
  subject_name: string;
  teacher_name: string;
  start_time: string;
  end_time: string;
};

type GroupedSchedule = {
  [key: string]: Schedule[];
};

export default function Page() {
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [searchPressed, setSearchPressed] = useState(false);
  const [schedules, setSchedules] = useState<{
    [key: number]: GroupedSchedule;
  }>({});
  const [scheduleNotFound, setScheduleNotFound] = useState<{
    [key: number]: boolean;
  }>({});
  const layout = useWindowDimensions();

  useEffect(() => {
    const fetchClassroomsData = async () => {
      try {
        const data = await fetchClassrooms();
        if (data && Array.isArray(data)) {
          setClassrooms(data);
        }
      } catch (error) {}
    };

    fetchClassroomsData();
  }, []);

  const handleSearch = async () => {
    if (selectedClassroom !== null) {
      setSearchPressed(true);
      setSchedules({});
      setScheduleNotFound({});

      try {
        const data = await fetchClassroomSchedule(selectedClassroom);

        if (data.success === false) {
          setScheduleNotFound((prevNotFound) => ({
            ...prevNotFound,
            [selectedClassroom]: true,
          }));
          return;
        }

        if (!Array.isArray(data)) {
          setScheduleNotFound((prevNotFound) => ({
            ...prevNotFound,
            [selectedClassroom]: true,
          }));
          return;
        }

        const grouped = groupByDayOfWeek(data as Schedule[]);
        setSchedules((prevSchedules) => ({
          ...prevSchedules,
          [selectedClassroom]: grouped,
        }));
        setScheduleNotFound((prevNotFound) => ({
          ...prevNotFound,
          [selectedClassroom]: false,
        }));
      } catch (error) {
        setSchedules((prevSchedules) => ({
          ...prevSchedules,
          [selectedClassroom]: {},
        }));
        setScheduleNotFound((prevNotFound) => ({
          ...prevNotFound,
          [selectedClassroom]: true,
        }));
      }
    }
  };

  const dayNames: { [key: number]: string } = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    7: "Minggu",
  };

  const dayMapping: { [key: string]: number } = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
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
          <Picker
            selectedValue={selectedClassroom}
            onValueChange={(itemValue) => setSelectedClassroom(itemValue)}
            style={{ flex: 1, borderWidth: 1, borderColor: "gray", borderRadius: 4 }}
          >
            <Picker.Item label="Pilih kelas..." value={null} />
            {classrooms.map((classroom) => (
              <Picker.Item
                key={classroom.id}
                label={classroom.nama}
                value={classroom.id}
              />
            ))}
          </Picker>
          <Button
            title="Search"
            onPress={handleSearch}
            disabled={selectedClassroom === null}
          />
        </View>
        {searchPressed && selectedClassroom !== null && schedules[selectedClassroom] && (
          <View
            key={selectedClassroom}
            className="mt-4 p-2 border-b border-gray-200 w-full card"
          >
            {Object.keys(schedules[selectedClassroom]).length > 0 ? (
              <View className="mt-4 w-full">
                {Object.entries(schedules[selectedClassroom])
                  .sort(([dayA], [dayB]) => {
                    const dayNumberA = dayMapping[dayA.toLowerCase()] || 0;
                    const dayNumberB = dayMapping[dayB.toLowerCase()] || 0;
                    return dayNumberA - dayNumberB;
                  })
                  .map(([day, items]) => {
                    const dayNumber = dayMapping[day.toLowerCase()] || 0;
                    return (
                      <View key={day} className="mb-4">
                        <Text className="font-bold text-lg mb-2">
                          {dayNames[dayNumber] || `Unknown Day (${day})`}
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
                    );
                  })}
              </View>
            ) : (
              <Text className="mt-4 text-red-500">Jadwal belum ada</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
