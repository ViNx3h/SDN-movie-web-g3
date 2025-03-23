
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
import GetFavList from "./Pages/Movies/getFavList.tsx";
import SignUp from "./Pages/SignUp.tsx";
// import SearchPage from "./Pages/SearchPage.tsx";

import Booking from "./Pages/Booking.tsx";
import SearchPage from "./Pages/SearchPage.tsx";
import SignIn from './Pages/SignIn.jsx';
import { store } from "./store/store.tsx";
import Theaters from "./Pages/Theaters.tsx";
import GetAllMovie from "./Pages/Movies/GetAllMovie.tsx";
import TheaterDetail from "./Pages/TheaterDetail.tsx";
import ProfilePage from "./Pages/Profile.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <div className=" pb-14 lg:pb-0">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/list/fav_list" element={<GetFavList />}></Route>
            <Route path=":detail" element={<Explore />}></Route>
            <Route path=":movie/:id" element={<Detail />}></Route>
            <Route path="/search" element={<SearchPage />}></Route>
            <Route
              path="/booking/:detail/:id"
              element={<Booking />}
            ></Route>{" "}
            {/* Thêm tuyến đường Booking */}
            {/* <Route path="/search" element={<SearchPage />}></Route> */}
            <Route path="/theaters" element={<Theaters />}></Route>
            <Route path="/theater/:id" element={<TheaterDetail />}></Route>

            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/movies" element={<GetAllMovie />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <Footer />
          <MobileNavigation />
        </BrowserRouter>
      </div>
    </Provider>
  </React.StrictMode>
);