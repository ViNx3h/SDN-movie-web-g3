import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

interface Movie {
  _id: string;
  title: string;
  description: string;
  director: string;
  cast: string[];
  genre: string[];
  duration: number;
  rating: number;
  language: string;
  posterUrl: string;
  trailerUrl: string;
  releaseDate: string;
  showtimes: Array<{
    _id: string;
    movie: string;
  }>;
  reviews: Array<{
    _id: string;
  }>;
}

const GetFavList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams<any>();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchMovies = async () => {
    if (!token) {
      message.error("You need to sign in to view your favorite movies.");
      navigate("/signin");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/user/get_fav_movies/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleRemoveFavList = async (movieId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/${userId}/remove_fav_movie/${movieId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Movie removed from favorites!") {
        message.success("Movie removed from favorites!");
        fetchMovies();
      } else {
        message.warning("Error removing movie.");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-28">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Favorite Movies</h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-[400px] object-cover" />
                  <div className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded">★ {movie.rating}/10</div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {movie.genre.map((g, index) => (
                      <span key={index} className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{g}</span>
                    ))}
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Director: {movie.director}</p>
                    <p>Duration: {movie.duration} minutes</p>
                    <p>Language: {movie.language}</p>
                    <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                    <p>Showtimes: {movie.showtimes?.length || 0}</p>
                    <p>Reviews: {movie.reviews?.length || 0}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-400 text-sm">Cast:</p>
                    <p className="text-white text-sm">{movie.cast.join(", ")}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-400 text-sm">Description:</p>
                    <p className="text-white text-sm line-clamp-3">{movie.description}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => navigate(`/movie/${movie._id}`)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">Details</button>
                    {movie.showtimes.length > 0 && (
                      <button onClick={() => navigate(`/booking/${movie._id}`)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">Book Ticket</button>
                    )}
                    <button onClick={() => handleRemoveFavList(movie._id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white text-center">No favorite movies available</div>
        )}
      </div>
    </div>
  );
};

export default GetFavList;
