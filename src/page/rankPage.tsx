import React, { useEffect, useState } from "react";
import { AudioOutlined } from "@ant-design/icons";
import { Input, Space, Card } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import Box from "@mui/material/Box";
import {Button, Typography} from "antd";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";

const { Search } = Input;

const { Title } = Typography;

function renderRow(props) {
  const { index, style, data } = props;

  const joinGroup = () => {
    // TODO : 그룹 들어가기
  }
  
  // TODO 온갖...버튼들... ㅋㅋ
  // TODO 그룹 정보? 수정하기
  return (
    <ListItem style={style} key={index} component='div' disablePadding>
      <ListItemButton>
        <ListItemText primary={`이름`} />
        <ListItemText primary={`총 공부량`} />
      </ListItemButton>
    </ListItem>
  );
}


const RankPage: React.FC = () => {
  const [group, setGroup] = 
  useState(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12","13","14","15","16"]);

  useEffect(() => {
    //TODO : 그룹 전부 가져오기
  }, []);

  //근데 이거 서치바 좀 이상한데...ㅋㅋ 임티가 이상하다;;
  return (
    <>
      <Title level={3}>순위</Title>
      <Card >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          <FixedSizeList
            height= {600}
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
    </>
  );
};

export default RankPage;
