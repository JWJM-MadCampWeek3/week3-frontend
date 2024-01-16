import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Flex } from "antd";

const IntroPage = () => {
  const API_URL = "http://143.248.219.4:8080";

  const navigate = useNavigate();

  const handleLogin = () => {
    // /login으로 이동
    navigate("/login");
  };

  return (
    <div className={"intro"}>
      <div className={"intro_title"}>알고리즘</div>
      <div className={"intro_subtitle"}>
        우리는 알고리즘 스터디입니다 사이트 설명입니다. 대충 개 짱 쩐다는
        이야기... 인트로 멘트 어쩌구 저쩌구구
      </div>
      <Button
        type='primary'
        onClick={() => {
          navigate("/login");
        }}
      >
        로그인
      </Button>
      <Button
        type='primary'
        onClick={() => {
          navigate("/signup");
        }}
      >
        회원가입
      </Button>
    </div>
  );
};

export default IntroPage;
