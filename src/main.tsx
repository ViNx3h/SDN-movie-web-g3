<<<<<<< HEAD
import axios from "axios";
=======
import axios from 'axios';
>>>>>>> 58c1a6a7b35b47e8e6e85957fc1678738c3b1820
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
import Booking from "./Pages/Booking.tsx";

<<<<<<< HEAD
axios.defaults.baseURL = "https://api.themoviedb.org/3/";
axios.defaults.headers.common["Authorization"] = `Bearer ${
  import.meta.env.VITE_APP_ACCESS_TOKEN
}`;
=======
import SignIn from './Pages/SignIn.jsx';


axios.defaults.baseURL = 'https://api.themoviedb.org/3/'
axios.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_APP_ACCESS_TOKEN}`
>>>>>>> 58c1a6a7b35b47e8e6e85957fc1678738c3b1820

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <div className=" pb-14 lg:pb-0">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/list/:id" element={<List />}></Route>
            <Route path=":detail" element={<Explore />}></Route>
            <Route path=":detail/:id" element={<Detail />}></Route>
<<<<<<< HEAD
            <Route path="/search" element={<SearchPage />}></Route>
            <Route
              path="/booking/:detail/:id"
              element={<Booking />}
            ></Route>{" "}
            {/* Thêm tuyến đường Booking */}
=======
            {/* <Route path="/search" element={<SearchPage />}></Route> */}
            
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>

>>>>>>> 58c1a6a7b35b47e8e6e85957fc1678738c3b1820
          </Routes>
          <Footer />
          <MobileNavigation />
        </BrowserRouter>
      </div>
    </Provider>
  </React.StrictMode>
);
