import React, { useState, useEffect } from "react";
import { Layout, Button, message } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import VoteTopicTable from "../components/vote/VoteTopicTable";
import VoteTopicModal from "../components/vote/VoteTopicModal";
import UserTableModal from "../components/vote/UserTableModal";
import voteService from "../services/voteService";
import userService from "../services/userService";

const { Content } = Layout;

const Admin = () => {
  const [voteTopics, setVoteTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isVoteModalVisible, setIsVoteModalVisible] = useState(false);
  const [editTopic, setEditTopic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You are not authorized. Please log in.");
      navigate("/login");
    } else {
      fetchVoteTopics(token);
    }
  }, [navigate]);

  const fetchVoteTopics = async (token) => {
    try {
      const response = await voteService.getVotes(token, 0, 10);
      const voteData = response.content.map((vote) => ({
        id: vote.voteId,
        title: vote.title,
        description: vote.description,
        status: vote.status,
        createdAt: moment(vote.createdAt).format("YYYY-MM-DD"),
        expiresAt: moment(vote.expiresAt).format("YYYY-MM-DD"),
      }));
      setVoteTopics(voteData);
    } catch (error) {
      message.error("Failed to load vote topics!");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await userService.getUsers(token);
      setUsers(response.content);
      setIsUserModalVisible(true);
    } catch (error) {
      message.error("Failed to load users!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Layout>
      <HeaderComponent onLogout={handleLogout} userType="Admin" />
      <Content>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h1>Admin Panel - Manage Vote Topics</h1>
          <Button type="primary" onClick={() => setIsVoteModalVisible(true)}>
            Create Topic
          </Button>
          <Button
            type="default"
            onClick={() => fetchUsers()}
            style={{ marginLeft: "10px" }}
          >
            View Users
          </Button>

          <div style={{ marginTop: "20px" }}>
            {/* Table of existing vote topics */}
            <VoteTopicTable
              voteTopics={voteTopics}
              setVoteTopics={setVoteTopics}
              setEditTopic={setEditTopic}
              setIsVoteModalVisible={setIsVoteModalVisible}
            />

            {/* Modals */}
            <VoteTopicModal
              visible={isVoteModalVisible}
              setVisible={setIsVoteModalVisible}
              editTopic={editTopic}
              setEditTopic={setEditTopic}
              setVoteTopics={setVoteTopics}
            />
            <UserTableModal
              visible={isUserModalVisible}
              setVisible={setIsUserModalVisible}
              users={users}
              setUsers={setUsers}
            />
          </div>
        </div>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default Admin;
