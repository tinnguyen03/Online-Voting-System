import axios from "axios";

const BASE_URL = "http://localhost:8080/api/vote";

const castVote = async (token, voteData) => {
  try {
    const response = await axios.post(`${BASE_URL}/vote`, voteData, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach Bearer token
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error; // Propagate the error for handling in the caller
  }
};

const castVoteRevoke = async (token, userId, voteId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/revoke/${userId}/${voteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach Bearer token
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error revoke casting vote:", error);
    throw error; // Propagate the error for handling in the caller
  }
};

const checkCastVote = async (token, userId, voteId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/isVoted/${userId}/${voteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach Bearer token
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking vote:", error);
    throw error; // Propagate the error for handling in the caller
  }
};

export default { castVote, castVoteRevoke, checkCastVote };
