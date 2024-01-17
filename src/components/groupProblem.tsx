import React, { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "antd";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import axios from "axios";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { UserContext } from "../App.tsx";

const API_URL = "http://143.248.219.4:8080";

const GroupProblem = () => {
  const [groupProblems, setGroupProblems] = React.useState<string[]>([]);

  const [isChange, setIsChange] = React.useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");

  const [problems, setProblems] = React.useState<string[]>([]);
    const context = useContext(UserContext);

    // TODO: 이미
  function RenderRow(props: ListChildComponentProps & { data: any[] }) {
    const { index, style, data } = props;
    const problem = data[index];


    
    //넣었던 문제 버튼 변경...ㅋㅋ
    return (
      <ListItem style={style} key={index} component='div' disablePadding>
        <ListItemButton>
          <ListItemText
            primary={problem}
            secondary={<React.Fragment></React.Fragment>}
          />
          {problems.includes(problem) ? (
            <AddCircleIcon sx={{ fontSize: 25, color: "#e0e0e0" }} />
          ) : (
            <AddCircleIcon
              onClick={() => {
                axios
                  .post(`${API_URL}/user/problem/insert`, {
                    id: user.id,
                    problem: problem,
                  })
                  .then((response) => {
                    setUser({
                      ...user,
                      problems: [...user.problems, problem],
                    });
                    console.log("newUser", user);
                    setIsChange(!isChange);
                  });
              }}
              sx={{ fontSize: 25, color: "#448aff" }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  }

  React.useEffect(() => {
    // Fetch group members from server
    axios
      .post(`${API_URL}/group/Info`, { group_name: group_name })
      .then((response) => {
        setGroupProblems(response.data.problems);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios.post(`${API_URL}/user_Info`, {id: user.id}).then((response) => {
      setProblems(response.data.problems);
    });
  }, [isChange]);

    // 조건부 렌더링을 여기서 수행
    if (!context) {
      return <div>로딩 중...</div>;
    }

    const { user, setUser } = context;
  return (
    <Box
      sx={{
        width: "100%",
        height: 150,
        margin: "0 auto",
        bgcolor: "background.paper",
      }}
    >
      <FixedSizeList
        height={150}
        width='100%'
        itemSize={46}
        itemCount={groupProblems.length}
        overscanCount={5}
      >
        {(props) => <RenderRow {...props} data={groupProblems} />}
      </FixedSizeList>
    </Box>
  );
};

export default GroupProblem;
