import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import axios from "axios";
import { UserContext } from "../App.tsx";

const API_URL = "http://143.248.219.4:8080";

const onClick: MenuProps["onClick"] = ({ key }) => {
  console.log(`${key} clicked`);
};

const GroupHeader = () => {
  const [groups, setGroups] = React.useState<any[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const context = useContext(UserContext);
  const [items, setItems] = React.useState<any[]>([]);

  // useEffect를 조건문 밖으로 옮김
  useEffect(() => {
    if (context) {
      const storedUserInfo = sessionStorage.getItem("userInfo");
      if (storedUserInfo) {
        context.setUser(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  useEffect(() => {
    setItems(
      groups.map((group) => ({
        key: group,
        label: group,
        onClick: () => {
          // Redirect to the selected group when an item is clicked
          navigate(`/group?group_name=${group}`);
        },
      }))
    );
    // Replace with your actual endpoint and logic for fetching user info
  }, [groups]);

  useEffect(() => {
    // Fetch group  from server
    axios
      .post(`${API_URL}/user_Info`, { id: context?.user.id })
      .then((response) => {
        setGroups(response.data.group);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!context) {
    return <div>로딩 중...</div>;
  }

  const group_name = searchParams.get("group_name");

  return (
    <Dropdown menu={{ items }} placement='bottomLeft'>
      <Button shape='round' size={"large"}>
        {group_name}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default GroupHeader;
