import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService"; // Import authService

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const data = await authService.register(
        values.name,
        values.email,
        values.password
      );
      message.success("Registration successful! Redirecting to login...");
      console.log("User registered:", data);

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      message.error(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Registration failed:", errorInfo);
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <Title>Register</Title>
      <Form
        name="register"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              validator: (_, value) =>
                value && value.includes("@gmail")
                  ? Promise.resolve()
                  : Promise.reject(new Error("Email must contain @gmail")),
            },
          ]}
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
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <Link to="/login">Already have an account? Login</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
