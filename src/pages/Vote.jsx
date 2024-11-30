import React, { useState } from "react";
import { Table, Button, Typography, Modal, Radio, Form, message } from "antd";

const { Title } = Typography;

const Vote = () => {
  const [voteTopics, setVoteTopics] = useState([
    {
      id: 1,
      name: "Topic 1",
      description: "Description for Topic 1",
      status: "active",
      voted: null,
    },
    {
      id: 2,
      name: "Topic 2",
      description: "Description for Topic 2",
      status: "inactive",
      voted: null,
    },
    // Add more topics as needed
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [form] = Form.useForm();

  const showModal = (topic) => {
    setSelectedTopic(topic);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedTopics = voteTopics.map((topic) =>
        topic.id === selectedTopic.id ? { ...topic, voted: values.vote } : topic
      );
      setVoteTopics(updatedTopics);
      setIsModalVisible(false);
      message.success("Vote submitted successfully!");
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <Title level={2}>Vote</Title>
      <Table
        columns={columns}
        dataSource={voteTopics}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => <p>{record.description}</p>,
        }}
      />

      <Modal
        title="Vote"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="vote"
            rules={[{ required: true, message: "Please select an option!" }]}
          >
            <Radio.Group>
              <Radio value={true}>Vote</Radio>
              <Radio value={false}>Not Vote</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vote;
