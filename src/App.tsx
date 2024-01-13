import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import React, { useState, useContext } from "react";
import LoginPage from "./page/loginPage.tsx";
import SignUpPage from "./page/signUpPage.tsx";
import BasicLayout from "./components/basicLayout.tsx";
import IntroPage from "./page/introPage.tsx";

const Test1 = () => <div>Test1</div>;
const Test2 = () => <div>Test2</div>;
const Test3 = () => <div>Test3</div>;

// TODO : 유저 정보 생각 (백과 상의)
interface User {
  id: string;
  nickname: string;
  bj_id: string;
  tier: number;
  image: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}


export const UserContext = React.createContext<UserContextType | null>(null);

const App = () => {
  const [user, setUser] = useState({
    id: "",
    nickname: "",
    bj_id: "",
    tier: 0,
    image: "./images/user.png"
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
                <Route path='test1' element={<Test1 />} />
                <Route path='test2' element={<Test2 />} />
                <Route path='test3' element={<Test3 />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </div>
    </>
  );
};

export default App;
