const API_URL = "https://sman1margaasih.sch.id/api";
const AUTH_TOKEN = "Sman1margaasih*";

export const fetchTeachers = async () => {
  try {
    const response = await fetch(`${API_URL}/teachers`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      mode: "no-cors",
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }
    if (!Array.isArray(data.data)) {
      throw new Error(
        "Expected data to be an array, but got " + typeof data.data
      );
    }
    return data.data;
  } catch (error) {
    //console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const fetchTeacherSchedule = async (teacherId: number) => {
  try {
    const response = await fetch(`${API_URL}/teacher/${teacherId}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }
    if (!Array.isArray(data.data)) {
      throw new Error(
        "Expected data to be an array, but got " + typeof data.data
      );
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
      throw new Error(
        "Expected data to be an array, but got " + typeof data.data
      );
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching classroom schedule:", error);
    throw error;
  }
};

export const fetchArticles = async () => {
  try {
    const response = await fetch(`https://sman1margaasih.sch.id/api/article`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`, // Ganti AUTH_TOKEN sesuai tokenmu
        Accept: "application/json", // Penting untuk Laravel API
        "User-Agent": "Mozilla/5.0 (Mobile; ReactNativeApp)",
      },
    });

    const contentType = response.headers.get("content-type");

    // Jika ternyata HTML, kemungkinan error atau redirect
    if (contentType && contentType.includes("text/html")) {
      const html = await response.text();
      console.error("Response was HTML, not JSON:", html);
      throw new Error("API returned HTML. Cek token atau endpoint.");
    }

    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error("Data bukan array: " + JSON.stringify(json));
    }

    return json;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};
// buatkan fungsi fetchStudents
export const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_URL}/students`, {
      // ganti student dengan endpoint yang benar
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`, // ganti AUTH_TOKEN dengan token yang sesuai
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
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`, // token statis
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed with status " + response.status);
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error("Token not found in response");
    }

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const updatePassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string,
  new_password_confirmation: string
) => {
  try {
    const response = await fetch(`${API_URL}/update-password/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation,
      }),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error("Update password failed with status " + response.status);
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      console.warn("Expected JSON but got:", text);
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Update password error:", error);
    throw error;
  }
};

export default {
  login,
  fetchTeachers,
  fetchTeacherSchedule,
  fetchClassrooms,
  fetchClassroomSchedule,
  fetchArticles,
  fetchStudents,
  updatePassword,
};
