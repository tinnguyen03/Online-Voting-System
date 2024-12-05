import React, { useState } from "react";
import { Table, Button, Space, Modal, message, Form, Input } from "antd";
import moment from "moment";
import voteService from "../../services/voteService";
import optionService from "../../services/optionService";

const VoteTopicTable = ({
  voteTopics,
  setVoteTopics,
  setEditTopic,
  setIsVoteModalVisible,
}) => {
  const token = localStorage.getItem("token");
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [form] = Form.useForm();

  const showOptionModal = (topic) => {
    setSelectedTopic(topic);
    setIsOptionModalVisible(true);
  };

  const handleOptionModalCancel = () => {
    setIsOptionModalVisible(false);
    form.resetFields();
  };

  const addOption = async (values) => {
    const token = localStorage.getItem("token");
    const optionData = {
      voteId: selectedTopic.id,
      content: values.content,
    };

    try {
      const response = await optionService.createOption(token, optionData);
      message.success("Option created successfully!");
      // Update the voteTopics state with the new option
      setVoteTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.id === selectedTopic.id
            ? { ...topic, options: [...(topic.options || []), response] }
            : topic
        )
      );
      setIsOptionModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error);
    }
  };

  const onDelete = async (id) => {
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
    setEditTopic(topic);
    setIsVoteModalVisible(true);
  };

  const columns = [
    {
      title: "Vote Topic Name",
      dataIndex: "title",
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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YY/MM/DD"),
    },
    {
      title: "Expires At",
      dataIndex: "expiresAt",
      key: "expiresAt",
      render: (expiresAt) => moment(expiresAt).format("YY/MM/DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Space size="small">
            <Button type="dashed" onClick={() => showOptionModal(record)}>
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

  return (
    <>
      <Table
        columns={columns}
        dataSource={voteTopics}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => <p>{record.description}</p>,
        }}
      />

      <Modal
        title="Add Option"
        open={isOptionModalVisible}
        onCancel={handleOptionModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={addOption} layout="vertical">
          <Form.Item
            label="Option Content"
            name="content"
            rules={[
              { required: true, message: "Please input the option content!" },
            ]}
          >
            <Input placeholder="Enter option content" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Option
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default VoteTopicTable;
