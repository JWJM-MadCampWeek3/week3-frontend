import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Space } from "antd";

const IntroPage = () => {
  const API_URL = "http://143.248.219.4:8080";

  const navigate = useNavigate();

  const handleLogin = () => {
    // /login으로 이동
    navigate("/login");
  };

  const backgroundStyle = {
    backgroundImage: `url(./images/background_intro.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh", // 전체 높이
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "end",
  };

  return (
    <div style={backgroundStyle}>
      <div style={{marginRight: '10%', marginBottom: "5%"}}>
        <Space>
          <Button
            style={{marginRight: '50px', width: '150px', height: '50px', fontSize: '15px', fontWeight: 'bold'}}
            shape='round'
            onClick={() => {
              navigate("/login");
            }}
          >
            로그인
          </Button>
          <Button
            shape='round'
            style={{ width: '150px', height: '50px', fontSize: '15px', fontWeight: 'bold'}}
            onClick={() => {
              navigate("/signup");
            }}
          >
            회원가입
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default IntroPage;
