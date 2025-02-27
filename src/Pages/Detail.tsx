
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../Components/Card";


const Detail = () => {
    const [data, setData] = useState<any>({});
    const [genres, setGenres] = useState([]);
    const params = useParams<any>();

    const fetchData = async () => {
        try {
            const response = await axios.get(`/${params.detail}/${params.id}`)
            setData(response.data)
            setGenres(response.data.genres)
        } catch (error) {
            console.log("error", error)
        }
    }

    const fetchCreditData = async () => {
        try {
            const response = await axios.get(`/${params.detail}/${params.id}/credits`)
            console.log("castData", response.data)
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchData();
        fetchCreditData();
    }, [])

    return (
        <div className=" py-16 ml-14 mx-auto">
            <div className=" flex grid mx-auto grid-cols-5 gap-5 relative overflow-hidden overflow-x-hidden">
                <div className="relative mx-auto">
                    <Card className="" data={data} media_type={params.detail} />

                </div>
                <div className="border-solid border min-w-full col-span-4 p-2 flex pt-5 justify-evenly grid grid-cols-1">
                    <p className="font-semibold">Name: {data.name} || Original name : {data.original_name} {data.original_title}</p>
                    <p className="font-semibold"> Genres:
                        {
                            genres.map((data: any) => {
                                return (
                                    <>
                                        {data.name}
                                    </>
                                )
                            })
                        }
                    </p>
                    <p className="font-semibold">Original country: {data.origin_country}</p>
                    <p className="font-semibold">Original language: {data.original_language}</p>
                    <p className="font-semibold">Popularity : {data.popularity}</p>
                </div>
            </div>
            <br />
            <hr />
            <div>
                <h2 className="font-bold text-xl">Over view:</h2>
                <br />
                <p>{data.overview}</p>
            </div>
            <div className="flex gap-4 mt-2">
            </div>
        </div>
    )
}

export default Detail