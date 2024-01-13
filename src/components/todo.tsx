import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Divider, List, Skeleton, Checkbox } from "antd";

//TODO Group 정보 정하기
interface DataType {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

const ToDo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  const onCheckboxChange = (checked: boolean, item: DataType) => {
    console.log(`Item ${item.email} is checked: ${checked}`);
    // 여기에서 체크 상태에 따른 추가적인 로직을 구현할 수 있습니다.
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div
      id='scrollableDiv'
      style={{
        height: 400,
        overflow: "auto",
        width: "100%",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={<Skeleton paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>오늘의 목표 문제가 더 없습니다.</Divider>}
        scrollableTarget='scrollableDiv'
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.email}>
              <Checkbox
                onChange={(e) => onCheckboxChange(e.target.checked, item)}
              >
                {item.name.first} {item.name.last}
              </Checkbox>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default ToDo;
