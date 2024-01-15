import * as React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { FixedSizeList,ListChildComponentProps } from "react-window";
import axios from "axios";

const API_URL = "http://143.248.219.4:8080";

function RenderRow(props: ListChildComponentProps & { data: any[] }) {
  const { index, style, data } = props;
  const user = data[index];

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText
          primary={user.nickname}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="text.primary">
                {user.bio}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

const GroupYeolpumta = () => {
  const [groupMembers, setGroupMembers] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Fetch group members from server
    axios.post(`${API_URL}/group/Info`, { group_name: "default" })
      .then((response) => {
        const memberIds = response.data.members;
        return Promise.all(memberIds.map(memberId =>
          axios.post(`${API_URL}/user_Info`, { id: memberId })
        ));
      })
      .then(responses => {
        const users = responses.map(response => response.data);
        setGroupMembers(users);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Box
      sx={{
        width: "70%",
        height: 400,
        bgcolor: "background.paper",
      }}
    >
      <FixedSizeList
        height={400}
        width="100%"
        itemSize={46}
        itemCount={groupMembers.length}
        overscanCount={5}
      >
        {props => <RenderRow {...props} data={groupMembers} />}
      </FixedSizeList>
    </Box>
  );
};

export default GroupYeolpumta;
