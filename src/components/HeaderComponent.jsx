import React, { useState } from "react";
import {
  Layout,
  Avatar,
  Button,
  Modal,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderComponent = ({ userType }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onLogout = () => {
    // Clear token from local storage
    localStorage.removeItem("token");

    // Show a logout success message (optional)
    Modal.success({
      content: "You have been logged out successfully!",
    });

    // Redirect to login page
    navigate("/login");
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
          <Title level={4}>{userType} User</Title>
          <Text type="secondary">user@example.com</Text>
        </div>
        <Space
          direction="vertical"
          style={{ marginTop: "24px", width: "100%" }}
        >
          <Row>
            <Col span={8}>
              <Text strong>Phone:</Text>
            </Col>
            <Col span={16}>
              <Text>+1234567890</Text>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Text strong>Role:</Text>
            </Col>
            <Col span={16}>
              <Text>{userType}</Text>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Text strong>Status:</Text>
            </Col>
            <Col span={16}>
              <Text>Active</Text>
            </Col>
          </Row>
          <Row align="middle">
            <Col span={8}>
              <Text strong>Password:</Text>
            </Col>
            <Col span={16}>
              <Space>
                <Text>{isPasswordVisible ? "12345678" : "********"}</Text>
                <Button
                  type="link"
                  icon={
                    isPasswordVisible ? (
                      <EyeOutlined />
                    ) : (
                      <EyeInvisibleOutlined />
                    )
                  }
                  onClick={togglePasswordVisibility}
                />
              </Space>
            </Col>
          </Row>
        </Space>
      </Modal>
    </Header>
  );
};

export default HeaderComponent;
