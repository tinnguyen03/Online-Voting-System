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
  const [form] = Form.useForm();

  // Redirect the user if no token is found in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You must be logged in to access this page.");
      navigate("/login"); // Redirect to login page if no token
    } else {
      // Call the API to fetch all vote topics when the component loads
      const fetchVoteTopics = async () => {
        try {
          const response = await voteService.getVotes(token, 0, 10);
          // Map the response to a more accessible structure
          const voteData = response.content.map((vote) => ({
            id: vote.voteId, // Make 'id' field to match table data
            name: vote.title,
            description: vote.description,
            status: vote.status,
            createdAt: moment(vote.createdAt).format("YYYY-MM-DD"),
            expiresAt: moment(vote.expiresAt).format("YYYY-MM-DD"),
            voted: null,
          }));
          setVoteTopics(voteData); // Set the fetched vote topics to the state
        } catch (error) {
          message.error("Failed to load vote topics!");
        }
      };

      fetchVoteTopics();
    }
  }, [navigate]);

  const showModal = async (topic) => {
    const token = localStorage.getItem("token");
    try {
      const response = await optionService.getAllOptions(topic.id, token);
      setOptions(response);
      setSelectedTopic(topic);
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
        topic.id === selectedTopic.id ? { ...topic, voted: values.vote } : topic
      );
      setVoteTopics(updatedTopics);
      setIsModalVisible(false);
      message.success("Vote submitted successfully!");
    } catch (error) {
      message.error("Failed to submit vote!");
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
        <Link onClick={() => showModal(record)}>{text}</Link>
      ),
    },
    {
      title: "Vote",
      dataIndex: "voted",
      key: "voted",
      render: (voted) =>
        voted === null ? "N/A" : voted ? "Voted" : "Not Voted",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "active" ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
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
          <Table
            columns={columns}
            dataSource={voteTopics}
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  <p>
                    <strong>Description:</strong> {record.description}
                  </p>
                </div>
              ),
            }}
          />

          <Modal
            title="Vote"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
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
                        <Radio value={option.optionId}>
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
