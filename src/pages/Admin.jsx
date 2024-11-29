import React, { useState } from "react";
import { Form, Input, Button, List, message } from "antd";

const Admin = () => {
  const [voteTopics, setVoteTopics] = useState([]);
  const [editTopic, setEditTopic] = useState(null); // For editing an existing topic

  const onFinish = (values) => {
    if (editTopic) {
      // Editing an existing topic
      const updatedTopics = voteTopics.map((topic) =>
        topic.id === editTopic.id ? { ...topic, name: values.topicName } : topic
      );
      setVoteTopics(updatedTopics);
      setEditTopic(null); // Reset edit mode
      message.success("Vote topic updated successfully!");
    } else {
      // Adding a new topic
      const newTopic = {
        id: Date.now(), // Unique ID for each topic
        name: values.topicName,
      };
      setVoteTopics([...voteTopics, newTopic]);
      message.success("Vote topic created successfully!");
    }
  };

  const onDelete = (id) => {
    setVoteTopics(voteTopics.filter((topic) => topic.id !== id));
    message.success("Vote topic deleted successfully!");
  };

  const onEdit = (topic) => {
    setEditTopic(topic); // Set the topic to be edited
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>Admin Panel - Manage Vote Topics</h1>

      {/* Form to create or edit a vote topic */}
      <Form
        name="createVoteTopic"
        initialValues={{ topicName: editTopic ? editTopic.name : "" }}
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

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editTopic ? "Update Topic" : "Create Topic"}
          </Button>
        </Form.Item>
      </Form>

      {/* List of existing vote topics */}
      <h2>Existing Vote Topics</h2>
      <List
        bordered
        dataSource={voteTopics}
        renderItem={(topic) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => onEdit(topic)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => onDelete(topic.id)}>
                Delete
              </Button>,
            ]}
          >
            {topic.name}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Admin;
