


import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BannerHome from "./Components/BannerHome";
import HorizontalScroll from "./Components/HorizontalScroll";
import { setBannerData, setImageURL } from "./store/MovieSlice";

// const client = generateClient<Schema>();

interface MovieDBState {
  movieDBData: {
    bannerData: Array<{ backdrop_path: string; title?: string; name?: string; overview: string; vote_average: number; popularity: number; poster_path: string }>;
    imageURL: string;
  };
}

function App() {
  const trendingData = useSelector((state: MovieDBState) => state.movieDBData.bannerData);
  const [nowPlaydingData, setNowPlayingData] = useState([]);
  const [topRated, setTopRated] = useState([]);

  const dispatch = useDispatch();

  const fetchingTopRatedData = async () => {
    try {
      const response = await axios.get('/movie/top_rated')
      setTopRated(response.data.results)
      // console.log(response.data.results)
    } catch (error) {

    }
  }

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get('/trending/all/day');

      dispatch(setBannerData(response.data.results))

      // console.log("response", response.data.results)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchConfiguration = async () => {
    try {
      const response = await axios.get('/configuration')

      dispatch(setImageURL(response.data.images.secure_base_url + "original"))

      // console.log("response", response.data.images.secure_base_url + "original")
    } catch (error) {
      console.log("error", error);
    }
  }





  const fetchingNowPlayingData = async () => {
    try {
      const response = await axios.get('/movie/now_playing');
      setNowPlayingData(response.data.results)
      // console.log(response.data.results)
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
    fetchingNowPlayingData();
    fetchingTopRatedData();
  }, [])

  return (

    <div>
      <BannerHome />
      <HorizontalScroll data={trendingData} heading="Trending" trending={true} media_type="" />
      <HorizontalScroll data={nowPlaydingData} heading="Now Playing" trending={true} media_type={"movie"} />
      <HorizontalScroll data={topRated} heading="Top Rated" trending={true} media_type="movie" />
    </div>
  );
}

export default App;
