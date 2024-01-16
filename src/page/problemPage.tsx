import React, { useRef, useEffect, useState, useContext } from "react";
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
import { SettingsRemote } from "@material-ui/icons";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { UserContext } from "../App.tsx";

const { Text, Title } = Typography;

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof DataType;

const API_URL = "http://143.248.219.4:8080";

const baseStyle: React.CSSProperties = {
  width: 400,
};

interface DataType {
  key: React.Key;
  problem_id: string;
  problem_title: string;
  problem_tier: string;
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

const ProblemPage: React.FC = () => {
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
      title: "문제 번호",
      dataIndex: "problem_id",
      width: "20%",
      ...getColumnSearchProps("problem_id"),
    },
    {
      title: "제목",
      dataIndex: "problem_title",
      width: "20%",
    },
    {
      title: "티어",
      dataIndex: "problem_tier",
      width: "10%",
    },
  ];
  const [problems, setProblems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [open, setOpen] = useState(false);
  
  const [problem, setProblem] = useState("");

  useEffect(() => {
    loadProblems();
  }, [currentPage]);

  const context = useContext(UserContext);

  // 조건부 렌더링을 여기서 수행
  if (!context) {
    return <div>로딩 중...</div>;
  }

  const { user, setUser } = context;

  // TODO 이거 어케 생긴거지??...??뒤저바야될듯....하...유저인포 찾고 ,,, 유저의 문제,,, 가져오기...
  const loadProblems = () => {
    axios
      .get(`${API_URL}/group/list`)
      .then(async (response) => {
        const problemsData = response.data;
        const updatedProblems = await Promise.all(
          problemsData.map(async (group) => {
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
        setProblems(updatedProblems);
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
      console.log()
    },
  }));

  //TODO userContext 바꾸기....

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    axios
      .post(`${API_URL}/problem/insert`, {
        id: user.id,
        problem: problem
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
          나의 문제집
        </Title>
        <Button type='primary' shape='round' size={"large"} onClick={showModal}>
          GPT한테 문제 추천받기
        </Button>
      </Flex>
      <Modal
        open={open}
        title='GPT의 추천'
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        {/* TODO GPT가 문제 띄워줌... 문제 클릭하면 내 문제 목록에 추가...*/}
      </Modal>
      <Flex vertical justify='flex' align='center'>
          <Flex style={baseStyle} align='center'>
            <TextField
              style={{ width: "100%" }}
              required
              id='standard-required'
              label='백준 문제 번호'
              variant='standard'
              margin='normal'
              onChange={(e) => setProblem(e.target.value)}
            />
            <AddCircleIcon sx={{ fontSize: 50, color: "#448aff", margin:10 }} />
          </Flex>
        </Flex>
      <Table
        columns={columns}
        dataSource={problems}
        pagination={{
          pageSize: 10,
          onChange: handlePageChange, // 페이지 변경 이벤트 처리
        }}
        style={{ width: "100%", margin: "10px auto 20px 0" }}
      />
    </>
  );
};

export default ProblemPage;
