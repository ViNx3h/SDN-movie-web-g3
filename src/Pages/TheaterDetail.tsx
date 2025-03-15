import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Spin, message } from "antd";
import { getTheaterDetails } from "../service/apiTheater";

interface Movie {
    _id: string;
    title: string;
    posterUrl: string;
}

interface Showtime {
    _id: string;
    movie: Movie;
    showDate: string;
    timeSlots: { startTime: string; endTime: string }[];
    price: number;
}

interface Theater {
    _id: string;
    name: string;
    phone: string;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
    facilities: string[];
    showtimes: Showtime[];
}

const TheaterDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [theater, setTheater] = useState<Theater | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTheaterDetails = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const response = await getTheaterDetails(token, id!);
                setTheater(response);
            } catch (error) {
                message.error("Failed to load theater details.");
            } finally {
                setLoading(false);
            }
        };
        fetchTheaterDetails();
    }, [id]);

    if (loading) return <Spin className="flex justify-center mt-20" />;

    const columns = [
        {
            title: "Movie",
            dataIndex: "movie",
            key: "movie",
            render: (movie: Movie) => (
                <div className="flex items-center">
                    <img src={movie.posterUrl} alt={movie.title} className="w-12 h-18 object-cover rounded mr-2" />
                    <span>{movie.title}</span>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "showDate",
            key: "showDate",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Time Slots",
            dataIndex: "timeSlots",
            key: "timeSlots",
            render: (slots: { startTime: string; endTime: string }[]) =>
                slots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(", "),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `${price.toLocaleString()} VND`,
        },
    ];

    return (
        <div className="pt-20 px-4">
            {theater && (
                <Card title={theater.name} className="shadow-lg rounded-lg border border-gray-200 bg-white">
                    <p><strong>Phone:</strong> {theater.phone}</p>
                    <p><strong>Address:</strong> {`${theater.location.address}, ${theater.location.city}, ${theater.location.state}`}</p>
                    <p><strong>Facilities:</strong> {theater.facilities.join(", ")}</p>

                    <h2 className="mt-4 font-bold text-lg">Showtimes</h2>
                    <Table
                        dataSource={theater.showtimes}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }}
                        bordered
                    />
                </Card>
            )}
        </div>
    );
};

export default TheaterDetails;
