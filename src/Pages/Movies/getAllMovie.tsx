import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

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
    // add other showtime fields if needed
  }>;
  reviews: Array<{
    _id: string;
    // add other review fields if needed
  }>;
}

const GetAllMovie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/get_all/movies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response data:", response.data);
      setMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      message.error("Unable to load movie list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="py-16">
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mt-4 mb-8"></h1>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : movies && movies.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden">

                  <button onClick={() => navigate(`/movie/${movie._id}`)}>
                    {/* Poster */}
                    <div className="relative">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-[300px] object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded">
                        ★ {movie.rating}/10
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4">
                      <div className="relative group">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                          {movie.title}
                        </h3>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm  py-1 rounded shadow-lg">
                          {movie.title}
                        </div>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {movie.genre.map((g, index) => (
                          <span
                            key={index}
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Basic Info */}
                      <div className="text-gray-300 text-sm space-y-1 text-left">
                        <p>
                          Release Date:{" "}
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </p>
                        <p>Showtimes: {movie.showtimes?.length || 0}</p>
                      </div>

                      <div className="mt-3 text-left">
                        <p className="text-gray-400 text-sm">Description:</p>
                        {movie.description ? (
                          <p className="text-white text-sm line-clamp-2">{movie.description}</p>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No description available</p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>


          ) : (
            <div className="text-white text-center">No movies available</div>
          )}
        </div>
      </div>
    </div >
  );
};

export default GetAllMovie;
