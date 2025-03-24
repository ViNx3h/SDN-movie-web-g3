import React, { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
    ticketId: string;
    movie: string;
    moviePoster: string;
    theater: string;
    address: string;
    showDate: string;
    showTime: string;
    seatNumber: string[];
    totalPrice: number;
}

const Ticket: React.FC = () => {
    const userId = localStorage.getItem("userId") || "";
    const token = localStorage.getItem("token") || "";
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        if (!userId || !token) return;
        const fetchTickets = async () => {
            try {
                const { data } = await axios.get<{ tickets: Ticket[] }>(
                    `http://localhost:5000/api/auth/booking/get_tickets_by_user/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTickets(data.tickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };
        fetchTickets();
    }, [userId, token]);

    const totalPages = Math.ceil(tickets.length / itemsPerPage);
    const currentTickets = tickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-6xl mx-auto  shadow-xl  rounded-lg flex flex-col">
            <div className="pt-20 px-6 pb-6">
                <h2 className="text-3xl font-bold text-white text-center mb-6">🎟 Your Tickets</h2>
                {tickets.length === 0 ? (
                    <p className="text-center text-lg font-semibold text-white">No tickets found.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-2">
                            {currentTickets.map((ticket) => (
                                <div key={ticket.ticketId} className="bg-gray-100 p-5 rounded-xl shadow-md">
                                    <img
                                        src={ticket.moviePoster}
                                        alt={ticket.movie}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <h3 className="text-lg font-bold text-gray-900 mt-3">{ticket.movie}</h3>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-gray-900">Theater:</span> {ticket.theater}, {ticket.address}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-gray-900">Showtime:</span> {new Date(ticket.showDate).toLocaleDateString()} at {ticket.showTime}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-gray-900">Seats:</span> {ticket.seatNumber.join(", ")}
                                    </p>
                                    <p className="text-lg font-bold text-red-600 mt-2">💰 {ticket.totalPrice.toLocaleString()} VND</p>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className="px-4 py-2 mx-1 bg-gray-300 rounded-md disabled:opacity-50"
                                    disabled={currentPage === 1}
                                >
                                    ⬅️ Prev
                                </button>
                                <span className="px-4 py-2 mx-1 text-lg font-bold">{currentPage} / {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="px-4 py-2 mx-1 bg-gray-300 rounded-md disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                >
                                    Next ➡️
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Ticket;
