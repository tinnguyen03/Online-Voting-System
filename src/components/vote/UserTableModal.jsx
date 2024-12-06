import React from "react";
import { Modal, Table } from "antd";
import moment from "moment";

const UserTableModal = ({ visible, setVisible, users }) => {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    },
  ];

  return (
    <Modal
      title="Users"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={800}
    >
      <Table columns={columns} dataSource={users} rowKey="userId" />
    </Modal>
  );
};

export default UserTableModal;
