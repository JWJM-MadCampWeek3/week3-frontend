import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex, Card } from "antd";
import { UserContext } from "../App.tsx";
import io from 'socket.io-client';
import GroupYeolpumta from "../components/groupYeolpumta.tsx";

const API_URL = "http://143.248.219.4:8080";

const tier_list = ["티어 없음", "Bronze V", "Bronze IV", "Bronze III", "Bronze II", "Bronze I", "Silver V", "Silver IV", "Silver III", "Silver II", "Silver I", "Gold V", "Gold IV", "Gold III", "Gold II", "Gold I", "Platinum V", "Platinum IV", "Platinum III", "Platinum II", "Platinum I", "Diamond V", "Diamond IV", "Diamond III", "Diamond II", "Diamond I", "Ruby V", "Ruby IV", "Ruby III", "Ruby II", "Ruby I", "Master"]

interface Group {
  group_name: string;
  bio: string;
  problems: string[];
  tier: number;
}

const GroupPage = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");
  const [group, setGroup] = useState<Group>();

  useEffect(() => {
    if (context) {
      const storedUserInfo = sessionStorage.getItem("userInfo");
      if (storedUserInfo) {
        context.setUser(JSON.parse(storedUserInfo));
      }
    }
  },[]);

  useEffect(() => {
   axios.post(`${API_URL}/group/Info`, {group_name: group_name}).then((response) => {
      setGroup({
        group_name: response.data.group_name,
        bio: response.data.bio,
        problems: response.data.problems,
        tier: response.data.tier,
      });
    }).catch((error) => {
      console.log(error);
    });
  },[group_name]);

  if (!context) {
    return <div>로딩 중...</div>;
  }

  const { user, setUser } = context;


  // TODO 그룹 설명 추가
  return (
    <div className={"group-page"}>
      <Card title={group_name} bordered={false} style={{ width: "70%" }}>
        <p>{group?.bio}</p>
        {group? tier_list[group.tier]:null}
      </Card>
      <Card title={`${group_name}이 풀 문제들`} bordered={false} style={{ width: "70%" }}>
        <p>{group?.problems}</p>
      </Card>
      <GroupYeolpumta />
    </div>
  );
};

export default GroupPage;
