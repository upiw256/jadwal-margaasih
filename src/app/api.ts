const API_URL = "https://sman1margaasih.sch.id/api";
const AUTH_TOKEN = "Sman1margaasih*";

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
  fetchArticles,
};
