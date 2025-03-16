import { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

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
        // thêm các field khác của showtime nếu cần
    }>;
    reviews: Array<{
        _id: string;
        // thêm các field khác của review nếu cần
    }>;
}

const GetAllMovie = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const username = localStorage.getItem("email");
    const fetchMovies = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/auth/user/get_fav_movies/${username}`,
               {
                   headers: {
                       'Authorization': `Bearer ${token}`
                   }
               }
            );
            console.log('Response data:', response.data);
            setMovies(response.data.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            message.error('Không thể tải danh sách phim');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Danh sách phim</h1>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : movies && movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden">
                                {/* Poster */}
                                <div className="relative">
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-full h-[400px] object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded">
                                        ★ {movie.rating}/10
                                    </div>
                                </div>

                                {/* Movie Info */}
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>

                                    {/* Genres */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {movie.genre.map((g, index) => (
                                            <span key={index} className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                                {g}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Basic Info */}
                                    <div className="text-gray-300 text-sm space-y-1">
                                        <p>Đạo diễn: {movie.director}</p>
                                        <p>Thời lượng: {movie.duration} phút</p>
                                        <p>Ngôn ngữ: {movie.language}</p>
                                        <p>Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                                        <p>Số suất chiếu: {movie.showtimes?.length || 0}</p>
                                        <p>Số đánh giá: {movie.reviews?.length || 0}</p>
                                    </div>

                                    {/* Cast */}
                                    <div className="mt-3">
                                        <p className="text-gray-400 text-sm">Diễn viên:</p>
                                        <p className="text-white text-sm">{movie.cast.join(', ')}</p>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-3">
                                        <p className="text-gray-400 text-sm">Mô tả:</p>
                                        <p className="text-white text-sm line-clamp-3">{movie.description}</p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/movie/${movie._id}`)}
                                            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                                        >
                                            Chi tiết
                                        </button>
                                        {movie.showtimes && movie.showtimes.length > 0 && (
                                            <button
                                                onClick={() => navigate(`/booking/${movie._id}`)}
                                                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                                            >
                                                Đặt vé
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-white text-center">Không có phim nào</div>
                )}
            </div>
        </div>
    );
};

export default GetAllMovie;