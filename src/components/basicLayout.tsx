import React, { createContext } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Typography,Card } from "antd";
import Header from "./header.tsx";
import { Outlet } from "react-router-dom";
import StopWatch from "./stopwatch.tsx";
import styled from 'styled-components';
import Profile from "./profile.tsx";
import MyGroup from "./myGroup.tsx";
import ToDo from "./todo.tsx";

const { Title } = Typography;
const { Content, Sider } = Layout;

const StyledCard = styled(Card)`
  .ant-card-head {
    background-color: #448aff;
  }
  .ant-card-head-title{
    color: white;
    font-size: 20px;
  }
`;

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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Layout style={{ flex: 1 }}>
        <Sider id="sider" width={270} style={{ background: colorBgContainer, overflow: 'auto' }}>
          <Menu
            mode='inline'
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub2","sub4"]}
          >
            <Menu.SubMenu key='sub1' icon={<UserOutlined />} title='나의 정보'>
              <Profile/>
            </Menu.SubMenu>
            
            <Menu.SubMenu key='sub2' icon={<LaptopOutlined />} title='공부시간'>
              <StyledCard title={formattedDate} style={{margin:10, textAlign: "center", color: "#2962ff"}}>
                <StopWatch />
              </StyledCard>
            </Menu.SubMenu>

            <Menu.SubMenu
              key='sub3'
              icon={<NotificationOutlined />}
              title='나의 그룹들'
            >
              <MyGroup/>
            </Menu.SubMenu>

            <Menu.SubMenu
              key='sub4'
              icon={<NotificationOutlined />}
              title='오늘 풀 문제들'
            >
              <ToDo/>
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
