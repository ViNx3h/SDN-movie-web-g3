import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/Card";
import { message } from "antd";

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
}

interface Showtime {
  _id: string;
  movie: string;
  theater: string;
  showDate: string;
  timeSlots: TimeSlot[];
  price: number;
  availableSeats: string[];
  bookedSeats: string[];
  updatedAt: string;
}

interface Review {
  _id: string;
  user: string;
  movie: string;
  rating: number;
  comment: string;
}

const Detail = () => {
  const [data, setData] = useState<any>({});
  const params = useParams<any>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const movie_id = params.id;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/get_movie_by_id/${params.id}`
      );
      setData(response.data.data);
      console.log(response.data.data);

    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddFavList = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/${userId}/add_fav_movies/${movie_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Added to favorite movies successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.error || "Something went wrong!");
      } else {
        message.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white  pt-20  ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Movie Poster */}
        <div className="flex justify-center">

          <img src={data.posterUrl} alt={data.title} className="w-56 md:w-80" />
        </div>

        {/* Movie Details */}
        <div className="md:col-span-2 space-y-8 pl-10">
          <h1 className="text-4xl font-extrabold text-yellow-400">{data.title}</h1>
          <p className="text-lg text-gray-300">{data.description}</p>

          <div className="space-y-2">
            <p className="text-lg"><span className="font-semibold text-xl pr-4 ">Genre:</span> {data.genre?.join(" • ")}</p>
            <p className="text-lg"><span className="font-semibold text-xl pr-4 ">Director:</span> {data.director}</p>
            <p className="text-lg"><span className="font-semibold text-xl pr-4 ">Cast:</span> {data.cast?.join(" • ")}</p>
            <p className="text-lg"><span className="font-semibold text-xl pr-4 ">Duration:</span> {data.duration} minutes</p>
            <p className="text-lg"><span className="font-semibold text-xl pr-4 ">Language:</span> {data.language}</p>
            <p className="text-lg"><span className="font-semibold text-xl pr-4 ">Release Date:</span> {new Date(data.releaseDate).toLocaleDateString("en-US")}</p>
          </div>

          <div className="flex space-x-4 mt-6">
            <button onClick={() => navigate(`/booking/${data._id}`)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">
              Book Now
            </button>
            {data.trailerUrl && (
              <button onClick={() => window.open(data.trailerUrl, "_blank")}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded">
                Watch Trailer
              </button>
            )}
            <button onClick={handleAddFavList}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded">
              Favorite
            </button>
          </div>
        </div>
      </div>
      {/* Showtimes Section */}
      <div className="mt-10 max-w-full mx-auto ml-96 mr-96">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Showtimes</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {data.showtimes && data.showtimes.length > 0 ? (
            data.showtimes.map((showtime: Showtime) => (
              <div key={showtime._id} className="bg-gray-800 p-4 rounded-lg">
                <p>Show Date: {new Date(showtime.showDate).toLocaleDateString("en-US")}</p>
                <p>Price: {showtime.price.toLocaleString("en-US")}$</p>
                <p className="mt-2 font-semibold">Time Slots:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {showtime.timeSlots.map((slot) => (
                    <span key={slot._id} className="bg-yellow-400 text-black px-3 py-1 rounded">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400">No showtimes available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
