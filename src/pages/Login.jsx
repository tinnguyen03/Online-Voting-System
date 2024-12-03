import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService"; // Import authService

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Call the login function to authenticate the user
      const data = await authService.login(values.email, values.password);

      // Extract user data and token
      const user = data.userResponseDTO;
      const token = data.tokenDto.accessToken;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Display success message
      message.success("Login successful! Redirecting...");

      // Check the role and redirect accordingly
      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/vote");
      }
    } catch (error) {
      // Display error message
      message.error(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <Title>Login</Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <Link to="/register">Don't have an account yet?</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
