import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App.tsx";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { FixedSizeList } from "react-window";
import { Card } from "antd";

const API_URL = "http://143.248.219.4:8080";

const ToDo = () => {
  const [group, setGroup] = useState([]);
  const [checked, setChecked] = useState<number[]>([]);
  const context = useContext(UserContext);

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      console.log(`Checked: ${group[value]}`); // Logging the item name
    } else {
      newChecked.splice(currentIndex, 1);
      console.log(`Unchecked: ${group[value]}`); // Logging the item name
    }

    setChecked(newChecked);
  };
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
          console.log(response.data.todo_problems)
          // Assuming the response body has a 'group' field that is an array
          setGroup(response.data.todo_problems);
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

  function renderRow(props) {
    const { index, style, data } = props;

    return (
      <ListItem style={style} key={index} component='div' disablePadding>
        <ListItemButton>
          <Checkbox
            edge='end'
            onChange={() => handleToggle(index)}
            checked={checked.indexOf(index) !== -1}
          />
          <ListItemText primary={`${data[index]}`} />
        </ListItemButton>
      </ListItem>
    );
  }

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
          itemData={group} // pass groups as itemData to renderRow
        >
          {renderRow}
        </FixedSizeList>
      </Box>
    </Card>
  );
};

export default ToDo;
