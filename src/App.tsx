import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import LoginPage from "./page/loginPage.tsx";
import SignUpPage from "./page/signUpPage.tsx";
import BasicLayout from "./components/basicLayout.tsx";
import IntroPage from "./page/introPage.tsx";
import GroupPage from "./page/groupPage.tsx";
import PageNotFound from "./page/404.tsx";
import GroupAddPage from "./page/groupAddPage.tsx";
import RankPage from "./page/rankPage.tsx";
import ProblemPage from "./page/problemPage.tsx";

interface User {
  id: string;
  nickname: string;
  bj_id: string;
  tier: string;
  image: string;
  bio: string;
  group: string[];
  problems: string[];
  todo_problems: string[]
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = React.createContext<UserContextType | null>(null);

const App = () => {
  const [user, setUser] = useState({
    id: "TEST",
    nickname: "테스트",
    bj_id: "test",
    tier: "티어 없음",
    image: "./images/user.png",
    bio: "테스트입니다.",
    group: ["default"],
    problems:["로딩중"],
    todo_problems: ["로딩중"]
  });

  return (
    <>
      <div className='app'>
        <UserContext.Provider value={{ user, setUser }}>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<IntroPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/' element={<BasicLayout />}>
                  <Route path='group' element={<GroupPage />} />
                  <Route path='group/add' element={<GroupAddPage />} />
                  <Route path='rank' element={<RankPage />} />
                  <Route path='problem' element={<ProblemPage />} />
                </Route>
                <Route path='*' element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
        </UserContext.Provider>
      </div>
    </>
  );
};

export default App;
