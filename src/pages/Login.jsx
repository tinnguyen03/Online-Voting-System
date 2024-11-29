import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom"; // Import Link component

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const adminUsername = "admin";
    const adminPassword = "admin";
    const voterUsername = "voter";
    const voterPassword = "voter";

    if (
      values.username === adminUsername &&
      values.password === adminPassword
    ) {
      message.success("Admin Login successful! Redirecting to Admin page...");
      navigate("/admin"); // Redirect to admin page
    } else if (
      values.username === voterUsername &&
      values.password === voterPassword
    ) {
      message.success("Voter Login successful! Redirecting to Vote page...");
      navigate("/vote"); // Redirect to voter voting page
    } else {
      console.log("Login failed:", values);
      message.error("Invalid username or password!");
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
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter your username" />
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

        {/* Don't have an account yet link */}
        <Form.Item>
          <Link to="/register">Don't have an account yet?</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
