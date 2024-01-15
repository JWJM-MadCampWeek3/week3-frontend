import React, { useEffect, useState, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../App.tsx";
import { Avatar, Divider, List, Skeleton } from "antd";
import axios from "axios";

const API_URL = "http://143.248.219.4:8080";

const MyGroup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<string[]>([]);
  const context = useContext(UserContext);

  useEffect(() => {
    if (context) {
      const storedUserInfo = sessionStorage.getItem("userInfo");
      console.log("storagedUserInfo",storedUserInfo)
      if (storedUserInfo) {
        context.setUser(JSON.parse(storedUserInfo));
      }
    }
  }, []);
  
  useEffect(() => {
    console.log("user",context?.user)
    if (context?.user) {
      loadMoreData();
    }
  }, [context?.user]);

  if (!context) {
    return <div>로딩 중...</div>;
  }

  const { user, setUser } = context;

  const loadMoreData = async () => {
    console.log("userId",user.id)
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user_Info`, {
        id: user.id
      });
      const { data } = response;
      setGroup([...group, ...data.group]);
      console.log(data);
      setLoading(false);
      // 이후 data를 사용하는 로직
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
      setLoading(false);
    }
  };

  return (
    <div
      id='scrollableDiv'
      style={{
        height: 200,
        overflow: "auto",
        width: "100%",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        dataLength={group.length}
        next={loadMoreData}
        hasMore={group.length < 50}
        loader={<Skeleton paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>나의 그룹이 더이상 없습니다.</Divider>}
        scrollableTarget='scrollableDiv'
      >
        <List
          dataSource={group}
          renderItem={(item) => (
            <List.Item key={item}>
              <List.Item.Meta title={<a href='https://ant.design'>{item}</a>} />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default MyGroup;
