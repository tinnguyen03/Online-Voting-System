import React, { useState } from "react";
import { Form, Radio, Button, Typography } from "antd";

const { Title } = Typography;

const Vote = () => {
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const onFinish = (values) => {
    console.log("Selected Candidate:", values.candidate);
    // Handle vote submission logic, such as calling an API to submit the vote
  };

  const onChange = (e) => {
    setSelectedCandidate(e.target.value);
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <Title level={2}>Vote</Title>
      <p>Select your candidate:</p>

      <Form
        name="vote"
        layout="vertical"
        initialValues={{ candidate: selectedCandidate }}
        onFinish={onFinish}
      >
        {/* Candidate Selection */}
        <Form.Item
          name="candidate"
          rules={[{ required: true, message: "Please select a candidate!" }]}
        >
          <Radio.Group onChange={onChange} value={selectedCandidate}>
            <Radio value="Candidate A">Candidate A</Radio>
            <Radio value="Candidate B">Candidate B</Radio>
            {/* You can add more candidates here */}
          </Radio.Group>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Vote
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Vote;
