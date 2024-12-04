import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  DatePicker,
  Select,
  Space,
  Layout,
  Modal,
} from "antd";
import moment from "moment";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useNavigate } from "react-router-dom";
import voteService from "../services/voteService"; // Import voteService

const { Content } = Layout;

const Admin = () => {
  const [voteTopics, setVoteTopics] = useState([]);
  const [editTopic, setEditTopic] = useState(null);
  const [form] = Form.useForm(); // Create a form instance
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You are not authorized. Please log in.");
      navigate("/login"); // Redirect to login if no token
    } else {
      // Call the API to fetch all vote topics when the component loads
      const fetchVoteTopics = async () => {
        try {
          const response = await voteService.getVotes(token, 0, 10);
          // Map the response to a more accessible structure
          const voteData = response.content.map((vote) => ({
            id: vote.voteId, // Make 'id' field to match table data
            title: vote.title,
            description: vote.description,
            status: vote.status,
            createdAt: moment(vote.createdAt).format("YYYY-MM-DD HH:mm"), // Format createdAt
            expiresAt: moment(vote.expiresAt).format("YYYY-MM-DD HH:mm"), // Format expiresAt
          }));
          setVoteTopics(voteData); // Set the fetched vote topics to the state
        } catch (error) {
          message.error("Failed to load vote topics!");
        }
      };

      fetchVoteTopics();
    }
  }, [navigate]);

  const onFinish = async (values) => {
    const token = localStorage.getItem("token");

    if (editTopic) {
      // Edit existing topic
      const updatedTopics = voteTopics.map((topic) =>
        topic.id === editTopic.id
          ? {
              ...topic,
              name: values.topicName,
              description: values.description,
              deadline: values.deadline.format("YYYY-MM-DD"),
            }
          : topic
      );
      setVoteTopics(updatedTopics);
      setEditTopic(null); // Reset edit mode
      message.success("Vote topic updated successfully!");
    } else {
      // Create new vote topic
      try {
        const newTopic = {
          title: values.topicName,
          description: values.description,
          expiresAt: values.deadline.format("YYYY-MM-DD"),
          createdBy: token, // Use token as createdBy
          options: values.options.map((option) => ({ content: option })), // Map options to the required format
        };

        // Call createVote API from voteService
        const createdVote = await voteService.createVote(token, newTopic);
        setVoteTopics([...voteTopics, createdVote]); // Add new topic to the table
        message.success("Vote topic created successfully!");
      } catch (error) {
        message.error(error);
      }
    }
    form.resetFields(); // Reset the form fields
    setIsModalVisible(false); // Close the modal
  };

  const onDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await voteService.deleteVote(token, id);
      setVoteTopics(voteTopics.filter((topic) => topic.id !== id));
      message.success("Vote topic deleted successfully!");
    } catch (error) {
      message.error("Failed to delete vote topic!");
    }
  };

  const onEdit = (topic) => {
    setEditTopic(topic); // Set the topic to be edited
    form.setFieldsValue({
      topicName: topic.name,
      description: topic.description,
      deadline: moment(topic.deadline, "YYYY-MM-DD"),
      options: topic.options.map((option) => option.content), // Set options for editing
    });
    setIsModalVisible(true); // Open the modal for editing
  };

  const columns = [
    {
      title: "Vote Topic Name",
      dataIndex: "title", // Use title directly
      key: "title",
      width: "19%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created At",
      dataIndex: "createdAt", // Use createdAt field
      key: "createdAt",
    },
    {
      title: "Expires At",
      dataIndex: "expiresAt", // Use expiresAt field
      key: "expiresAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Space size="small">
            <Button type="dashed" onClick={() => onEdit(record)}>
              Add Options
            </Button>
            <Button type="primary" onClick={() => onEdit(record)}>
              Edit
            </Button>
            <Button danger onClick={() => onDelete(record.id)}>
              Delete
            </Button>
          </Space>
        </>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully!");
    navigate("/login"); // Redirect to login after logout
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset the form fields when modal is closed
  };

  return (
    <Layout>
      <HeaderComponent onLogout={handleLogout} userType="Admin" />
      <Content>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h1>Admin Panel - Manage Vote Topics</h1>

          {/* Button to open the modal */}
          <Button type="primary" onClick={showModal}>
            Create Topic
          </Button>

          {/* Modal for creating or editing a vote topic */}
          <Modal
            title={editTopic ? "Edit Vote Topic" : "Create Vote Topic"}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              name="createVoteTopic"
              initialValues={{
                topicName: editTopic ? editTopic.name : "",
                description: editTopic ? editTopic.description : "",
                deadline: editTopic
                  ? moment(editTopic.deadline, "YYYY-MM-DD")
                  : null,
                options: editTopic
                  ? editTopic.options.map((option) => option.content)
                  : [],
              }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                label="Vote Topic Name"
                name="topicName"
                rules={[
                  {
                    required: true,
                    message: "Please input the vote topic name!",
                  },
                ]}
              >
                <Input placeholder="Enter vote topic name" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input the description!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>

              <Form.Item
                label="Deadline"
                name="deadline"
                rules={[
                  { required: true, message: "Please select a deadline!" },
                ]}
              >
                <DatePicker
                  placeholder="Select deadline"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Options"
                name="options"
                rules={[
                  {
                    validator: async (_, value) => {
                      if (!value || value.length === 0) {
                        throw new Error("Please add at least one option!");
                      }
                    },
                  },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="Type an option and press space"
                  style={{ width: "100%" }}
                  tokenSeparators={[" "]}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {editTopic ? "Update Topic" : "Create Topic"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Table of existing vote topics */}
          <h2>Existing Vote Topics</h2>
          <Table
            columns={columns}
            dataSource={voteTopics}
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => <p>{record.description}</p>,
            }}
          />
        </div>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default Admin;
