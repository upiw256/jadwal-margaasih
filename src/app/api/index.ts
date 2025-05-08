export const fetchTeachers = async () => {
  try {
    const response = await fetch("https://sman1margaasih.sch.id/api/teachers", {
      mode: "no-cors", // Add this line as a temporary workaround
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
};

export const fetchTeacherSchedule = async (teacherId: number) => {
  try {
    const response = await fetch(
      `https://sman1margaasih.sch.id/api/teachers/${teacherId}/schedule`,
      {
        mode: "no-cors", // Add this line as a temporary workaround
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching teacher schedule:", error);
    return [];
  }
};
