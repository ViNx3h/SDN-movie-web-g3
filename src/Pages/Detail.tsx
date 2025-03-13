import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/Card";

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
  const username = localStorage.getItem("email");
  console.log("user", username);
  
  const movie_id= params.id
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/get_movie_by_id/${params.id}`);
      setData(response.data.data);
      console.log("data", response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddFavList = async (username : any, movie_id : any) => {
      try {
        const response = await axios.post(`http://localhost:5000/api/auth/${username}/add_fav_movies/${movie_id}`)
        console.log("response", response);
        
      } catch (error) {
        console.log("error", error);
        
      }
      
  }

  useEffect(() => {
    fetchData();
  }, [params.id]);

  return (
    <div className="py-16 ml-14 mx-auto">
      <div className="flex grid mx-auto grid-cols-5 gap-5 relative overflow-hidden">
        <div className="relative mx-auto">
          <Card className="" data={data} media_type={params.detail} />
        </div>
        <div className="border-solid border min-w-full col-span-4 p-6 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

          <div className="space-y-3">
            <p className="font-semibold">
              Thể loại: <span className="font-normal">{data.genre?.join(' • ')}</span>
            </p>

            <p className="font-semibold">
              Đạo diễn: <span className="font-normal">{data.director}</span>
            </p>

            <p className="font-semibold">
              Diễn viên: <span className="font-normal">{data.cast?.join(' • ')}</span>
            </p>

            <p className="font-semibold">
              Thời lượng: <span className="font-normal">{data.duration} phút</span>
            </p>

            <p className="font-semibold">
              Ngôn ngữ: <span className="font-normal">{data.language}</span>
            </p>

            <p className="font-semibold">
              Ngày khởi chiếu: <span className="font-normal">
                {new Date(data.releaseDate).toLocaleDateString('vi-VN')}
              </span>
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate(`/booking/${data._id}`)}
                className="bg-red-500 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition duration-300"
              >
                Đặt vé ngay
              </button>
              {data.trailerUrl && (
                <button
                  onClick={() => window.open(data.trailerUrl, '_blank')}
                  className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-800 transition duration-300"
                >
                  Xem trailer
                </button>
              )}
              <button onClick={() => handleAddFavList(username, movie_id)}>
                FavList
              </button>
            </div>



          </div>



        </div>


      </div>
      <p className="font-semibold">
        Đánh giá: <span className="font-normal text-yellow-500">★ {data.rating}/10</span>
      </p>

      <div className="mt-4">
        <h2 className="font-bold text-xl mb-2">Mô tả:</h2>
        <p className="text-gray-700">{data.description}</p>
      </div>

      {/* Showtimes Section */}
      {data.showtimes && data.showtimes.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold text-xl mb-2">Lịch chiếu:</h2>
          {data.showtimes.map((showtime: Showtime) => (
            <div key={showtime._id} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p>Ngày chiếu: {new Date(showtime.showDate).toLocaleDateString('vi-VN')}</p>
              <p>Giá vé: {showtime.price.toLocaleString('vi-VN')}đ</p>
              <div className="mt-2">
                <p className="font-semibold">Giờ chiếu:</p>
                {showtime.timeSlots.map((slot) => (
                  <span key={slot._id} className="inline-block bg-white px-3 py-1 rounded mr-2 mt-1">
                    {slot.startTime} - {slot.endTime}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Section */}
      {data.reviews && data.reviews.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold text-xl mb-2">Đánh giá:</h2>
          {data.reviews.map((review: Review) => (
            <div key={review._id} className="bg-gray-100 p-4 rounded-lg mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">★ {review.rating}</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">{review.comment}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Detail;