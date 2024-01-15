import React, { createContext, useContext, useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { Button, Card, Flex, Typography } from "antd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import { useWebSocket } from "./websocket.tsx";

const { Text, Title } = Typography;

const API_URL = "http://143.248.219.4:8080";

const MyStopwatch = () => {
  
  const { socket } = useWebSocket();

  //TODO 웹소켓 백과 상의...
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        // Handle incoming WebSocket messages
      };
    }
  }, [socket]);

  const triggerEvent = () => {
    if (socket) {
      socket.send('Your message here');
    }
  };


  useEffect(() => {
    // 날짜 확인 및 처리 함수
    const checkDateChange = () => {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem("stopwatchDate");
      
      //TODO time table에 전날 기록 업데이트 하기
      if (storedDate !== today) {
        // 날짜가 변경되었으면 stopwatchInfo 초기화
        localStorage.removeItem('stopwatchInfo')
        localStorage.setItem("stopwatchDate", today);
      }
    };

    // 주기적으로 날짜 변경 확인
    const intervalId = setInterval(checkDateChange, 60000); // 매 1분마다 확인

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, []);
  
  //TODO stopwatch 시작,끝 누를때마다 time table 업데이트
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset
  } = useStopwatch({ autoStart: false });

  //TODO time 테이블에서 가져올지 어쩔지 고민하기
  useEffect(() => {
    const storedStopwatchInfo = localStorage.getItem("stopwatchInfo");
    if (storedStopwatchInfo) {
      const { hours, minutes, seconds, isRunning } = JSON.parse(storedStopwatchInfo);
      const offsetTimestamp = new Date();
      offsetTimestamp.setSeconds(offsetTimestamp.getSeconds() + hours * 3600 + minutes * 60 + seconds);
      reset(offsetTimestamp, isRunning);
    }
  }, []);

  useEffect(() => {
    const stopwatchInfo = {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      isRunning: isRunning,
    };
    localStorage.setItem("stopwatchInfo", JSON.stringify(stopwatchInfo));
  }, [hours, minutes, seconds, isRunning]);

  return (
    <Flex gap='middle' vertical>
      <div style={{ alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              width: "100%",
              color: "#455a64",
              marginBottom: 10,
            }}
          >
            오늘의 공부 시간
          </Text>
        </div>

        <Title
          style={{ textAlign: "center", width: "100%", marginTop: 0 }}
          level={3}
        >
          {hours}시간 {minutes}분 {seconds}초
        </Title>
        <Flex
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {!isRunning? <PlayArrowIcon
            onClick={start}
            sx={{ fontSize: 40, color: "#448aff" }}
          />: <PauseOutlinedIcon
            onClick={pause}
            sx={{ fontSize: 40, color: "#448aff" }}/>}
        </Flex>
      </div>
    </Flex>
  );
};

export default MyStopwatch;
