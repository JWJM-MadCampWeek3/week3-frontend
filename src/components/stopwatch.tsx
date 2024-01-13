import React from "react";
import { useStopwatch } from "react-timer-hook";
import { Button, Card, Flex, Typography } from "antd";

const { Text, Title } = Typography;

const MyStopwatch = () => {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
  } = useStopwatch({ autoStart: false });

  return (
    <Flex gap='middle' vertical>
      <div style={{ alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", width: "100%" }}>
            오늘의 공부 시간
          </Text>
        </div>

        <Title style={{ textAlign: "center", width: "100%", marginTop:0}} level={3}>
          {hours}시간 {minutes}분 {seconds}초
        </Title>
        <Flex
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: 20,
          }}
        >
          <Button onClick={start}>시작</Button>
          <Button onClick={pause}>일시정지</Button>
        </Flex>
      </div>
    </Flex>
  );
};

export default MyStopwatch;
