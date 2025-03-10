import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/Card";

const Detail = () => {
  const [data, setData] = useState<any>({});
  const [genres, setGenres] = useState([]);
  const params = useParams<any>();
  console.log("params", params);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`/${params.detail}/${params.id}`);
      setData(response.data);
      setGenres(response.data.genres);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchCreditData = async () => {
    try {
      const response = await axios.get(
        `/${params.detail}/${params.id}/credits`
      );
      console.log("castData", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCreditData();
  }, []);

  // Hàm chuyển hướng đến trang đặt vé
  const handleBooking = () => {
    navigate(`/booking/${params.detail}/${params.id}`);
  };

  return (
    <div className="py-16 ml-14 mx-auto">
      <div className="flex grid mx-auto grid-cols-5 gap-5 relative overflow-hidden overflow-x-hidden">
        <div className="relative mx-auto">
          <Card className="" data={data} media_type={params.detail} />
        </div>
        <div className="border-solid border min-w-full col-span-4 p-2 flex pt-5 justify-evenly grid grid-cols-1">
          <p className="font-semibold">
            Name: {data.name} || Original name : {data.original_name}{" "}
            {data.original_title}
          </p>
          <p className="font-semibold">
            Genres:
            {genres.map((data: any, index) => (
              <span key={index}> {data.name} </span>
            ))}
          </p>
          <p className="font-semibold">
            Original country: {data.origin_country}
          </p>
          <p className="font-semibold">
            Original language: {data.original_language}
          </p>
          <p className="font-semibold">Popularity : {data.popularity}</p>
        </div>
      </div>
      <br />
      <hr />
      <div>
        <h2 className="font-bold text-xl">Overview:</h2>
        <br />
        <p>{data.overview}</p>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleBooking}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
        >
          Booking
        </button>
      </div>
    </div>
  );
};

export default Detail;