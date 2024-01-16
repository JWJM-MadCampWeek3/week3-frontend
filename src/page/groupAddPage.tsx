import React, { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import type {
  GetRef,
  TableColumnsType,
  TableColumnType,
  MenuProps,
} from "antd";
import { Button, Input, Space, Table, Modal, Flex, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import TextField from "@mui/material/TextField";
import { SettingsRemote } from '@material-ui/icons';

const { Text, Title } = Typography;

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof DataType;

const API_URL = "http://143.248.219.4:8080";

const baseStyle: React.CSSProperties = {
  width: 400,
};

interface DataType {
  key: React.Key;
  group_name: string;
  members: number;
  goal_time: number;
  goal_number: number;
  tier: number;
  group_bio: string;
}
const tier_list = [
  "티어 없음",
  "Bronze V",
  "Bronze IV",
  "Bronze III",
  "Bronze II",
  "Bronze I",
  "Silver V",
  "Silver IV",
  "Silver III",
  "Silver II",
  "Silver I",
  "Gold V",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum V",
  "Platinum IV",
  "Platinum III",
  "Platinum II",
  "Platinum I",
  "Diamond V",
  "Diamond IV",
  "Diamond III",
  "Diamond II",
  "Diamond I",
  "Ruby V",
  "Ruby IV",
  "Ruby III",
  "Ruby II",
  "Ruby I",
  "Master",
];


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
  const [open, setOpen] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [goalTime, setGoalTime] = useState(0);
  const [goalNumber, setGoalNumber] = useState(0);
  const [tier, setTier] = useState(0);
  const [groupBio, setGroupBio] = useState("");

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
  const items: MenuProps["items"] = tier_list.map((tier, index) => ({
    label: tier,
    key: index,
    onClick: () => {
      // Redirect to the selected group when an item is clicked
      setTier(index);
    },
  }));

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    axios
      .post(`${API_URL}/group/create`, {
        group_name: groupName,
        manager_id: "TODO: manager_id",
        goal_time: goalTime,
        goal_number: goalNumber,
        tier: tier,
        is_secret: false,
        password: "TODO: password",
        group_bio: groupBio,
      })
      .then((response) => {
        console.log(response);
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //TODO 로직 꼬인거 고치기
  return (
    <>
      <Flex justify='flex-end' align='center'>
        <Title level={3} style={{ width: "100%", margin: "10px auto 20px 0" }}>
          그룹 목록
        </Title>
        <Button type='primary' shape='round' size={"large"} onClick={showModal}>
          그룹 만들기
        </Button>
      </Flex>
      <Modal
        open={open}
        title='그룹 만들기'
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Flex vertical justify='flex' align='center'>
          <Flex style={baseStyle} justify='space-between' align='center'>
            <TextField
              style={{ width: 400 }}
              required
              id='standard-required'
              label='그룹 이름'
              variant='standard'
              margin='normal'
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Flex>
          <Flex style={baseStyle} justify='space-between' align='center'>
            <TextField
              style={{ width: 400 }}
              required
              type='number'
              id='standard-required'
              label='하루 목표 시간'
              variant='standard'
              margin='normal'
              onChange={(e) => setGoalTime(parseInt(e.target.value, 10))}
            />
          </Flex>
          <Flex style={baseStyle} justify='space-between' align='center'>
            <TextField
              style={{ width: 400 }}
              required
              type='number'
              id='standard-required'
              label='하루 목표 문제수'
              variant='standard'
              margin='normal'
              onChange={(e) => setGoalNumber(parseInt(e.target.value, 10))}
            />
          </Flex>
          <Flex style={{ width: 400, justifyContent: "space-between", margin:10}}>
            <Flex justify='flex-start' align='center'>
              <Text>티어제한</Text>
            </Flex>
            <Flex justify='flex-end' align='center'>
              <Dropdown.Button
                icon={<DownOutlined />}
                menu={{ items }}
              >
                제한 없음
              </Dropdown.Button>
            </Flex>
          </Flex>

          <Flex style={baseStyle} justify='space-between' align='center'>
            <TextField
              style={{ width: 400 }}
              // error
              required
              id='standard-required'
              label='그룹 소개'
              variant='standard'
              margin='normal'
              onChange={(e) => setGroupBio(e.target.value)}
            />
          </Flex>
        </Flex>
      </Modal>
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
