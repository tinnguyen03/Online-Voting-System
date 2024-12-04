import axios from "axios";

const BASE_URL = "http://localhost:8080/api/vote";

const createVote = async (token, voteData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}`,
      {
        title: voteData.title,
        description: voteData.description,
        expiresAt: voteData.expiresAt,
        createdBy: voteData.createdBy,
        options: voteData.options,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create vote!";
  }
};

const getVotes = async (token, page = 0, limit = 10) => {
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
    throw error.response?.data?.message || "Failed to fetch votes!";
  }
};

const deleteVote = async (token, voteId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${voteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete vote!";
  }
};

export default {
  createVote,
  getVotes,
  deleteVote,
};
