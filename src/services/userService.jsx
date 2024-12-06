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

const getUsersbyId = async (token, userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user!";
  }
};

const updateUser = async (token, userId, userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update user!";
  }
};

const banUser = async (token, userId, bannedReason) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${userId}`, bannedReason, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to ban user!";
  }
};

export default { getUsers, getUsersbyId, updateUser, banUser };
