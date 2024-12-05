import React from "react";
import { Table, Button, Space, Modal, message } from "antd";
import moment from "moment";
import voteService from "../../services/voteService";

const VoteTopicTable = ({
  voteTopics,
  setVoteTopics,
  setEditTopic,
  setIsVoteModalVisible,
}) => {
  const token = localStorage.getItem("token");

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
      render: (createdAt) => moment(createdAt).format("YY/MM/DD"), // Format date
    },
    {
      title: "Expires At",
      dataIndex: "expiresAt",
      key: "expiresAt",
      render: (expiresAt) => moment(expiresAt).format("YY/MM/DD"), // Format date
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

  return <Table columns={columns} dataSource={voteTopics} rowKey="id" />;
};

export default VoteTopicTable;
