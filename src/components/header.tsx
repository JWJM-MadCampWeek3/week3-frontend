import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import styled from 'styled-components';

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0;
  }
  .ant-tabs-tab {
    font-size: 20px;
    font-weight: bold;
    padding: 10px 50px;
  }
`;

const Header: React.FC = () => (
  <header>
    <StyledTabs
      defaultActiveKey='1'
      centered
      items={[
        { label: "그룹", key: "1" },
        { label: "랭킹", key: "2" },
        { label: "문제", key: "3" },
      ]}
      style={{ backgroundColor: "white", paddingTop: "15px"}}
    />
  </header>
);

export default Header;
