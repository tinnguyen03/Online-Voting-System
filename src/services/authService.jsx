import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
};

const register = async (name, email, password, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/register`,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed!";
  }
};

export default {
  login,
  register,
};
