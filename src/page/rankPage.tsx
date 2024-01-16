import React, { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import type { GetRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof DataType;

const API_URL = "http://143.248.219.4:8080";

interface DataType {
  key: React.Key;
  nickname: string;
  bj_id: string;
  duration: number;
  solvedCount: string;
  rank: number;
}

const RankPage: React.FC = () => {
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "이름",
      dataIndex: "nickname",
      width: "30%",
      ...getColumnSearchProps("nickname"),
    },
    {
      title: "백준 아이디",
      dataIndex: "bj_id",
      width: "30%",
      ...getColumnSearchProps("bj_id"),
    },
    {
      title: "공부시간",
      dataIndex: "duration",
      width: "15%",
    },
    {
      title: "푼 문제 수",
      dataIndex: "solvedCount",
      width: "15%",
    },
    {
      title: "순위",
      dataIndex: "rank",
      width: "10%",
    },
  ];
  const [rankers, setRankers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const group_name = searchParams.get("group_name");

  useEffect(() => {
    loadRankers(currentPage); // 페이지가 변경될 때 랭킹 데이터 로드

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group_name, currentPage]);

  const loadRankers = (page) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");
  
    const yesterdayDateString = `${year}-${month}-${day}`;

    console.log(currentPage);
    axios
      .post(`${API_URL}/rank/individual_day`, {
        group_name: group_name,
        date: "2024-01-16",
      })
      .then((response) => {
        const rankersData = response.data;
        const updatedRankers = rankersData.map((ranker, index) => ({
          ...ranker,
          rank: index + 1, // 순위 계산
          key: ranker.id, // 고유한 key 값을 설정
        }));
        console.log(updatedRankers);
        setRankers(updatedRankers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 페이지 변경 이벤트 처리 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Table
      columns={columns}
      dataSource={rankers}
      pagination={{
        pageSize: 10,
        onChange: handlePageChange, // 페이지 변경 이벤트 처리
      }}
      style={{ width: "100%", margin: "10px auto 20px 0" }}
    />
  );
};

export default RankPage;