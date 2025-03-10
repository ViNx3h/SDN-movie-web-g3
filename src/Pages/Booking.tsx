import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Detail from "./Detail";

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const cols = Array.from({ length: 15 }, (_, i) => i + 1);

const seatTypes: Record<string, string> = {
  booked: "bg-red-500 cursor-not-allowed",
  selected: "bg-pink-500",
  vip: "bg-yellow-500",
  center: "border-2 border-green-500 text-white",
  regular: "bg-blue-500",
};

// Ghế đã đặt (ví dụ)
const bookedSeats = ["C5", "C6", "D7", "E8", "F9", "G10"];

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const params = useParams();
  console.log("params", params);

  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSelectSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please choose your seat before confirming!");
      return;
    }
    alert(
      `You have successfully placed the seats: ${selectedSeats.join(", ")}`
    );
  };

  const handleBack = () => {
    navigate(`/${params.detail}/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-5">
      <h1 className="text-3xl font-bold mb-2">Reserve Your Seat</h1>
      <p className="text-lg mb-5">
        You are booking tickets for a movie with ID: {id}
      </p>

      {/* Màn hình */}
      <div className="bg-white text-black py-1 px-20 font-bold mb-4 rounded">
        SCREEN
      </div>

      {/* Bố cục ghế */}
      <div className="flex flex-col items-center gap-2">
        {rows.map((row) => (
          <div key={row} className="flex gap-2">
            {cols.map((col) => {
              const seatId = `${row}${col}`;
              const isBooked = bookedSeats.includes(seatId);
              const isSelected = selectedSeats.includes(seatId);
              const isCenter = col >= 6 && col <= 10;
              const isVip = row === "A" || row === "B";
              const seatClass = isBooked
                ? seatTypes.booked
                : isSelected
                ? seatTypes.selected
                : isCenter
                ? seatTypes.center
                : isVip
                ? seatTypes.vip
                : seatTypes.regular;

              return (
                <button
                  key={seatId}
                  className={`w-10 h-10 text-xs font-bold rounded flex items-center justify-center transition-all ${seatClass}`}
                  onClick={() => handleSelectSeat(seatId)}
                  disabled={isBooked}
                >
                  {seatId}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Chú thích */}
      <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div> Booked
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div> Chair of your
          choice
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div> Regular chair
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div> VIP seats
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-500 rounded"></div>{" "}
          Central Region
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleConfirmBooking}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-all"
        >
          Confirm
        </button>
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded transition-all"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default Booking;
