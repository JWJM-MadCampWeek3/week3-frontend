import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Flex, Alert } from "antd";
import TextField from "@mui/material/TextField";

const baseStyle: React.CSSProperties = {
  width: 350,
};

const API_URL = "http://143.248.219.4:8080";

const SignUp: React.FC = () => {

  const navigate = useNavigate();

  const [id, setId] = React.useState<string>("");
  const [id_vaild, setId_vaild] = React.useState<boolean>(false);
  const [nickname, setNickname] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [password_check, setPassword_check] = React.useState<string>("");
  const [bj_id, setBj_id] = React.useState<string>("");
  const [bj_id_check, setBj_id_check] = React.useState<boolean>(false);

  const [is_error, setIs_error] = React.useState<boolean>(false);
  const [error_msg, setError_msg] = React.useState<string>("");
  const [is_valid, setIs_valid] = React.useState<boolean>(false);
  const [valid_msg, setValid_msg] = React.useState<string>("");

  const onSignUp = async () => {
    if(id === ""){
      setError_msg("아이디를 입력해주세요.");
      setIs_error(true);
      return;
    }else if(!id_vaild){
      setError_msg("아이디 중복 검사를 해주세요.");
      setIs_error(true);
      return;
    }else if(nickname === ""){
      setError_msg("닉네임을 입력해주세요.");
      setIs_error(true);
      return;
    }else if(password === ""){
      setError_msg("비밀번호를 입력해주세요.");
      setIs_error(true);
      return;
    }else if(password_check === ""){
      setError_msg("비밀번호를 확인해주세요.");
      setIs_error(true);
      return;
    }else if(password !== password_check){
      setError_msg("비밀번호가 일치하지 않습니다.");
      setIs_error(true);
      return;
    }else if(bj_id === ""){
      setError_msg("백준 아이디를 입력해주세요.");
      setIs_error(true);
      return;
    }else if(!bj_id_check){
      setError_msg("백준 아이디 중복 검사를 해주세요.");
      setIs_error(true);
      return;
    }
    await axios.post(`${API_URL}/signup`, {
      id: id,
      nickname: nickname,
      password: password,
      bj_id: bj_id,
    }).then((res) => {
      navigate("/login");
    }).catch((err) => {
      console.log(err);
    });

  };

  const onIdCheck = async () => {
    if (id === "") {
      setError_msg("아이디를 입력해주세요.");
      setIs_error(true);
      return;
    }
    await axios
      .post(`${API_URL}/signup_id`, {
        id: id,
      })
      .then((res) => {
        console.log(res.data);
        setId_vaild(!res.data.exist)
        !res.data.exist ? setIs_error(false) : setIs_error(true);
        !res.data.exist ? setIs_valid(true) : setIs_valid(false);
        !res.data.exist
          ? setError_msg("")
          : setError_msg("이미 존재하는 아이디입니다.");
          !res.data.exist
            ? setValid_msg("가능한 아이디입니다.")
            : setValid_msg("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onBjIdCheck = async () => {
    if (bj_id === "") {
      setError_msg("백준 아이디를 입력해주세요.");
      setIs_error(true);
      setBj_id_check(false);
      return;
    }
    await axios
      .post(`${API_URL}/signup_bj_id`,
      {
        bj_id: bj_id,
      })
      .then((res) => {
        setBj_id_check(true);
        res.data.exist ? setIs_error(false) : setIs_error(true);
        res.data.exist ? setIs_valid(true) : setIs_valid(false);
        res.data.exist
          ? setError_msg("")
          : setError_msg("존재하지 않는 백준 아이디입니다.");
          res.data.exist
            ? setValid_msg("가능한 백준 아이디입니다.")
            : setValid_msg("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Card title='회원가입' bordered={false} style={{ width: 400 }}>
      {is_error ? <Alert message={error_msg} type='error' showIcon /> : <></>}
      {is_valid ? <Alert message={valid_msg} type="success" showIcon /> : <></>}
      <Flex style={baseStyle} justify='space-between' align='center'>
        <TextField
          style={{ width: 250 }}
          required
          id='standard-required'
          label='아이디'
          variant='standard'
          margin='normal'
          onChange={(e) => setId(e.target.value)}
        />
        <Button onClick={onIdCheck}>중복 검사</Button>
      </Flex>
      <Flex style={baseStyle} justify='space-between' align='center'>
        <TextField
          style={{ width: 350 }}
          required
          id='standard-required'
          label='닉네임'
          variant='standard'
          margin='normal'
          onChange={(e) => setNickname(e.target.value)}
        />
      </Flex>
      <Flex style={baseStyle} justify='space-between' align='center'>
        <TextField
          style={{ width: 350 }}
          required
          type='password'
          id='standard-required'
          label='비밀번호'
          variant='standard'
          margin='normal'
          onChange={(e) => setPassword(e.target.value)}
          helperText="가급적 실제로 사용하지 않는 비밀번호를 입력해주세요."
        />
      </Flex>

      <Flex style={baseStyle} justify='space-between' align='center'>
        <TextField
          {...((password !== password_check)&&(password_check !== ''))
            ? { error: true, helperText: "비밀번호가 일치하지 않습니다." }
            : {}}
          style={{ width: 350 }}
          required
          type='password'
          id='standard-required'
          label='비밀번호 확인'
          variant='standard'
          margin='normal'
          onChange={(e) => setPassword_check(e.target.value)}
        />
      </Flex>
      <Flex style={baseStyle} justify='space-between' align='center'>
        <TextField
          style={{ width: 250 }}
          // error
          required
          id='standard-required'
          label='백준 아이디'
          variant='standard'
          margin='normal'
          onChange={(e) => setBj_id(e.target.value)}
        />
        <Button onClick={onBjIdCheck}>유효 검사</Button>
      </Flex>

      <Button onClick={onSignUp}> 가입하기</Button>
    </Card>
  );
};

export default SignUp;
