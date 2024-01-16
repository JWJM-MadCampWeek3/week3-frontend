import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../App.tsx";
import axios from "axios";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import { Card } from "antd";

const API_URL = "http://143.248.219.4:8080";

function RenderRow(props) {
  const { index, style, data } = props;
  
  const navigate = useNavigate();
  
  return (
    <ListItem 
    onClick={(e) => {navigate(`/group?group_name=${data[index]}`);}}
      style={style}
      key={index}
      component='div'
      disablePadding
    >
      <ListItemButton>
        <ListItemText primary={`${data[index]}`} />
      </ListItemButton>
    </ListItem>
  );
}

const MyGroup = () => {
  const [group, setGroup] = useState([]);
  const context = useContext(UserContext);

  useEffect(() => {
    if (context) {
      const storedUserInfo = sessionStorage.getItem("userInfo");
      if (storedUserInfo) {
        context.setUser(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  useEffect(() => {
    if (context) {
      axios
        .post(`${API_URL}/user_Info`, { id: context.user.id })
        .then((response) => {
          // Assuming the response body has a 'group' field that is an array
          setGroup(response.data.group);
        })
        .catch((error) => {
          console.error("There was an error fetching the group info", error);
        });
    }
    // Replace with your actual endpoint and logic for fetching user info
  }, [context?.user]);

  if (!context) {
    return <div>로딩 중...</div>;
  }

  return (
    <Card style={{ margin: 10 }}>
      <Box
        sx={{
          width: "100%",
          maxHeight: 200,
          bgcolor: "background.paper",
        }}
      >
        <FixedSizeList
          height={200}
          width='100%'
          itemSize={46}
          itemCount={group.length}
          overscanCount={5}
          itemData={group} // pass groups as itemData to RenderRow
        >
          {RenderRow}
        </FixedSizeList>
      </Box>
    </Card>
  );
};

export default MyGroup;
