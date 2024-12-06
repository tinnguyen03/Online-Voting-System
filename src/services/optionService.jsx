import axios from "axios";

const BASE_URL = "http://localhost:8080/api/option";

const getAllOptions = async (voteId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/vote/${voteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching options:", error);
    throw error;
  }
};

const createOption = async (token, optionData) => {
  try {
    const response = await axios.post(`${BASE_URL}`, optionData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating option:", error);
    throw error;
  }
};

const deleteOption = async (token, optionId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${optionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting option:", error);
    throw error;
  }
};

export default { getAllOptions, createOption, deleteOption };
