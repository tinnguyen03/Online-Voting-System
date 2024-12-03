import axios from "axios";

const BASE_URL = "http://localhost:8080/api/vote";

const createVote = async (token, voteData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/vote`, // Use the imported BASE_URL
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

export default {
  createVote,
};
