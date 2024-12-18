import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    const { userResponseDTO, tokenDto } = response.data;

    // Save token and user information in localStorage
    localStorage.setItem("token", tokenDto.accessToken);
    localStorage.setItem("user", JSON.stringify(userResponseDTO));

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
};

const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed!";
  }
};

export default {
  login,
  register,
};
