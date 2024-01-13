import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/intro.css";


const Test = () => {
    
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
      우리는 알고리즘 스터디입니다
      사이트 설명입니다.
      대충 개 짱 쩐다는 이야기...
      인트로 멘트 어쩌구 저쩌구구
      </div>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Test;