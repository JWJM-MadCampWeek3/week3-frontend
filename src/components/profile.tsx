import React, { useContext } from "react";
import { useStopwatch } from "react-timer-hook";
import { Button, Card, Flex, Typography, Image } from "antd";
import { UserContext } from "../App.tsx";
import SettingsIcon from "@mui/icons-material/Settings";

const { Text, Title } = Typography;

const Profile = () => {
  const context = useContext(UserContext);
  if (!context) {
    return <div>로딩 중...</div>;
  }
  const { user, setUser } = context;
  console.log(user.image);

  //TODO 유저 정보 바꾸기...
  //TODO 수정기능 구현하기
  //TODO 마이페이지로 옮기
  return (
    <Card style={{ margin: 10 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SettingsIcon sx={{ fontSize: 25, color: "#b0bec5" }} />
      </div>
      <Flex gap='middle' vertical align='center'>
        <img
          width={120}
          height={120}
          src={user.image}
          style={{ borderRadius: "50%" }}
        />
        <Text>{user.id}</Text>
        <Text>{user.id}</Text>
        <Text>{user.id}</Text>
      </Flex>
    </Card>
  );
};

export default Profile;
