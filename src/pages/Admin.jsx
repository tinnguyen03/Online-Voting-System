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
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import { useNavigate } from "react-router-dom";
import voteService from "../services/voteService";
import userService from "../services/userService";

const { Content } = Layout;

const Admin = () => {
  const [voteTopics, setVoteTopics] = useState([]);
  const [editTopic, setEditTopic] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
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
            createdAt: moment(vote.createdAt).format("YYYY-MM-DD"),
            expiresAt: moment(vote.expiresAt).format("YYYY-MM-DD"),
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
    const user = JSON.parse(localStorage.getItem("user")); // Get user information from localStorage
    const userId = user.userId; // Extract the userId from the user information

    if (editTopic) {
      // Edit existing topic
      try {
        const updatedTopic = {
          title: values.topicName,
          description: values.description,
          expiresAt: values.deadline.format("YYYY-MM-DD"),
        };

        // Call updateVote API from voteService
        await voteService.updateVote(token, editTopic.id, updatedTopic);
        const updatedTopics = voteTopics.map((topic) =>
          topic.id === editTopic.id ? { ...topic, ...updatedTopic } : topic
        );
        setVoteTopics(updatedTopics);
        setEditTopic(null); // Reset edit mode
        message.success("Vote topic updated successfully!");
      } catch (error) {
        message.error("Failed to update vote topic!");
      }
    } else {
      // Create new vote topic
      try {
        const newTopic = {
          title: values.topicName,
          description: values.description,
          expiresAt: values.deadline.format("YYYY-MM-DD"),
          createdBy: userId, // Use userId as createdBy
          options: values.options.map((option) => ({ content: option })), // Map options to the required format
        };

        // Call createVote API from voteService
        const createdVote = await voteService.createVote(token, newTopic);
        setVoteTopics([...voteTopics, createdVote]); // Add new topic to the table
        message.success("Vote topic created successfully!");
      } catch (error) {
        message.error("Failed to create vote topic!");
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

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this vote topic?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => onDelete(id),
    });
  };

  const onEdit = (topic) => {
    setEditTopic(topic); // Set the topic to be edited
    form.setFieldsValue({
      topicName: topic.title,
      description: topic.description,
      deadline: moment(topic.expiresAt, "YYYY-MM-DD"),
    });
    setIsModalVisible(true); // Open the modal for editing
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await userService.getUsers(token);
      setUsers(response.content);
      setIsUserModalVisible(true); // Open the user modal
    } catch (error) {
      message.error("Failed to load users!");
    }
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
            <Button danger onClick={() => confirmDelete(record.id)}>
              Delete
            </Button>
          </Space>
        </>
      ),
    },
  ];

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

  const handleUserModalCancel = () => {
    setIsUserModalVisible(false);
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
          <Button
            type="default"
            onClick={() => fetchUsers()}
            style={{ marginLeft: "10px" }}
          >
            View Users
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
                topicName: editTopic ? editTopic.title : "",
                description: editTopic ? editTopic.description : "",
                deadline: editTopic
                  ? moment(editTopic.expiresAt, "YYYY-MM-DD")
                  : null,
                options:
                  editTopic?.options?.map((option) => option.content) || [],
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

              {!editTopic && (
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
              )}

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {editTopic ? "Update Topic" : "Create Topic"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal for displaying users */}
          <Modal
            title="Users"
            open={isUserModalVisible}
            onCancel={handleUserModalCancel}
            footer={null}
            width={800}
          >
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="userId"
              pagination={false} // Remove pagination
            />
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
