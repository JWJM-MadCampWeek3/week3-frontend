import * as React from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import axios from "axios";
import { Card, Typography } from "antd";
import { useStopwatch } from "react-timer-hook";
import { group } from 'console';

const { Text } = Typography;

const API_URL = "http://143.248.219.4:8080";

function RenderRow(props: ListChildComponentProps & { data: any[] }) {
  const { index, style, data } = props;
  const groupInfo = data[index];
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });

  // groupInfo.duration을 기반으로 offsetTimestamp 계산
  const offsetTimestamp = React.useMemo(() => {
    const timestamp = new Date();
    timestamp.setSeconds(timestamp.getSeconds() +  groupInfo.dates[0].duration);
    return timestamp;
  }, [ groupInfo.dates[0].duration]);

  // reset 함수 호출
  React.useEffect(() => {
    console.log(groupInfo.id, groupInfo.isStudy)
    reset(offsetTimestamp, groupInfo.isStudy)
  }, [groupInfo.isStudy]);

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText
          primary={groupInfo.nickname}
          secondary={
            <React.Fragment>
              <Text
                style={{ textAlign: "center", width: "100%", marginTop: 0 }}
              >
                {hours}시간 {minutes}분 {seconds}초
              </Text>
            </React.Fragment>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

const GroupYeolpumta = () => {

  const [groupMembers, setGroupMembers] = React.useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");

  const [groupInfos, setGroupInfos] = React.useState([]);

  // 컴포넌트가 처음 렌더링될 때 데이터 로딩
  React.useEffect(() => {
    // Fetch group members from server
    axios
      .post(`${API_URL}/group/Info`, { group_name: group_name })
      .then((response) => {
        const memberIds = response.data.members;
        return Promise.all(
          memberIds.map((memberId) =>
            axios.post(`${API_URL}/user_Info`, { id: memberId })
          )
        );
      })
      .then((responses) => {
        const users = responses.map((response) => response.data);
        setGroupMembers(users);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    sendPostRequest(); // 처음 데이터 로딩 후 한 번 실행

    // 10초마다 데이터 업데이트
    const timer = setInterval(sendPostRequest, 10000);

    return () => {
      clearInterval(timer); // 컴포넌트가 언마운트될 때 타이머 해제
    };
  }, [group_name]);

  function sendPostRequest() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    axios
      .post(`${API_URL}/timer/group`, {
        group_name: group_name,
        date: formattedDate,
      })
      .then((response) => {
        setGroupInfos(response.data.members);
      })
      .catch((error) => {
        console.error("POST 요청 실패:", error);
      });
  }

  return (
    <Card title={"오늘 공부한 사람들"}>
      <Box
        sx={{
          height: 250,
          bgcolor: "background.paper",
        }}
      >
        <FixedSizeList
          height={250}
          width="100%"
          itemSize={46}
          itemCount={groupInfos.length}
          overscanCount={5}
        >
          {(props) => <RenderRow {...props} data={groupInfos} />}
        </FixedSizeList>
      </Box>
    </Card>
  );
};

export default GroupYeolpumta;
