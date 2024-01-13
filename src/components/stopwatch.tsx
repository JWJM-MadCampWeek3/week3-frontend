import React from "react";
import { useStopwatch } from "react-timer-hook";
import { Button, Card, Flex, Typography } from "antd";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';

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
          <Text style={{ textAlign: "center", width: "100%", color: "#455a64", marginBottom: 10}}>
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
            gap: 40,
          }}
        >
          <PlayArrowIcon onClick={start} sx={{ fontSize: 40, color: "#448aff" }}/>
          <PauseOutlinedIcon onClick={pause} sx={{ fontSize: 40, color: "#448aff" }}/>
        </Flex>
      </div>
    </Flex>
  );
};

export default MyStopwatch;
