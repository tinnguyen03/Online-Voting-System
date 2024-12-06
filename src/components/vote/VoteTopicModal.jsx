import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button, Select, message } from "antd";
import moment from "moment";
import voteService from "../../services/voteService";

const VoteTopicModal = ({
  visible,
  setVisible,
  editTopic,
  setEditTopic,
  setVoteTopics,
  onNewTopicCreated,
}) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (editTopic) {
      form.setFieldsValue({
        topicName: editTopic.title,
        description: editTopic.description,
        deadline: moment(editTopic.expiresAt, "YYYY-MM-DD"),
        options: editTopic.options?.map((option) => option.content) || [],
      });
    } else {
      form.resetFields();
    }
  }, [editTopic, form]);

  const onFinish = async (values) => {
    if (editTopic) {
      try {
        const updatedTopic = {
          title: values.topicName,
          description: values.description,
          expiresAt: values.deadline.format("YYYY-MM-DD"),
        };
        await voteService.updateVote(token, editTopic.id, updatedTopic);
        setVoteTopics((prevTopics) =>
          prevTopics.map((topic) =>
            topic.id === editTopic.id ? { ...topic, ...updatedTopic } : topic
          )
        );
        message.success("Vote topic updated successfully!");
        setEditTopic(null);
      } catch {
        message.error("Failed to update vote topic!");
      }
    } else {
      try {
        const newTopic = {
          title: values.topicName,
          description: values.description,
          expiresAt: values.deadline.format("YYYY-MM-DD"),
          createdBy: user.userId,
          options: values.options.map((option) => ({ content: option })),
        };
        const createdVote = await voteService.createVote(token, newTopic);
        setVoteTopics((prevTopics) => [...prevTopics, createdVote]);
        message.success("Vote topic created successfully!");
        onNewTopicCreated(createdVote); // Pass the newly created topic to the parent component
      } catch {
        message.error("Failed to create vote topic!");
      }
    }
    form.resetFields();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setEditTopic(null);
  };

  return (
    <Modal
      title={editTopic ? "Edit Vote Topic" : "Create Vote Topic"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Topic Name"
          name="topicName"
          rules={[{ required: true, message: "Please input the topic name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Deadline"
          name="deadline"
          rules={[
            { required: true, message: "Please select a deadline!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value.isAfter(moment())) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The deadline must be after the creation date!")
                );
              },
            }),
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        {!editTopic && (
          <Form.Item
            label="Options"
            name="options"
            rules={[
              {
                validator: async (_, value) =>
                  !value || value.length === 0
                    ? Promise.reject(new Error("Add at least one option!"))
                    : Promise.resolve(),
              },
            ]}
          >
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editTopic ? "Update Topic" : "Create Topic"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoteTopicModal;
