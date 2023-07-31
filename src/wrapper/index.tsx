import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  StarOutlined,
  ApartmentOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  ProfileOutlined,
  AlignCenterOutlined,
  SnippetsOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Layout,
  Menu,
  Avatar,
  Button
} from 'antd';
import { createElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import { logout } from './request';
import { me } from '../components/login/request';

interface Me {
  username: string,
  roles: string[]
}

const { Header, Sider, Content } = Layout;
const Wrapper = ({ children }: any) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [activeMenu, setAciveMenu] = useState(['']);
  const [fetchedMe, setFetchedMe] = useState<Me>({
    username: '',
    roles: []
  });
  const [tempMe, setTempMe] = useState({
    username: ''
  });

  const chooseActiveMenu = () => {
    if (window.location.pathname.includes('/project/pill')) {
      return setAciveMenu(['pill']);
    } else if (window.location.pathname.includes('/project/pharmacy')) {
      return setAciveMenu(['pharmacy']);
    } else if (window.location.pathname.includes('/project/plan')) {
      return setAciveMenu(['plan']);
    } else if (window.location.pathname.includes('/project')) {
      return setAciveMenu(['project']);
    } else if (window.location.pathname.includes('/position')) {
      return setAciveMenu(['position']);
    }
  }

  const getMe = async () => {
    const whoIsme = await me();
    // @ts-ignore
    setTempMe(whoIsme);
  }

  useEffect(() => {
    chooseActiveMenu();
    getMe();
  }, []);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        
        style={{
          height: '100vh',
          overflowY: 'scroll',
          minWidth: 'fit-content',
          width: 'fit-content'
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={activeMenu}
          defaultOpenKeys={['project']}
          selectedKeys={activeMenu}
          onSelect={({ keyPath }): any => setAciveMenu(keyPath)}
        >
          <Menu.Item
            key="position"
            icon={<SnippetsOutlined />}
            onClick={() => navigate('/position?page=1&page_size=100')}
          >
            Мои позиции
          </Menu.Item>
          <Menu.SubMenu
            key="project"
            icon={<AlignCenterOutlined />}
            // onClick={() => navigate('/project?page=1&page_size=20')}
            title="Мои проекты"
          >
            <Menu.Item
              key="pharmacy"
              icon={<SnippetsOutlined />}
              onClick={() => navigate('/project/pharmacy?page=1&page_size=20')}
            >
              Мои Аптеки
            </Menu.Item>
            <Menu.Item
              key="pill"
              icon={<SnippetsOutlined />}
              onClick={() => navigate('/project/pill?page=1&page_size=20')}
            >
              Мои Лекарства
            </Menu.Item>
            <Menu.Item
              key="plan"
              icon={<LineChartOutlined />}
              onClick={() => navigate('/project/plan?page=1&page_size=20&order_by=id')}
            >
              Мой план
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div className="header-wrapper">
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            {/* {isSuccess ? displayUsername() : ''} */}
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{fetchedMe.username}</span>
            <div className="log-wrapper">
              <Avatar size={40} className="avatar">{tempMe.username}</Avatar>
              {/* <Avatar className="avatar" icon={<UserOutlined />} /> */}
              {/* <span>asd</span> */}
              <Button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                type="link"
              >
                Log out
              </Button>
            </div>

          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          <div>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout >
  );
};

export default Wrapper;