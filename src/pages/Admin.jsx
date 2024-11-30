import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  Select,
  Row,
  Col,
  Space,
} from "antd";

const { Option } = Select;

const Admin = () => {
  const [voteTopics, setVoteTopics] = useState([]);
  const [editTopic, setEditTopic] = useState(null); // For editing an existing topic
  const [form] = Form.useForm(); // Create a form instance

  const onFinish = (values) => {
    if (editTopic) {
      // Editing an existing topic
      const updatedTopics = voteTopics.map((topic) =>
        topic.id === editTopic.id
          ? {
              ...topic,
              name: values.topicName,
              description: values.description,
              status: values.status,
            }
          : topic
      );
      setVoteTopics(updatedTopics);
      setEditTopic(null); // Reset edit mode
      message.success("Vote topic updated successfully!");
    } else {
      // Adding a new topic
      const newTopic = {
        id: Date.now(), // Unique ID for each topic
        name: values.topicName,
        description: values.description,
        status: values.status,
        votes: 0, // Initial votes
      };
      setVoteTopics([...voteTopics, newTopic]);
      message.success("Vote topic created successfully!");
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
      status: topic.status,
    });
  };

  const columns = [
    {
      title: "Vote Topic Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "Votes (%)",
      dataIndex: "votes",
      key: "votes",
      render: (votes) => `${votes}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h1>Admin Panel - Manage Vote Topics</h1>

      {/* Form to create or edit a vote topic */}
      <Form
        form={form}
        name="createVoteTopic"
        initialValues={{
          topicName: editTopic ? editTopic.name : "",
          description: editTopic ? editTopic.description : "",
          status: editTopic ? editTopic.status : "active",
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Vote Topic Name"
          name="topicName"
          rules={[
            { required: true, message: "Please input the vote topic name!" },
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
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea placeholder="Enter description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select the status!" }]}
            >
              <Select placeholder="Select status" style={{ height: "54px" }}>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
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
  );
};

export default Admin;
