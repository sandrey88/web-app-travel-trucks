import axios from "axios";

axios.defaults.baseURL = "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io/";

export const getCampers = async (params = {}) => {
  try {
    const response = await axios.get("/campers", {
      params: {
        page: params.page || 1,
        limit: params.limit || 8,
        ...params.filters,
      },
    });

    // The API returns { total: number, items: array }
    return {
      items: response.data.items || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getCamperById = async (id) => {
  try {
    const response = await axios.get(`/campers/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
