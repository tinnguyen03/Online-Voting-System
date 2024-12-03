import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  DatePicker,
  Row,
  Col,
  Space,
  Layout,
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You are not authorized. Please log in.");
      navigate("/login"); // Redirect to login if no token
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
          createdBy: "ad1d3eec-2898-436c-99e7-e2b0255d55b3", // example, replace with actual user id
          options: [{ content: "test" }], // Example options, modify as needed
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
  };

  const onDelete = (id) => {
    setVoteTopics(voteTopics.filter((topic) => topic.id !== id));
    message.success("Vote topic deleted successfully!");
  };

  const onEdit = (topic) => {
    setEditTopic(topic); // Set the topic to be edited
    form.setFieldsValue({
      topicName: topic.name,
      description: topic.description,
      deadline: moment(topic.deadline, "YYYY-MM-DD"),
    });
  };

  const columns = [
    {
      title: "Vote Topic Name",
      dataIndex: "name",
      key: "name",
      width: "23%",
    },
    {
      title: "Votes (%)",
      dataIndex: "votes",
      key: "votes",
      render: (votes) => `${votes}%`,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => moment(deadline).format("YYYY-MM-DD"),
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

  return (
    <Layout>
      <HeaderComponent onLogout={handleLogout} userType="Admin" />
      <Content>
        <div style={{ maxWidth: "700px", margin: "50px auto" }}>
          <h1>Admin Panel - Manage Vote Topics</h1>

          {/* Form to create or edit a vote topic */}
          <Form
            form={form}
            name="createVoteTopic"
            initialValues={{
              topicName: editTopic ? editTopic.name : "",
              description: editTopic ? editTopic.description : "",
              deadline: editTopic
                ? moment(editTopic.deadline, "YYYY-MM-DD")
                : null,
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

            <Row gutter={16}>
              <Col span={12}>
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
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editTopic ? "Update Topic" : "Create Topic"}
              </Button>
            </Form.Item>
          </Form>

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
