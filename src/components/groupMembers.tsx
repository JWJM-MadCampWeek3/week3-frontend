import * as React from "react";
import { useSearchParams } from "react-router-dom";
import {Card} from "antd";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import axios from "axios";
import { AndroidTwoTone } from "@material-ui/icons";

const API_URL = "http://143.248.219.4:8080";

function RenderRow(props: ListChildComponentProps & { data: any[] }) {
  const { index, style, data } = props;
  const user = data[index];

  return (
    <ListItem style={style} key={index} component='div' disablePadding>
      <ListItemButton>
        <ListItemText
          primary={user.nickname}
          secondary={<React.Fragment></React.Fragment>}
        />
      </ListItemButton>
    </ListItem>
  );
}

const GroupMembers = () => {
  const [groupMembers, setGroupMembers] = React.useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");

  React.useEffect(() => {
    // Fetch group members from server
    axios
      .post(`${API_URL}/group/member`, { group_name: group_name })
      .then((response) => {
        const members = response.data.members;
        return Promise.all(
          members.map((member) =>
            axios.post(`${API_URL}/user_Info`, { id: member.id })
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
  }, []);

  return (
    <Card title={"그룹원 목록"} style={{ width: "100%", margin: "10px auto 20px 0" }}>
      <Box
        sx={{
          width: "100%",
          height: 210,
          margin: "0 auto",
          bgcolor: "background.paper",
        }}
      >
        <FixedSizeList
          height={210}
          width='100%'
          itemSize={46}
          itemCount={groupMembers.length}
          overscanCount={5}
        >
          {(props) => <RenderRow {...props} data={groupMembers} />}
        </FixedSizeList>
      </Box>
    </Card>
  );
};

export default GroupMembers;
