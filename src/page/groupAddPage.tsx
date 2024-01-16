import React, { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import type { GetRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table,Modal,Flex } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const { Text, Title } = Typography;

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof DataType;

const API_URL = "http://143.248.219.4:8080";

interface DataType {
  key: React.Key;
  group_name: string;
  members: number;
  goal_time: number;
  goal_number: number;
  tier: number;
  group_bio: string;
}

const GroupAddPage: React.FC = () => {
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
      title: "그룹 이름",
      dataIndex: "group_name",
      width: "20%",
      ...getColumnSearchProps("group_name"),
    },
    {
      title: "그룹 소개",
      dataIndex: "group_bio",
      width: "20%",
    },
    {
      title: "목표 공부 시간",
      dataIndex: "goal_time",
      width: "10%",
    },
    {
      title: "목표 문제 수",
      dataIndex: "goal_number",
      width: "10%",
    },
    {
      title: "티어 제한",
      dataIndex: "tier",
      width: "10%",
    },
    {
      title: "그룹 멤버수",
      dataIndex: "members",
      width: "10%",
    },
  ];
  const [groups, setGroups] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    loadGroups();
  }, [currentPage]);

  // TODO 이거 어케 생긴거지??
  const loadGroups = () => {
    axios
      .get(`${API_URL}/group/list`)
      .then(async (response) => {
        const groupsData = response.data;
        const updatedGroups = await Promise.all(
          groupsData.map(async (group) => {
            try {
              const response = await axios.post(`${API_URL}/group/Info`, {
                group_name: group.group_name,
              });
              return {
                group_name: response.data.group_name,
                members: response.data.members.length,
                goal_time: response.data.goal_time,
                goal_number: response.data.goal_number,
                tier: response.data.tier,
                group_bio: response.data.group_bio,
              };
            } catch (error) {
              console.error("Error fetching group info:", error);
              return null;
            }
          })
        );
        setGroups(updatedGroups);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 페이지 변경 이벤트 처리 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //TODO 로직 꼬인거 고치기
  return (
    <>
      <Flex justify='flex-end' align='center'>
        <Title level={3} style={{ width: "100%", margin: "10px auto 20px 0" }}>
          그룹 목록
        </Title>
        <Button shape='round' size={"large"}>
          그룹 만들기
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={groups}
        pagination={{
          pageSize: 10,
          onChange: handlePageChange, // 페이지 변경 이벤트 처리
        }}
        style={{ width: "100%", margin: "10px auto 20px 0" }}
      />
    </>
  );
};

export default GroupAddPage;
