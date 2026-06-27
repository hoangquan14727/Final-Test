import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Tag, Avatar, Space, Typography, App } from 'antd';
import { ReloadOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { getTeachers } from '../api/teachers';
import { DEGREE_RANK } from '../constants/options';
import CreateTeacherDrawer from '../components/CreateTeacherDrawer';

const { Text } = Typography;

function highestDegree(degrees = []) {
  if (!degrees.length) return null;
  return [...degrees].sort(
    (a, b) =>
      (DEGREE_RANK[b.type] || 0) - (DEGREE_RANK[a.type] || 0) ||
      (b.year || 0) - (a.year || 0)
  )[0];
}

export default function TeacherListPage() {
  const { message } = App.useApp();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTeachers(page, limit);
      setRows(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      message.error(e?.response?.data?.message || 'Không tải được danh sách giáo viên');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { title: 'Mã', dataIndex: 'code', key: 'code', width: 120 },
    {
      title: 'Giáo viên',
      key: 'teacher',
      render: (_, r) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong>{r.name || '—'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email || '—'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.phoneNumber || '—'}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Trình độ (cao nhất)',
      key: 'degree',
      render: (_, r) => {
        const d = highestDegree(r.degrees);
        if (!d) return '—';
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text>Bậc: {d.type || '—'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Chuyên ngành: {d.major || '—'}
            </Text>
          </div>
        );
      },
    },
    { title: 'Bộ môn', key: 'subject', width: 90, render: () => <Text type="secondary">N/A</Text> },
    {
      title: 'TT Công tác',
      key: 'positions',
      render: (_, r) =>
        r.positions?.length ? r.positions.map((p) => p.name).join(', ') : '—',
    },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'status',
      width: 130,
      render: (v) =>
        v ? <Tag color="green">Đang công tác</Tag> : <Tag>Ngừng công tác</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 110,
      render: () => (
        <Button type="link" disabled>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Input.Search placeholder="Tìm kiếm thông tin" style={{ width: 280 }} disabled />
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Tải lại
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
            Tạo mới
          </Button>
        </Space>
      </Space>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (t) => `Tổng: ${t}`,
        }}
        onChange={(pg) => {
          if (pg.pageSize !== limit) {
            setLimit(pg.pageSize);
            setPage(1);
          } else {
            setPage(pg.current);
          }
        }}
      />

      <CreateTeacherDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          if (page === 1) fetchData();
          else setPage(1);
        }}
      />
    </div>
  );
}
