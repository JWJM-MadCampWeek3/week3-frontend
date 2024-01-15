import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex, Card } from "antd";
import { UserContext } from "../App.tsx";
import io from 'socket.io-client';
import GroupYeolpumta from "../components/groupYeolpumta.tsx";

const API_URL = "http://143.248.219.4:8080";

const GroupPage = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");
  console.log(group_name);

  useEffect(() => {
    if (context) {
      const storedUserInfo = sessionStorage.getItem("userInfo");
      if (storedUserInfo) {
        context.setUser(JSON.parse(storedUserInfo));
      }
    }
    console.log("???")
  },[]);

  if (!context) {
    return <div>로딩 중...</div>;
  }

  const { user, setUser } = context;


  // TODO 그룹 설명 추가
  return (
    <div className={"group-page"}>
      <Card title={group_name} bordered={false} style={{ width: "70%" }}>
        <p>그룹 설명입니다</p>
      </Card>
      <Card title={`${group_name}이 풀 문제들`} bordered={false} style={{ width: "70%" }}>
        <p>그룹 문제입니다</p>
      </Card>
      <GroupYeolpumta/>
    </div>
  );
};

export default GroupPage;
