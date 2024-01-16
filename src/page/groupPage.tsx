import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex, Card, Row, Col, Space } from "antd";
import { UserContext } from "../App.tsx";
import GroupYeolpumta from "../components/groupYeolpumta.tsx";
import GroupMembers from "../components/groupMembers.tsx";
import { Typography } from "antd";
import GroupProblem from "../components/groupProblem.tsx";
import TimerIcon from "@mui/icons-material/Timer";
import RuleIcon from "@mui/icons-material/Rule";
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
          bio: response.data.group_bio,
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
                  style={{ width: "97%", margin: "5px auto 10px 0" }}
                >
                  <Flex vertical>
                    <Text strong>{group?.bio}</Text>
                    <Flex justify='flex-end' align='center'>
                      <Space>
                        <img width={16} height={20} src={"./images/tier.png"} />
                        {group ? tier_list[group.tier] : null}
                        <TimerIcon />
                        {group ? tier_list[group.goal_time] : null}
                        <RuleIcon />
                        {group ? tier_list[group.goal_number] : null}
                      </Space>
                    </Flex>
                  </Flex>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={`${group_name} 그룹이 풀 문제들`}
                  style={{ width: "97%", margin: "5px auto 10px 0" }}
                >
                  <GroupProblem />
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
