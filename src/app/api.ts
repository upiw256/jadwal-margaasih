const API_URL = "https://sman1margaasih.sch.id/api";
const AUTH_TOKEN = "Sman1margaasih*";

export const fetchTeachers = async () => {
  try {
    const response = await fetch(`${API_URL}/teachers`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }
    if (!Array.isArray(data.data)) {
      throw new Error("Expected data to be an array, but got " + typeof data.data);
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const fetchTeacherSchedule = async (teacherId: number) => {
  try {
    const response = await fetch(`${API_URL}/teachers/${teacherId}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }
    if (!Array.isArray(data.data)) {
      throw new Error("Expected data to be an array, but got " + typeof data.data);
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching teacher schedule:", error);
    throw error;
  }
};

export const fetchClassrooms = async () => {
  try {
    const response = await fetch(`${API_URL}/classroom`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }
    if (!Array.isArray(data)) {
      throw new Error("Expected data to be an array, but got " + typeof data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    throw error;
  }
};

export const fetchClassroomSchedule = async (classroomId: number) => {
  try {
    const response = await fetch(`${API_URL}/schedules/${classroomId}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }
    if (!Array.isArray(data.data)) {
      throw new Error("Expected data to be an array, but got " + typeof data.data);
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching classroom schedule:", error);
    throw error;
  }
};

export const fetchArticles = async () => {
  try {
    const response = await fetch(`${API_URL}/article`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }
    if (!Array.isArray(data)) {
      throw new Error("Expected data to be an array, but got " + typeof data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export default {
  fetchTeachers,
  fetchTeacherSchedule,
  fetchClassrooms,
  fetchClassroomSchedule,
  fetchArticles,
};
