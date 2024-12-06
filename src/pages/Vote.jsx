import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  Modal,
  Radio,
  Form,
  message,
  Layout,
  Row,
  Col,
} from "antd";
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import { useNavigate } from "react-router-dom";
import voteService from "../services/voteService";
import optionService from "../services/optionService";
import userService from "../services/userService";
import userVote from "../services/userVote";
import moment from "moment";

const { Title, Link } = Typography;
const { Content } = Layout;

const Vote = () => {
  const navigate = useNavigate();
  const [voteTopics, setVoteTopics] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [options, setOptions] = useState([]);
  const [isBanned, setIsBanned] = useState(false);
  const [form] = Form.useForm();

  // Redirect the user if no token is found in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;

    if (!token) {
      message.error("You must be logged in to access this page.");
      navigate("/login"); // Redirect to login page if no token
    } else {
      // Check if the user is banned
      const checkUserStatus = async () => {
        try {
          const userData = await userService.getUsersbyId(token, userId);
          if (userData.bannedReason !== "None") {
            setIsBanned(true);
            message.error("You have been banned!", 5);
            setTimeout(() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }, 5000);
          }
        } catch (error) {
          message.error("Failed to check user status!");
        }
      };

      checkUserStatus();

      // Call the API to fetch all vote topics when the component loads
      const fetchVoteTopics = async () => {
        try {
          const response = await voteService.getVotes(token, 0, 10);
          const voteData = await Promise.all(
            response.content.map(async (vote) => {
              const isVoted = await userVote.checkCastVote(
                token,
                userId,
                vote.voteId
              );
              return {
                id: vote.voteId,
                name: vote.title,
                description: vote.description,
                status: vote.status,
                createdAt: moment(vote.createdAt).format("YYYY-MM-DD"),
                expiresAt: moment(vote.expiresAt).format("YYYY-MM-DD"),
                voted: isVoted,
              };
            })
          );
          setVoteTopics(voteData);
        } catch (error) {
          message.error("Failed to load vote topics!");
        }
      };

      fetchVoteTopics();
    }
  }, [navigate]);

  const showModal = async (topic) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;

    try {
      const response = await optionService.getAllOptions(topic.id, token);
      setOptions(response);
      setSelectedTopic(topic);

      // Check if the user has already voted and get the optionId
      const userVoteData = await userVote.findCastVote(token, userId, topic.id);
      if (userVoteData) {
        form.setFieldsValue({ vote: userVoteData.optionId });
      }

      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch options!");
    }
  };

  const handleOk = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.userId;

      const values = await form.validateFields();
      const voteData = {
        userId: userId,
        voteId: selectedTopic.id,
        optionId: values.vote,
      };

      await userVote.castVote(token, voteData);

      const updatedTopics = voteTopics.map((topic) =>
        topic.id === selectedTopic.id ? { ...topic, voted: true } : topic
      );
      setVoteTopics(updatedTopics);
      setIsModalVisible(false);
      message.success("Vote submitted successfully!");
    } catch (error) {
      message.error("Failed to submit vote!");
    }
  };

  const handleCancelVote = async (topic) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;

    try {
      await userVote.castVoteRevoke(token, userId, topic.id);

      const updatedTopics = voteTopics.map((t) =>
        t.id === topic.id ? { ...t, voted: false } : t
      );
      setVoteTopics(updatedTopics);
      message.success("Vote cancelled successfully!");
    } catch (error) {
      message.error("Failed to cancel vote!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset the form fields when the modal is closed
  };

  const columns = [
    {
      title: "Topic Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link onClick={() => showModal(record)} disabled={isBanned}>
          {text}
        </Link>
      ),
    },
    {
      title: "Vote",
      dataIndex: "voted",
      key: "voted",
      render: (voted) => (voted ? "Voted" : "Not Voted"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "active" ? "Inactive" : "Active"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) =>
        record.voted ? (
          <Button
            danger
            onClick={() => handleCancelVote(record)}
            disabled={isBanned}
          >
            Cancel Vote
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => showModal(record)}
            disabled={record.voted || isBanned}
          >
            Vote
          </Button>
        ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully!");
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <Layout>
      <HeaderComponent onLogout={handleLogout} userType="User" />
      <Content>
        <div style={{ maxWidth: "800px", margin: "50px auto" }}>
          <Title level={2}>Vote</Title>
          <Table columns={columns} dataSource={voteTopics} rowKey="id" />

          <Modal
            title="Vote"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ disabled: selectedTopic?.voted || isBanned }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="vote"
                rules={[
                  { required: true, message: "Please select an option!" },
                ]}
              >
                <Radio.Group>
                  <Row gutter={[16, 16]}>
                    {options.map((option) => (
                      <Col span={24} key={option.optionId}>
                        <Radio value={option.optionId} disabled={isBanned}>
                          {option.content} - {option.votesCount} votes
                        </Radio>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default Vote;
