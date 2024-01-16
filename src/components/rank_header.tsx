import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space, DatePicker, Row, Col } from "antd";
import axios from "axios";
import { UserContext } from "../App.tsx";

const API_URL = "http://143.248.219.4:8080";

const RankHeader = () => {
  const [groups, setGroups] = React.useState<any[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const context = useContext(UserContext);
  const [items, setItems] = React.useState<any[]>([]);

  const [isDate, setIsDate] = React.useState(true);

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
          navigate(`/rank?group_name=${group}&isDate=${isDate}`);
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

  const [loadings, setLoadings] = useState<boolean[]>([]);

  if (!context) {
    return <div>로딩 중...</div>;
  }

  const group_name = searchParams.get("group_name");

  const enterLoading = (index: number) => {
    setLoadings((state) => {
      const newLoadings = [...state];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((state) => {
        const newLoadings = [...state];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  return (
    <>
      <Row>
        <Col span={20} style={{ height: 50, margin: "auto 0" }}>
          <Space direction='horizontal'>
            <Dropdown menu={{ items }} placement='bottomLeft'>
              <Button shape='round' size={"large"}>
                {group_name}
                <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Col>
        <Col
          span={4}
          style={{ height: 50, margin: "auto 0", textAlign: "right" }}
        >
          {isDate ? (
            <Button
              onClick={() => {
                setIsDate(false);
                navigate(`/rank?group_name=${group_name}&isDate=false`);
              }}
              shape='round'
              size={"large"}
            >
              한달 랭킹
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsDate(true);
                navigate(`/rank?group_name=${group_name}&isDate=true`);
              }}
              shape='round'
              size={"large"}
            >
              하루 랭킹
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export default RankHeader;
