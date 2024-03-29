import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Card, Space, Flex } from "antd";
import { UserContext } from "../App.tsx";

import { Alert } from "antd";

const API_URL = "http://143.248.219.4:8080";

const LoginPage: React.FC = () => {
  const [id, setId] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [is_fail, setIs_fail] = React.useState<boolean>(false);
  const [fail_msg, setFail_msg] = React.useState<string>("");
  const navigate = useNavigate();
  const context = useContext(UserContext);

  // 조건부 렌더링을 여기서 수행
  if (!context) {
    return <div>로딩 중...</div>;
  }

  const { setUser } = context;

  const onFinish = (values: any) => {
    console.log("Received values of form: ");
  };

  const onLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        id: id,
        password: password,
      });
      if (response.data.success) {
        const userInfo = {
          id: id,
          nickname: response.data.userinfo.nickname,
          bj_id: response.data.userinfo.bj_id,
          tier: response.data.userinfo.tier,
          image: response.data.userinfo.profileImageUrl,
          bio: response.data.userinfo.bio,
          group: response.data.userinfo.group,
          problems: response.data.userinfo.problems,
          todo_problems: response.data.userinfo.todo_problems,
        };
        // Session Storage에 사용자 정보 저장
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        // 상태 업데이트;
        setUser(userInfo);
        setIs_fail(false);
        navigate("/group?group_name=default");
      } else {
        setIs_fail(true);
        setFail_msg(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title='로그인' bordered={false} style={{ width: 400 }}>
      {is_fail ? <Alert message={fail_msg} type='error' /> : null}
      <Form
        name='normal_login'
        className='login-form'
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name='username'
          rules={[{ required: true, message: "아이디를 입력해주세요" }]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='아이디'
            onChange={(e) => setId(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='비밀번호'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            style={{
              width: "100%",
              height: "100%",
              fontSize: "15px",
              fontWeight: "bold",
            }}
            type='primary'
            htmlType='submit'
            className='login-form-button'
            onClick={onLogin}
          >
            로그인
          </Button>
          <Flex justify='flex-end' align='center'
          style={{marginTop: 10}}>
            아직 계정이 없으신가요?
            <Button type='link' onClick={() => navigate("/signup")}>
              계정 만들기
            </Button>
          </Flex>
          
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;
