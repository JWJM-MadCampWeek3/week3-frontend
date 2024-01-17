import React, { useEffect } from "react";
import Login from "../components/login.tsx";
import { Button, Flex, Space } from "antd";

const LoginPage: React.FC = () => {
  const backgroundStyle = {
    backgroundImage: `url(./images/background_login.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh", // 전체 높이
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  };

  return (
    <>
      <div style={backgroundStyle}>
        <div style={{ marginRight: "10%"}}>
          <Login />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
