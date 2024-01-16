import React, { useEffect, useState } from "react";
import { AudioOutlined } from "@ant-design/icons";
import { Input, Space, Card, Row, Col } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import Box from "@mui/material/Box";
import { Button, Typography } from "antd";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import { UserContext } from "../App.tsx";

const { Search } = Input;

const { Title } = Typography;

// TODO: search 기능 구현
const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

function renderRow(props) {
  const { index, style, data } = props;

  const joinGroup = () => {
    // TODO : 그룹 들어가기
  };

  // TODO 온갖...버튼들... ㅋㅋ
  //TODO 그룹 정보? 수정하기
  return (
    <ListItem style={style} key={index} component='div' disablePadding>
      <ListItemButton>
        <ListItemText primary={`이름`} />
        <ListItemText primary={`티어`} />
        <ListItemText primary={`인원제한`} />
        <ListItemText primary={`하루 목표 공부`} />
        <Button>그룹 들어가기</Button>
      </ListItemButton>
    </ListItem>
  );
}

const GroupAddPage: React.FC = () => {
  const [group, setGroup] = useState([]);

  useEffect(() => {
    //TODO : 그룹 전부 가져오기
  }, []);

  const makeRoom = () => {
    //TODO : 방 만들기
  };

  return (
    <>
      <Search
        size='large'
        placeholder='그룹 이름을 입력해주세요.'
        onSearch={onSearch}
        enterButton
      />
      <Row align="middle">
        <Col span={20}>
          <Title level={3}>그룹 목록</Title>
        </Col>
        <Col span={4} style={{height:50, margin:"auto 0", textAlign: "right" }}>
          <Button onClick={makeRoom} shape="round" size={'large'}>그룹 만들기</Button>
        </Col>
      </Row>
      <Card>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          <FixedSizeList
            height={600}
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

export default GroupAddPage;
