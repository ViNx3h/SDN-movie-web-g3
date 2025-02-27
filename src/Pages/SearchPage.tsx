import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../Components/Card";

const SearchPage = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const location = useLocation();

    const fetchData = async () => {
        const query = location?.search?.slice(3) || '';
        try {
            const response = await axios.get(`search/multi`, {
                params: {
                    query,
                    page: 1
                }
            });
            setData(response.data.results);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        setPage(1);
        setData([]);
        fetchData();
    }, [location.search]);

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setPage(preve => preve + 1)
        }
    }

    useEffect(() => {
        fetchData();

    }, [page])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, [])

    // console.log("searchData", data);


    return (
        <div className="py-16">
            <div className="container mx-auto">
                <h2 className="capitalize text-lg lg:text-xl font-semibold my-3 text-center p-5">Search results</h2>
                <div className="grid grid-cols-[repeat(auto-fit,220px)] gap-4 justify-center">
                    {data.length > 0 ? (
                        data.map((searchData: any, index) => (
                            <>
                                <Card data={searchData} index={index + 1} media_type={searchData.media_type} key={index} />
                            </>
                        ))
                    ) : (
                        <p className="text-center">No results found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
