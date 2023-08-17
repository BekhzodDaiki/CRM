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
} from "@ant-design/icons";
import { Layout, Menu, Avatar, Button } from "antd";
import { createElement, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { logout } from "./request";
import { me } from "../components/login/request";
import { useAppSelector } from "../hooks";

interface Me {
  username: string;
  roles: string[];
}

const { Header, Sider, Content } = Layout;

const Wrapper = ({ children }: any) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [activeMenu, setAciveMenu] = useState([""]);
  const me = useAppSelector((state) => state.user);

  const [fetchedMe, setFetchedMe] = useState<Me>({
    username: "",
    roles: [],
  });
  const [tempMe, setTempMe] = useState({
    username: "",
    user: {
      is_manager: false,
      is_company: false,
    },
  });

  useEffect(() => {
    setTempMe(me);
  }, [me]);

  const chooseActiveMenu = () => {
    if (window.location.pathname.includes("/project/pill")) {
      return setAciveMenu(["pill"]);
    } else if (window.location.pathname.includes("/project/pharmacy")) {
      return setAciveMenu(["pharmacy"]);
    } else if (window.location.pathname.includes("/project/plan")) {
      return setAciveMenu(["plan"]);
    } else if (window.location.pathname.includes("/project")) {
      return setAciveMenu(["project"]);
    } else if (window.location.pathname.includes("/position")) {
      return setAciveMenu(["position"]);
    } else if (window.location.pathname.includes("/company/user")) {
      return setAciveMenu(["comUsers"]);
    } else if (window.location.pathname.includes("/company/setting")) {
      return setAciveMenu(["comSetting"]);
    } else if (window.location.pathname.includes("/admin-pharmacy/user")) {
      return setAciveMenu(["pharUsers"]);
    } else if (window.location.pathname.includes("/admin-pharmacy/setting")) {
      return setAciveMenu(["pharSetting"]);
    } else if (window.location.pathname.includes("/pharmacy-ceo/user")) {
      return setAciveMenu(["pharmacyCeoUsers"]);
    } else if (
      window.location.pathname.includes("/pharmacy-ceo/coeficient-drug")
    ) {
      return setAciveMenu(["pharmacyCeoSetting"]);
    }
  };

  // const getMe = async () => {
  //   const whoIsme = await me();
  //   // @ts-ignore
  //   setTempMe(whoIsme);
  // };

  useEffect(() => {
    chooseActiveMenu();
    // getMe();
  }, []);

  const displayMenu = () => {
    if (tempMe.user.is_manager || localStorage.getItem("user") === "admin") {
      return (
        <>
          <Menu.SubMenu
            key="company"
            icon={<ApartmentOutlined />}
            // onClick={() => navigate("/company?page=1&page_size=100")}
            title="Компании"
          >
            <Menu.Item
              key="comUsers"
              icon={<SnippetsOutlined />}
              onClick={() => navigate("/company/user?page=1&page_size=20")}
            >
              Пользователи
            </Menu.Item>
            <Menu.Item
              key="comSetting"
              icon={<SnippetsOutlined />}
              onClick={() => navigate("/company/setting?page=1&page_size=20")}
            >
               Категория аптек
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="admin-pharmacy"
            icon={<ProfileOutlined />}
            // onClick={() => navigate("/admin-pharmacy?page=1&page_size=100")}
            title="Аптеки"
          >
            <Menu.Item
              key="pharUsers"
              icon={<SnippetsOutlined />}
              onClick={() =>
                navigate("/admin-pharmacy/user?page=1&page_size=20")
              }
            >
              Настройка
            </Menu.Item>
            <Menu.Item
              key="pharSetting"
              icon={<SnippetsOutlined />}
              onClick={() =>
                navigate("/admin-pharmacy/setting?page=1&page_size=20")
              }
            >
              Категория аптек
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="pharmacy-ceo"
            icon={<UserOutlined />}
            // onClick={() => navigate("/pharmacy-ceo?page=1&page_size=100")}
            title="Директора Аптек"
          >
            <Menu.Item
              key="pharmacyCeoUsers"
              icon={<SnippetsOutlined />}
              onClick={() => navigate("/pharmacy-ceo/user?page=1&page_size=20")}
            >
              Пользователи
            </Menu.Item>
            <Menu.Item
              key="pharmacyCeoSetting"
              icon={<SnippetsOutlined />}
              onClick={() =>
                navigate("/pharmacy-ceo/coeficient-drug?page=1&page_size=20")
              }
            >
              Коефициент лекарств
            </Menu.Item>
          </Menu.SubMenu>
        </>
      );
    } else if (
      tempMe.user.is_company ||
      localStorage.getItem("user") === "company"
    ) {
      return (
        <>
          <Menu.Item
            key="position"
            icon={<SnippetsOutlined />}
            onClick={() => navigate("/position?page=1&page_size=100")}
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
              onClick={() => navigate("/project/pharmacy?page=1&page_size=20")}
            >
              Мои Аптеки
            </Menu.Item>
            <Menu.Item
              key="pill"
              icon={<SnippetsOutlined />}
              onClick={() => navigate("/project/pill?page=1&page_size=20")}
            >
              Мои Лекарства
            </Menu.Item>
            <Menu.Item
              key="plan"
              icon={<LineChartOutlined />}
              onClick={() =>
                navigate("/project/plan?page=1&page_size=20&order_by=id")
              }
            >
              Мой план
            </Menu.Item>
          </Menu.SubMenu>
        </>
      );
    }
    return null;
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          overflowY: "scroll",
          minWidth: "fit-content",
          width: "fit-content",
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={activeMenu}
          defaultOpenKeys={[
            "project",
            "company",
            "admin-pharmacy",
            "pharmacy-ceo",
          ]}
          selectedKeys={activeMenu}
          onSelect={({ keyPath }): any => setAciveMenu(keyPath)}
        >
          {displayMenu()}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div className="header-wrapper">
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            })}
            {/* {isSuccess ? displayUsername() : ''} */}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {fetchedMe.username}
            </span>
            <div className="log-wrapper">
              <Avatar size={40} className="avatar">
                {tempMe.username}
              </Avatar>
              {/* <Avatar className="avatar" icon={<UserOutlined />} /> */}
              {/* <span>asd</span> */}
              <Button
                onClick={async () => {
                  await logout();
                  navigate("/login");
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
            margin: "24px 16px",
            padding: 24,
          }}
        >
          <div>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Wrapper;
