import { useState } from 'react';
import { Drawer, Form, Input, Segmented, Button, Space, App } from 'antd';
import { createPosition } from '../api/positions';

export default function CreatePositionDrawer({ open, onClose, onSuccess }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const closeAndReset = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const payload = {
      code: values.code,
      name: values.name,
      des: values.des,
      isActive: values.isActive,
    };

    setSubmitting(true);
    try {
      await createPosition(payload);
      message.success('Tạo vị trí công tác thành công');
      form.resetFields();
      onSuccess();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Tạo vị trí công tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Vị trí công tác"
      width={480}
      open={open}
      onClose={closeAndReset}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={closeAndReset}>Hủy</Button>
          <Button type="primary" loading={submitting} onClick={handleSubmit}>
            Lưu
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
        <Form.Item name="code" label="Mã" rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
          <Input placeholder="VD: GVBM" />
        </Form.Item>
        <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
          <Input placeholder="VD: Giáo viên bộ môn" />
        </Form.Item>
        <Form.Item name="des" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input.TextArea rows={3} placeholder="Mô tả vị trí công tác" />
        </Form.Item>
        <Form.Item name="isActive" label="Trạng thái">
          <Segmented
            options={[
              { label: 'Hoạt động', value: true },
              { label: 'Ngừng', value: false },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
