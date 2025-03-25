import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Spin, message, Typography } from "antd";
import { getTheaterDetails } from "../service/apiTheater";

const { Title, Text } = Typography;

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
    const navigate = useNavigate();

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
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-14 h-20 object-cover rounded-lg shadow-md mr-3"
                    />
                    <span className="font-semibold">{movie.title}</span>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "showDate",
            key: "showDate",
            render: (date: string) => <Text>{new Date(date).toLocaleDateString()}</Text>,
        },
        {
            title: "Time Slots",
            dataIndex: "timeSlots",
            key: "timeSlots",
            render: (slots: { startTime: string; endTime: string }[]) =>
                slots.map(slot => (
                    <div key={slot.startTime} className="bg-gray-100 rounded-md px-2 py-1 inline-block mr-1">
                        {slot.startTime} - {slot.endTime}
                    </div>
                )),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => <Text className="font-bold text-red-600">{price.toLocaleString()} VND</Text>,
        },
    ];

    return (
        <div className="pt-20 px-6 max-w-5xl mx-auto">
            {theater && (
                <Card
                    title={<Title level={3} className="mb-0">{theater.name}</Title>}
                    className="shadow-lg rounded-lg border border-gray-200 bg-white"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Text strong>📞 Phone:</Text> <Text>{theater.phone}</Text>
                        </div>
                        <div>
                            <Text strong>📍 Address:</Text> 
                            <Text>{`${theater.location.address}, ${theater.location.city}, ${theater.location.state}`}</Text>
                        </div>
                        <div className="col-span-2">
                            <Text strong>🏢 Facilities:</Text> 
                            <Text>{theater.facilities.join(", ")}</Text>
                        </div>
                    </div>

                    <Title level={4} className="mt-6">🎬 Showtimes</Title>
                    <Table
                        dataSource={theater.showtimes}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }}
                        bordered
                        onRow={(record) => ({
                            onClick: () => navigate(`/movie/${record.movie._id}`),
                        })}
                        className="cursor-pointer"
                    />
                </Card>
            )}
        </div>
    );
};

export default TheaterDetails;
