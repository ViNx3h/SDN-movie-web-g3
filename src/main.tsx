import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import Footer from "./Components/Footer.tsx";
import Header from "./Components/Header.tsx";
import MobileNavigation from "./Components/MobileNavigation.tsx";
import "./index.css";
import Detail from "./Pages/Detail.tsx";
import Explore from "./Pages/Explore.tsx";
import List from "./Pages/List.tsx";
import SignUp from "./Pages/SignUp.tsx";
// import SearchPage from "./Pages/SearchPage.tsx";

import { store } from "./store/store.tsx";

import SignIn from './Pages/SignIn.jsx';


axios.defaults.baseURL = 'https://api.themoviedb.org/3/'
axios.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_APP_ACCESS_TOKEN}`

ReactDOM.createRoot(document.getElementById("root")!).render(

  <React.StrictMode>
    <Provider store={store} >
      <div className=" pb-14 lg:pb-0">
        <BrowserRouter>

          <Header />
          <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/list/:id" element={<List />}></Route>
            <Route path=":detail" element={<Explore />}></Route>
            <Route path=":detail/:id" element={<Detail />}></Route>
            {/* <Route path="/search" element={<SearchPage />}></Route> */}
            
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>

          </Routes>
          <Footer />
          <MobileNavigation />
        </BrowserRouter>
      </div>
    </Provider>
  </React.StrictMode>
);
