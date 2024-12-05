import React, { useState, useEffect } from "react";
import {
  Layout,
  Avatar,
  Button,
  Modal,
  Typography,
  Space,
  Row,
  Col,
  Form,
  Input,
  message,
} from "antd";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService"; // Import userService

const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderComponent = ({ userType }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showModal = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;

    try {
      const userData = await userService.getUsersbyId(token, userId);
      setUserInfo(userData);
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        password: "",
      });
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch user information!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Modal.success({
      content: "You have been logged out successfully!",
    });
    navigate("/login");
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onFinish = async (values) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;

    try {
      const updatedUser = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const updatedUserData = await userService.updateUser(
        token,
        userId,
        updatedUser
      );
      setUserInfo(updatedUserData);
      message.success("User information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update user information!");
    }
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ marginRight: "16px" }}>Hello, {userType}</Text>
        <Avatar
          size="large"
          icon={<UserOutlined />}
          style={{ cursor: "pointer", marginRight: "16px" }}
          onClick={showModal}
        />
        <Button type="primary" onClick={onLogout}>
          Logout
        </Button>
      </div>
      <Modal
        title="User Information"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        styles={{ padding: "24px 24px" }}
      >
        <div style={{ textAlign: "center" }}>
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#f56a00",
              marginBottom: "16px",
            }}
          />
          <Title level={4}>{userInfo.name}</Title>
          <Text type="secondary">{userInfo.email}</Text>
        </div>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Space
            direction="vertical"
            style={{ marginTop: "24px", width: "100%" }}
          >
            <Row>
              <Col span={8}>
                <Text strong>Role:</Text>
              </Col>
              <Col span={16}>
                <Text>{userInfo.role}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Status:</Text>
              </Col>
              <Col span={16}>
                <Text>{userInfo.status}</Text>
              </Col>
            </Row>
            {userInfo.status === "Banned" && (
              <Row>
                <Col span={8}>
                  <Text strong>Banned Reason:</Text>
                </Col>
                <Col span={16}>
                  <Text>{userInfo.bannedReason}</Text>
                </Col>
              </Row>
            )}
            <Row>
              <Col span={8}>
                <Text strong>Created At:</Text>
              </Col>
              <Col span={16}>
                <Text>
                  {moment(userInfo.createdAt).format("YYYY-MM-DD HH:mm")}
                </Text>
              </Col>
            </Row>
            {isEditing ? (
              <>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Button type="primary" htmlType="submit" block>
                        Save
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button type="default" onClick={handleCancel} block>
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </>
            ) : (
              <Button type="primary" onClick={onEdit} block>
                Edit
              </Button>
            )}
          </Space>
        </Form>
      </Modal>
    </Header>
  );
};

export default HeaderComponent;
