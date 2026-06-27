import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Tag, Space, App } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { getPositions } from '../api/positions';
import CreatePositionDrawer from '../components/CreatePositionDrawer';

export default function PositionListPage() {
  const { message } = App.useApp();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPositions();
      setRows(res.data || []);
    } catch (e) {
      message.error(e?.response?.data?.message || 'Không tải được danh sách vị trí công tác');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { title: 'STT', key: 'stt', width: 70, render: (_, __, i) => i + 1 },
    { title: 'Mã', dataIndex: 'code', key: 'code', width: 160 },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'status',
      width: 130,
      render: (v) => (v ? <Tag color="green">Hoạt động</Tag> : <Tag>Ngừng</Tag>),
    },
    { title: 'Mô tả', dataIndex: 'des', key: 'des', ellipsis: true },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'flex-end' }}>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>
          Làm mới
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
          Tạo
        </Button>
      </Space>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
      />

      <CreatePositionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
