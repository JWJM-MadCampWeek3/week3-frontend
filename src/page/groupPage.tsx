import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex, Card, Row, Col, Space } from "antd";
import { UserContext } from "../App.tsx";
import io from "socket.io-client";
import GroupYeolpumta from "../components/groupYeolpumta.tsx";
import GroupMembers from "../components/groupMembers.tsx";
import { Typography } from "antd";

const { Title, Text } = Typography;

const API_URL = "http://143.248.219.4:8080";

const tier_list = [
  "제한 없음",
  "Bronze V",
  "Bronze IV",
  "Bronze III",
  "Bronze II",
  "Bronze I",
  "Silver V",
  "Silver IV",
  "Silver III",
  "Silver II",
  "Silver I",
  "Gold V",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum V",
  "Platinum IV",
  "Platinum III",
  "Platinum II",
  "Platinum I",
  "Diamond V",
  "Diamond IV",
  "Diamond III",
  "Diamond II",
  "Diamond I",
  "Ruby V",
  "Ruby IV",
  "Ruby III",
  "Ruby II",
  "Ruby I",
  "Master",
];

interface Group {
  group_name: string;
  bio: string;
  problems: string[];
  tier: number;
  goal_time: number;
  goal_number: number;
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
  }, []);

  useEffect(() => {
    axios
      .post(`${API_URL}/group/Info`, { group_name: group_name })
      .then((response) => {
        setGroup({
          group_name: response.data.group_name,
          bio: response.data.bio,
          problems: response.data.problems,
          tier: response.data.tier,
          goal_time: response.data.goal_time,
          goal_number: response.data.goal_number,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [group_name]);

  if (!context) {
    return <div>로딩 중...</div>;
  }

  const { user, setUser } = context;

  // TODO 그룹 설명 추가
  return (
    <div className={"group-page"}>
      <Flex gap='middle' vertical align='center'>
        <Col span={24} style={{ width: "100%" }}>
          <Row justify='center'>
            <Col span={18}>
              <Col span={24}>
                <Card
                  title={group_name}
                  bordered={false}
                  style={{ width: "97%", margin: "10px auto 20px 0" }}
                >
                  <Text strong>그룹 소개 </Text> <p>{group?.bio}</p>
                  <Space>
                    <Text strong>티어 제한 </Text>
                    {group ? tier_list[group.tier] : null}
                    <Text strong> / 목표 시간 </Text>
                    {group ? tier_list[group.goal_time] : null}
                    <Text strong> 시간 </Text>
                    <Text strong> / 목표 문제수 </Text>
                    {group ? tier_list[group.goal_number] : null}
                    <Text strong> 문제 </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={`${group_name} 그룹이 풀 문제들`}
                  style={{ width: "97%", margin: "10px auto 20px 0" }}
                >
                  <p>{group?.problems}</p>
                </Card>
              </Col>
            </Col>
            <Col span={6}>
              <GroupMembers />
            </Col>
          </Row>
          <Row justify='center'>
            <Col span={24}>
              <GroupYeolpumta />
            </Col>
          </Row>
        </Col>
      </Flex>
    </div>
  );
};

export default GroupPage;
