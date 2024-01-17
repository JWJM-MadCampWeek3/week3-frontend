import React, { useRef, useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Select } from "antd";
import type { SelectProps } from "antd";

const { Text, Title } = Typography;

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof DataType;

const API_URL = "http://143.248.219.4:8080";

const baseStyle: React.CSSProperties = {
  width: 400,
};

const algorithmMap = {
  implementation: "구현",
  greedy: "그리디 알고리즘",
  dfs: "DFS",
  bfs: "BFS",
  binary_search: "이진 탐색",
  dp: "다이나믹 프로그래밍",
  graphs: "그래프 이론",
  None: "상관없음",
};

const findFullName = (abbreviation) => {
  return algorithmMap[abbreviation] || abbreviation;
};

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

interface DataType {
  key: React.Key;
  problem_id: string;
  problem_title: string;
  problem_tier: string;
  problem_algorithm: string;
}

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

  const navigate = useNavigate();
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
      ...getColumnSearchProps("problem_title"),
    },
    {
      title: "티어",
      dataIndex: "problem_tier",
      width: "10%",
    },
    {
      title: "알고리즘",
      dataIndex: "problem_algorithm",
      width: "20%",
    },
    {
      title: "그룹에 추가하기",
      key: "action",
      width: "5%",
      render: (text, record) => (
        <Dropdown menu={{ items }} placement='bottomLeft'>
          <Button shape='round' size={"large"}>
            {group}
            <DownOutlined />
          </Button>
        </Dropdown>
        // <Button onClick={() => onButtonClick(record.problem_id)}>클릭</Button>
      ),
    },
  ];
  const [problems, setProblems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [isAdd, setIsAdd] = useState(false);

  const [problem, setProblem] = useState("");

  const [data, setData] = useState<SelectProps["options"]>([]);
  const [value, setValue] = useState<string>();

  const [group, setGroup] = useState<string>("default");

  useEffect(() => {
    loadProblems();
  }, [currentPage, isAdd]);

  const context = useContext(UserContext);

  // 조건부 렌더링을 여기서 수행
  if (!context) {
    return <div>로딩 중...</div>;
  }

  const { user, setUser } = context;

  console.log("user", user);

  const loadProblems = () => {
    axios
      .post(`${API_URL}/user_Info`, {
        id: user.id,
      })
      .then(async (response) => {
        const problemsData = response.data.problems;
        try {
          // problemsData의 각 problem에 대한 요청을 생성하고, 모든 요청을 Promise.all에 전달하여 동시에 실행합니다.
          const problemDetailsRequests = problemsData.map((problemId) =>
            axios.get(`${API_URL}/problem/${problemId}`)
          );

          // 모든 요청이 완료되면 각 응답으로부터 필요한 정보를 추출하여 새로운 객체 배열을 생성합니다.
          const responses = await Promise.all(problemDetailsRequests);
          const updatedProblems = responses.map((response) => {
            const problemDetails = response.data; // 가정: 응답에서 필요한 데이터가 .data에 있음
            return {
              key: problemDetails.id,
              problem_id: problemDetails.problemId,
              problem_title: problemDetails.titleKo,
              problem_tier: tier_list[problemDetails.level],
              problem_algorithm: findFullName(problemDetails.key),
            };
          });

          // 업데이트된 데이터를 상태에 저장합니다.
          setProblems(updatedProblems);
        } catch (error) {
          console.error("Error fetching problem details:", error);
        }
      })
      .catch((error) => {
        console.log("Error fetching user problems:", error);
      });
  };

  // 페이지 변경 이벤트 처리 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const items: MenuProps["items"] = user.group.map((group) => ({
    key: group,
    label: group,
    onClick: () => {
      setGroup(group)
      console.log("group",group)
    },
  }))

  //TODO userContext 바꾸기....

  const handleBjSearch = (newValue: string) => {
    setValue(newValue);
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const onAdd = () => {
    axios
      .post(`${API_URL}/user/problem/insert`, {
        id: user.id,
        problem: value,
      })
      .then((response) => {
        loadProblems();
      })
      .catch((error) => {
        console.log("Error fetching user problems:", error);
      });
    setIsAdd(!isAdd);
  };

  const onButtonClick = (problemId) => {
    // 버튼 클릭시 실행할 로직
    console.log(`버튼 클릭: 문제 ID ${problemId}`);
  };

  //TODO 로직 꼬인거 고치기
  return (
    <>
      <Flex justify='flex-end' align='center'>
        <Title level={3} style={{ width: "100%", margin: "10px auto 20px 0" }}>
          나의 문제집
        </Title>
        <Button
          type='primary'
          shape='round'
          size={"large"}
          onClick={() => {
            navigate("/problem/gpt");
          }}
        >
          GPT한테 문제 추천받기
        </Button>
      </Flex>
      <Flex justify='space-between' align='center'>
        <Input
          type='number'
          style={{ width: "91%", height: 40 }}
          placeholder='백준 아이디를 입력해주세요.'
          onChange={(e) => {
            handleBjSearch(e.target.value);
          }}
        />
        <Button size={"large"} onClick={onAdd}>
          추가하기
        </Button>
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
