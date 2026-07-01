import { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Space,
  Divider,
  Switch,
  Row,
  Col,
  Avatar,
  Upload,
  App,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { createTeacher } from '../api/teachers';
import { getPositions } from '../api/positions';
import { DEGREE_TYPE_OPTIONS } from '../constants/options';

export default function CreateTeacherDrawer({ open, onClose, onSuccess }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    getPositions()
      .then((res) => {
        const list = res.data || [];
        setPositions(list.map((p) => ({ label: p.name, value: p._id })));
      })
      .catch(() => message.error('Không tải được danh sách vị trí công tác'));
  }, [open]);

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
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      identity: values.identity,
      dob: values.dob ? values.dob.toISOString() : undefined,
      teacherPositionsId: values.teacherPositionsId || [],
      degrees: (values.degrees || [])
        .filter((d) => d && (d.type || d.school || d.major || d.year != null))
        .map((d) => ({
          type: d.type,
          school: d.school,
          major: d.major,
          year: d.year != null ? Number(d.year) : undefined,
          isGraduated: !!d.isGraduated,
        })),
    };

    setSubmitting(true);
    try {
      await createTeacher(payload);
      message.success('Tạo giáo viên thành công');
      form.resetFields();
      onSuccess();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Tạo giáo viên thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Tạo thông tin giáo viên"
      width={760}
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
      <Form form={form} layout="vertical" initialValues={{ degrees: [] }}>
        <Space style={{ marginBottom: 16 }} align="center">
          <Avatar size={64} icon={<UserOutlined />} />
          <Upload disabled showUploadList={false}>
            <Button icon={<UploadOutlined />} disabled>
              Chọn ảnh (chưa hỗ trợ)
            </Button>
          </Upload>
        </Space>

        <Divider orientation="left">Thông tin cá nhân</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="VD: Nguyễn Văn A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dob"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="example@school.edu.vn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="identity"
              label="Số CCCD"
              rules={[{ required: true, message: 'Vui lòng nhập số CCCD' }]}
            >
              <Input placeholder="Nhập số CCCD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input placeholder="Địa chỉ thường trú" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Thông tin công tác</Divider>
        <Form.Item
          name="teacherPositionsId"
          label="Vị trí công tác"
          rules={[{ required: true, message: 'Vui lòng chọn vị trí công tác' }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn các vị trí công tác"
            options={positions}
            optionFilterProp="label"
          />
        </Form.Item>

        <Divider orientation="left">Học vị</Divider>
        <Form.List name="degrees">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <Row gutter={8} key={key} align="middle">
                  <Col span={5}>
                    <Form.Item {...rest} name={[name, 'type']} label={name === 0 ? 'Bậc' : ''}>
                      <Select placeholder="Bậc" options={DEGREE_TYPE_OPTIONS} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item {...rest} name={[name, 'school']} label={name === 0 ? 'Trường' : ''}>
                      <Input placeholder="Trường" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item {...rest} name={[name, 'major']} label={name === 0 ? 'Chuyên ngành' : ''}>
                      <Input placeholder="Chuyên ngành" />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item
                      {...rest}
                      name={[name, 'year']}
                      label={name === 0 ? 'Năm' : ''}
                      rules={[
                        {
                          type: 'number',
                          min: 1950,
                          max: new Date().getFullYear(),
                          message: 'Năm không hợp lệ',
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={1950}
                        max={new Date().getFullYear()}
                        controls={false}
                        placeholder="Năm"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item
                      {...rest}
                      name={[name, 'isGraduated']}
                      valuePropName="checked"
                      label={name === 0 ? 'Tốt nghiệp' : ''}
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={1} style={{ paddingTop: name === 0 ? 30 : 4 }}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => add({ isGraduated: false })}
              >
                Thêm
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
}
