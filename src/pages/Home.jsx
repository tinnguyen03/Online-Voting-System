import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <Title level={1}>Welcome to the Online Voting System</Title>
      <Paragraph style={{ fontSize: "18px" }}>
        Please choose an action below to proceed.
      </Paragraph>

      <Row justify="center" gutter={[16, 16]}>
        <Col>
          <Button type="primary" size="large">
            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </Button>
        </Col>
        <Col>
          <Button type="default" size="large">
            <Link to="/vote" style={{ color: "black" }}>
              Vote
            </Link>
          </Button>
        </Col>
        <Col>
          <Button type="dashed" size="large">
            <Link to="/login" style={{ color: "black" }}>
              Login
            </Link>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
