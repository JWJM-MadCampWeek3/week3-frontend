import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import React, { useState, useContext } from "react";
import LoginPage from "./page/loginPage.tsx";
import SignUpPage from "./page/signUpPage.tsx";
import BasicLayout from "./components/basicLayout.tsx";
import IntroPage from "./page/introPage.tsx";
import GroupPage from "./page/groupPage.tsx";
import PageNotFound from './page/404.tsx';

const Rank = () => <div>Rank</div>;
const Problem = () => <div>Problem</div>;

interface User {
  id: string;
  nickname: string;
  bj_id: string;
  tier: string;
  image: string;
  bio: string;
  group: string[];
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
    group: ["default"]
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
                <Route path='rank' element={<Rank />} />
                <Route path='problem' element={<Problem />} />
              </Route>
              <Route path="*" element={ <PageNotFound/> }/>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </div>
    </>
  );
};

export default App;
