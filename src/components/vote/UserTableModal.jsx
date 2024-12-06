import React, { useState } from "react";
import { Modal, Table, Typography, Form, Input, Button, message } from "antd";
import moment from "moment";
import userService from "../../services/userService";

const { Link } = Typography;

const UserTableModal = ({ visible, setVisible, users }) => {
  const [isBanModalVisible, setIsBanModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const showBanModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({ banReason: "" });
    setIsBanModalVisible(true);
  };

  const handleBan = async () => {
    try {
      const token = localStorage.getItem("token");
      const values = await form.validateFields();
      const banReason = { ban_reason: values.banReason };

      await userService.banUser(token, selectedUser.userId, banReason);
      message.success("User banned successfully!");
      setIsBanModalVisible(false);
    } catch (error) {
      message.error(error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link onClick={() => showBanModal(record)}>{text}</Link>
      ),
    },
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
    <>
      <Modal
        title="Users"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        <Table columns={columns} dataSource={users} rowKey="userId" />
      </Modal>

      <Modal
        title="Ban User"
        open={isBanModalVisible}
        onCancel={() => setIsBanModalVisible(false)}
        onOk={handleBan}
      >
        {selectedUser && (
          <>
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Ban Reason"
                name="banReason"
                rules={[
                  { required: true, message: "Please input the ban reason!" },
                ]}
              >
                <Input.TextArea placeholder="Enter ban reason" />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserTableModal;
