import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useParams, useSearchParams } from "react-router-dom";
import Card from "../Components/Card";
import '../index.css';

const Explore = () => {
    const [data, setData] = useState<any[]>([]);
    const [totalPageNo, setTotalPageNo] = useState(0);
    const params = useParams();
    // const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get the current page from the URL query, default to 1 if not present
    const pageNo = parseInt(searchParams.get("page") || "1", 10);

    // Fetch data based on the current page number
    const fetchData = async () => {
        try {
            const response = await axios.get(`/discover/${params.detail}`, {
                params: {
                    page: pageNo
                }
            });
            setData(response.data.results);
            setTotalPageNo(response.data.total_pages);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageNo, params.detail]);

    const handlePageChange = (selectedPage: any) => {
        // Update the page number in the URL
        const newPageNo = selectedPage.selected + 1;
        setSearchParams({ page: newPageNo.toString() });
    };

    return (
        <div className="py-16">
            <div className="container mx-auto">
                <h3 className="capitalize text-lg lg:text-xl font-semibold my-3">Popular {params.detail} show</h3>
                <div className="grid grid-cols-[repeat(auto-fit,220px)] gap-4 justify-center lg:justify-start">
                    {
                        data.map((detail: any, index) => (
                            <Card data={detail} index={index + 1} media_type={params.detail} key={index} />
                        ))
                    }
                </div>

                <ReactPaginate
                    className="flex text-white gap-3 justify-center mt-5 pagination-container text-sm 
                    "
                    pageCount={totalPageNo}
                    onPageChange={handlePageChange}
                    forcePage={pageNo - 1} // React Paginate is 0-indexed, so subtract 1
                    breakLabel={"..."}
                    previousLabel={"<<"}
                    nextLabel={">>"}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item prev"
                    previousLinkClassName="page-link"
                    nextClassName="page-item next"
                    nextLinkClassName="page-link"
                    breakClassName="page-item break"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active "
                    disabledClassName="disabled"

                />
            </div>
        </div>
    );
}

export default Explore;
