import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setImageURL } from "../store/MovieSlice";

interface MovieDBState {
    movieDBData: {
        bannerData: Array<{ backdrop_path: string; title?: string; name?: string; overview: string; vote_average: number; popularity: number; poster_path: string }>;
        imageURL: string;
    };
}


const Card = ({ data, index, media_type }: any) => {
    const trending = false;
    const dispatch = useDispatch();

    const fetchConfiguration = async () => {
        try {
            const response = await axios.get('/configuration')

            dispatch(setImageURL(response.data.images.secure_base_url + "original"))

            // console.log("response", response.data.images.secure_base_url + "original")
        } catch (error) {
            console.log("error", error);
        }
    }
    useEffect(() => {

        fetchConfiguration();
    }, [])

    const mediaType = data.media_type ?? media_type

    const imageURL = useSelector((state: MovieDBState) => state.movieDBData.imageURL)



    // console.log("data", data)
    return (
        <Link to={'/' + mediaType + '/' + data.id} className="w-full min-w-[220px] max-w-[220px] h-80 overflow-hidden rounded relative hover:scale-105 transition-all">

            {
                (data?.poster_path || data?.backdrop_path) ? (
                    < img
                        src={(imageURL + data?.poster_path) || (imageURL + data?.backdrop_path)}

                    />
                ) : (
                    <div className=" bg-neutral-700 min-h-[270px] text-xl flex text-white text-center justify-center items-center">
                        No image found
                    </div>
                )


            }
            <div className="absolute top-4">
                {
                    trending && (
                        <div className="py-1 px-4 bg-black backdrop-blur-3xl ">
                            #{index} Trending
                        </div>
                    )
                }

            </div>
            <div className="absolute bottom-0 h-14 backdrop-blur-3xl w-full bg-neutral-600/40 p-2">
                <h2 className="text-ellipsis line-clamp-1 font-semibold">{data?.title || data?.name}</h2>
                <div className="text-sm text-neutral-400 justify-between flex relative">
                    <p className="relative">{data?.release_date || data?.first_air_date}</p>
                    <p className="bg-neutral-700 px-1 rounded-full text-white">Rating: {Number(data?.vote_average).toFixed(1)}</p>
                </div>
            </div>


        </Link>
    )
}

export default Card