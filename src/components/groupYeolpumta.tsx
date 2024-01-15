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

function renderRow(props: ListChildComponentProps, members: any[]) {
  const { index, style } = props;
  const member = members[index];

  return (
    <ListItem style={style} key={index} component='div' disablePadding>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar alt={member.name} src={member.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={member.name}
          secondary={
            <React.Fragment>
              <Typography component='span' variant='body2' color='text.primary'>
                {member.detail}
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
      .post("/group/Info", { group_name: "default" })
      .then((response) => {
        const { data } = response;
        console.log(data.group_members);
        setGroupMembers(data.group_members);
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
        {(props) => renderRow(props, groupMembers)}
      </FixedSizeList>
    </Box>
  );
};

export default GroupYeolpumta;
