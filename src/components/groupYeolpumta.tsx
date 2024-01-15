import * as React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://143.248.219.4:8080";

function RenderRow(props: ListChildComponentProps, members: any[]) {
  const { index, style } = props;
  const member = members[index];
  const [user, setUser] = React.useState<any>({});
  console.log(member)
  axios.post(`${API_URL}/user_Info`, { id: member }).then((response) => {
    console.log(response.data);
    setUser(response.data);
  }).catch((error) => {
    console.error("There was an error fetching the group info", error);
  });

  return (
    <ListItem style={style} key={index} component='div' disablePadding>
      <ListItemButton>
        <ListItemText
          primary={user.nickname}
          secondary={
            <React.Fragment>
              <Typography component='span' variant='body2' color='text.primary'>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");
  const [groupMembers, setGroupMembers] = React.useState([]);

  console.log(group_name)
  React.useEffect(() => {
    // Fetch group members from server
    axios
      .post(`${API_URL}/group/Info`, { group_name: group_name })
      .then((response) => {
        const { data } = response;
        setGroupMembers(data.members);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={groupMembers.length}
        overscanCount={5}
      >
        {(props) => RenderRow(props, groupMembers)}
      </FixedSizeList>
    </Box>
  );
};

export default GroupYeolpumta;