import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import React, { useState } from "react";
import LoginPage from "./page/login.tsx";
import SignUpPage from "./page/signUp.tsx";
import BasicLayout from "./components/basicLayout.tsx";
import IntroPage from "./page/intro.tsx";
import Test from "./page/test.tsx";


const Test1 = () => <div>Test1</div>;
const Test2 = () => <div>Test2</div>;
const Test3 = () => <div>Test3</div>;

const userId = "oganessone718";

const getSolvedacUserData = async () => {
  try {
    let response = await fetch(`/api/v3/user/show?handle=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching data failed:", error);
    return null; // 오류 발생시 null 반환
  }
};
// ... 기존의 import들

//cors 허용해줘

const App = () => {
  const [userData, setUserData] = useState(null);

  const handleButtonClick = async () => {
    const data = await getSolvedacUserData();
    console.log(data);
    await axios.get("http://143.248.219.4:8080/");
    setUserData(data);
    let response = await axios.post("http://143.248.219.4:8080/", {
      data: data,
    });
  };

  return (
    <>
      <div className='app'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<IntroPage />} />
            <Route path='/signup' element={<SignUpPage />} /> 
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={<BasicLayout />}>
              <Route path='test1' element={<Test1 />} />
              <Route path='test2' element={<Test2 />} />
              <Route path='test3' element={<Test3 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
