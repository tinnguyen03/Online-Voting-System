import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Form,
  Input,
  Typography,
  Row,
  Col,
  Progress,
} from "antd";
import moment from "moment";
import voteService from "../../services/voteService";
import optionService from "../../services/optionService";

const { Link } = Typography;

const VoteTopicTable = ({
  voteTopics,
  setVoteTopics,
  setEditTopic,
  setIsVoteModalVisible,
}) => {
  const token = localStorage.getItem("token");
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const [isTopicModalVisible, setIsTopicModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [options, setOptions] = useState([]);
  const [form] = Form.useForm();

  const showOptionModal = (topic) => {
    setSelectedTopic(topic);
    setIsOptionModalVisible(true);
  };

  const showTopicModal = async (topic) => {
    try {
      const response = await optionService.getAllOptions(topic.id, token);
      setOptions(response);
      setSelectedTopic(topic);
      setIsTopicModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch options!");
    }
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

  const deleteOption = async (optionId) => {
    try {
      await optionService.deleteOption(token, optionId);
      setOptions(options.filter((option) => option.optionId !== optionId));
      message.success("Option deleted successfully!");
    } catch (error) {
      message.error("Failed to delete option!");
    }
  };

  const confirmDeleteOption = (optionId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this option?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => deleteOption(optionId),
    });
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

  const handleTopicModalCancel = () => {
    setIsTopicModalVisible(false);
  };

  const columns = [
    {
      title: "Topic Name",
      dataIndex: "title",
      key: "title",
      width: "16%",
      render: (text, record) => (
        <Link onClick={() => showTopicModal(record)}>{text}</Link>
      ),
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
          <Row justify="space-evenly">
            <Col>
              <Button type="dashed" onClick={() => showOptionModal(record)}>
                Add Options
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={() => onEdit(record)}>
                Edit
              </Button>
            </Col>
            <Col>
              <Button danger onClick={() => confirmDelete(record.id)}>
                Delete
              </Button>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={voteTopics} rowKey="id" />

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

      <Modal
        title={selectedTopic?.title}
        open={isTopicModalVisible}
        onCancel={handleTopicModalCancel}
        footer={null}
      >
        <p>
          <strong>Description:</strong> {selectedTopic?.description}
        </p>
        <p>
          <strong>Options:</strong>
        </p>
        <ul>
          {options.map((option) => (
            <li key={option.optionId}>
              <Row align="middle" gutter={[16, 16]} style={{ marginBottom: 8 }}>
                <Col span={8}>
                  {option.content} - {option.votesCount} votes
                </Col>
                <Col span={12}>
                  <Progress
                    percent={
                      options.reduce((acc, opt) => acc + opt.votesCount, 0) ===
                      0
                        ? 0
                        : (
                            (option.votesCount /
                              options.reduce(
                                (acc, opt) => acc + opt.votesCount,
                                0
                              )) *
                            100
                          ).toFixed(2)
                    }
                  />
                </Col>
                <Col span={4}>
                  <Button
                    danger
                    onClick={() => confirmDeleteOption(option.optionId)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default VoteTopicTable;
