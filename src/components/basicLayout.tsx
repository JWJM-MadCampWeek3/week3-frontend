import React, { createContext } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Typography } from "antd";
import Header from "./header.tsx";
import { Outlet } from "react-router-dom";
import StopWatch from "./stopwatch.tsx";

const { Title } = Typography;
const { Content, Sider } = Layout;

const CustomMenuItem = ({ children, ...props }) => {
  const style = {
    padding: "12px", // 패딩 설정
    display: "flex", // Flexbox 레이아웃 사용
    justifyContent: "center", // 가로축 기준 가운데 정렬
    alignItems: "center", // 세로축 기준 가운데 정렬
    width: "100%", // 부모 컨테이너의 전체 너비 사용
    height: 200,
  };

  return (
    <Menu.Item {...props} style={style}>
      {children}
    </Menu.Item>
  );
};

const BasicLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const today = new Date();
  // 현재 날짜를 가져옵니다.

  const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Layout style={{ flex: 1 }}>
        <Sider width={250} style={{ background: colorBgContainer }}>
          <Menu
            mode='inline'
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub2"]}
          >
            <Menu.SubMenu key='sub1' icon={<UserOutlined />} title='나의 정보'>
              <Menu.Item key='1-1'> {`대충 유저 정보`}</Menu.Item>
            </Menu.SubMenu>
            
            <Menu.SubMenu key='sub2' icon={<LaptopOutlined />} title='공부시간'>
              <CustomMenuItem key='2-1'>
              <div style={{ textAlign: "center", margin: "16px", height:20}}>
                <Title level={5} style={{ margin: 0 }}>
                  {formattedDate}
                </Title>
              </div>
                <StopWatch />
              </CustomMenuItem>
            </Menu.SubMenu>

            <Menu.SubMenu
              key='sub3'
              icon={<NotificationOutlined />}
              title='나의 그룹들'
            >
              <Menu.Item key='3-1'>{`대충 나의 그룹들`}</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu
              key='sub4'
              icon={<NotificationOutlined />}
              title='오늘 풀 문제들'
            >
              <Menu.Item key='4-1'>{`대충 오늘 풀 문제들`}</Menu.Item>
            </Menu.SubMenu>
          </Menu>

        </Sider>
        <Layout style={{ padding: "12px 12px 12px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              flex: 1,
            }}
          >
            <main>
              <Outlet />
            </main>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
