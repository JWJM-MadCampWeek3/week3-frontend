import  React, {useContext} from "react";
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

function RenderRow(props: ListChildComponentProps & { data: any[] }) {
  const { index, style, data } = props;
  const problem = data[index];


  const context = useContext(UserContext);
  
  // 조건부 렌더링을 여기서 수행
  if (!context) {
    return <div>로딩 중...</div>;
  }
  
  const { user, setUser } = context;

  // TODO: 이미 넣었던 문제 버튼 변경...ㅋㅋ
  return (
    <ListItem style={style} key={index} component='div' disablePadding>
      <ListItemButton>
        <ListItemText
          primary={problem}
          secondary={<React.Fragment></React.Fragment>}
        />
        <AddCircleIcon
          onClick={()=>{
            console.log(user.id,(problem));
            axios.post(`${API_URL}/user/problem/insert`, {
              id: user.id,
              problem: problem,
            });
          }}
          sx={{ fontSize: 25, color: "#448aff" }}
        />
      </ListItemButton>
    </ListItem>
  );
}

const GroupProblem = () => {
  const [groupProblems, setGroupProblems] = React.useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");

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
  }, []);

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
