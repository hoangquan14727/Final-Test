import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import TeacherListPage from './pages/TeacherListPage';
import PositionListPage from './pages/PositionListPage';

const { Header, Content } = Layout;
const { Title } = Typography;

const ITEMS = [
  { key: 'teachers', label: 'Giáo viên' },
  { key: 'positions', label: 'Vị trí công tác' },
];

export default function App() {
  const [section, setSection] = useState('teachers');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={5} style={{ color: '#fff', margin: 0, marginRight: 32, whiteSpace: 'nowrap' }}>
          Quản lý giáo viên
        </Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[section]}
          items={ITEMS}
          onClick={(e) => setSection(e.key)}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          {section === 'teachers' && <TeacherListPage />}
          {section === 'positions' && <PositionListPage />}
        </div>
      </Content>
    </Layout>
  );
}
