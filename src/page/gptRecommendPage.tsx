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
import { Button, Input, Space, Table, Modal, Flex, Dropdown, Card } from "antd";
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

const algorithmMap = {
  "implementation": "구현",
  "greedy": "그리디 알고리즘",
  "dfs": "DFS",
  "bfs": "BFS",
  "binary_search": "이진 탐색",
  "dp": "다이나믹 프로그래밍",
  "graphs": "그래프 이론",
  "None": "상관없음"
};

const findFullName = (abbreviation) => {
  return algorithmMap[abbreviation] || "알 수 없는 알고리즘";
};

const options: SelectProps["options"] = [
  { label: "구현", value: "implementation" },
  { label: "그리디 알고리즘", value: "greedy" },
  { label: "DFS", value: "dfs" },
  { label: "BFS", value: "bfs" },
  { label: "이진 탐색", value: "binary_search" },
  { label: "다이나믹 프로그래밍", value: "dp" },
  { label: "그래프 이론", value: "graphs" },
  { label: "상관없음", value: "None" },
];

const API_URL = "http://143.248.219.4:8080";

const baseStyle: React.CSSProperties = {
  width: 400,
};

interface DataType {
  key: React.Key;
  problem_id: string;
  problem_title: string;
  problem_tier: string;
  problem_algorithm: string;
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

const GptRecommendPage: React.FC = () => {
  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
    if (value.includes("None")) {
      setIsNone(true);
      value = ["None"];
    } else {
      setIsNone(false);
    }
    setKeys(value);
  };

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
      width: "10%",
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
    {
      title: "알고리즘",
      dataIndex: "problem_algorithm",
      width: "10%",
    },
    {
      title: "나의 문제에",
      dataIndex: "problem_algorithm",
      width: "10%",
      render: (text, record) => {
        return (
          <Button
          onClick={() => {
            axios
              .post(`${API_URL}/user/problem/insert`, {
                id: user.id,
                problem: (record.problem_id.toString()),
              })
              .then((response) => {
                setUser({
                  ...user,
                  problems: [...user.problems, problem],
                });
              });
          }}
            shape='round'
            size={"large"}
          >
            추가
          </Button>
        );
      },
    },
  ];
  const [problems, setProblems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [open, setOpen] = useState(false);

  const [problem, setProblem] = useState("");
  const [keys, setKeys] = useState<string[]>(["None"]);

  const [isNone, setIsNone] = useState<boolean>(false);

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
  const loadProblems = () => {};

  // 페이지 변경 이벤트 처리 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const items: MenuProps["items"] = tier_list.map((tier, index) => ({
    label: tier,
    key: index,
    onClick: () => {
      // Redirect to the selected group when an item is clicked
      console.log();
    },
  }));

  const onRecommend = () => {
    if (keys.includes("None")) {
      setKeys([
        "implemntation",
        "greedy",
        "dfs",
        "bfs",
        "binary_search",
        "dp",
        "graphs",
      ]);
      axios
        .post(`${API_URL}/recommend/list`, {
          tier: user.tier,
          keys: [
            "implemntation",
            "greedy",
            "dfs",
            "bfs",
            "binary_search",
            "dp",
            "graphs",
          ],
        })
        .then((response) => {
          const problemsData = response.data.problems
          const updatedProblems = problemsData.map((problem) => (
            {
            key: problem.id,
            problem_id: problem.problemId,
            problem_title: problem.titleKo,
            problem_tier: tier_list[problem.level],
            problem_algorithm: findFullName(problem.key),
          }));
          setProblems(updatedProblems);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post(`${API_URL}/recommend/list`, {
          tier: user.tier,
          keys: keys,
        })
        .then((response) => {
          const problemsData = response.data.problems
          const updatedProblems = problemsData.map((problem) => (
            {
            key: problem.id,
            problem_id: problem.problemId,
            problem_title: problem.titleKo,
            problem_tier: tier_list[problem.level],
            problem_algorithm: findFullName(problem.key),
          }));
          setProblems(updatedProblems);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //TODO userContext 바꾸기...

  //TODO 로직 꼬인거 고치기
  return (
    <>
      <Flex justify='flex-end' align='center'>
        <Title level={3} style={{ width: "100%", margin: "10px auto 20px 0" }}>
          추천 문제집
        </Title>
      </Flex>
      <Card style={{ width: "100%" }}>
        <Flex justify='space-between' align='center'>
          <Text>문제 유형 선택</Text>
          {isNone ? (
            <Select
              mode='multiple'
              allowClear
              size='large'
              style={{ width: "70%" }}
              placeholder='Please select'
              value={["None"]}
              onChange={handleChange}
              options={options}
            />
          ) : (
            <Select
              mode='multiple'
              allowClear
              size='large'
              style={{ width: "70%" }}
              placeholder='Please select'
              defaultValue={["None"]}
              onChange={handleChange}
              options={options}
            />
          )}
          <Button
            type='primary'
            shape='round'
            size={"large"}
            onClick={onRecommend}
          >
            추천 받기
          </Button>
        </Flex>
      </Card>

      <Table
        columns={columns}
        dataSource={problems}
        pagination={{
          pageSize: 9,
          onChange: handlePageChange, // 페이지 변경 이벤트 처리
        }}
        style={{ width: "100%", margin: "10px auto 20px 0" }}
      />
    </>
  );
};

export default GptRecommendPage;
