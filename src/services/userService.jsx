import axios from "axios";

const BASE_URL = "http://localhost:8080/api/user";

const getUsers = async (token, page = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch users!";
  }
};

export default { getUsers };
