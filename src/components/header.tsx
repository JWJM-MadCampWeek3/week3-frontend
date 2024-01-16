import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import styled from 'styled-components';

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0;
  }
  .ant-tabs-tab {
    font-size: 16px;
    font-weight: bold;
    padding: 10px 20px;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();

  const onTabClick = (key: string) => {
    switch (key) {
      case "1":
        navigate('/group?group_name=default'); // '그룹' 탭의 경로
        break;
      case "2":
        navigate('/rank?group_name=default&isDate=true'); // '랭킹' 탭의 경로
        break;
      case "3":
        navigate('/problem'); // '문제' 탭의 경로
        break;
      default:
        break;
    }
  };

  return (
    <header>
      <StyledTabs
        defaultActiveKey='1'
        centered
        onTabClick={onTabClick}
        items={[
          { label: "그룹", key: "1" },
          { label: "랭킹", key: "2" },
          { label: "문제", key: "3" },
        ]}
        style={{ backgroundColor: "white", paddingTop: "15px"}}
      />
    </header>
  );
};

export default Header;
