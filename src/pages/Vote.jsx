import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  Modal,
  Radio,
  Form,
  Input,
  message,
  Layout,
} from "antd";
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import { useNavigate } from "react-router-dom";
import voteService from "../services/voteService"; // Import voteService
import moment from "moment";

const { Title } = Typography;
const { Content } = Layout;

const Vote = () => {
  const navigate = useNavigate();
  const [voteTopics, setVoteTopics] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
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
            createdAt: moment(vote.createdAt).format("YYYY-MM-DD HH:mm"), // Format createdAt
            expiresAt: moment(vote.expiresAt).format("YYYY-MM-DD HH:mm"), // Format expiresAt
            voted: null,
            comment: "",
          }));
          setVoteTopics(voteData); // Set the fetched vote topics to the state
        } catch (error) {
          message.error("Failed to load vote topics!");
        }
      };

      fetchVoteTopics();
    }
  }, [navigate]);

  const showModal = (topic) => {
    setSelectedTopic(topic);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedTopics = voteTopics.map((topic) =>
        topic.id === selectedTopic.id
          ? { ...topic, voted: values.vote, comment: values.comment }
          : topic
      );
      setVoteTopics(updatedTopics);
      setIsModalVisible(false);
      message.success("Vote submitted successfully!");
    });
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
                  <p>
                    <strong>Comment:</strong> {record.comment}
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
                  <Radio value={true}>Vote</Radio>
                  <Radio value={false}>Not Vote</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="comment"
                label="Comment"
                rules={[
                  { required: true, message: "Please input your comment!" },
                ]}
              >
                <Input.TextArea placeholder="Enter your comment" />
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
