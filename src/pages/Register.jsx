import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { Link } from "react-router-dom"; // Import Link component

const { Title } = Typography;

const Register = () => {
  const onFinish = (values) => {
    console.log("Form submitted successfully:", values);
    // Add logic for submitting the form to your backend
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form submission failed:", errorInfo);
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <Title>Register</Title>
      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>

        {/* Already have an account link */}
        <Form.Item>
          <Link to="/login">Already have an account?</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
