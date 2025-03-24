import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Select,
  Radio,
  Spin,
  Typography,
  message,
  Button,
  Row,
  Col,
  Divider,
  Tag,
  Tooltip
} from "antd";
import {
  CheckOutlined,
  CloseOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

interface Theater {
  _id: string;
  name: string;
  location: { address: string };
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Showtime {
  _id: string;
  theater: Theater;
  showDate: string;
  timeSlots: TimeSlot[];
  price: number;
  availableSeats: string[];
  bookedSeats: string[];
}

const SelectShowtime: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [loading, setLoading] = useState(true);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Generate all possible seats (A1-E10)
  const allSeats = useMemo(() => {
    const seats: string[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    rows.forEach(row => {
      for (let i = 1; i <= 15; i++) {
        seats.push(`${row}${i}`);
      }
    });
    return seats;
  }, []);

  // Group showtimes by theater
  const theaters = useMemo(() => {
    return showtimes.reduce((acc: Record<string, Showtime[]>, showtime) => {
      const theaterId = showtime.theater._id;
      if (!acc[theaterId]) acc[theaterId] = [];
      acc[theaterId].push(showtime);
      return acc;
    }, {});
  }, [showtimes]);

  useEffect(() => {
    if (!movieId) {
      message.error("Movie ID not found!");
      return;
    }

    const fetchShowtimes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:5000/api/auth/get_showtime_movie/${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success && data.showtimes?.length > 0) {
          setShowtimes(data.showtimes);
          setSelectedTheater(data.showtimes[0].theater._id);
        } else {
          message.warning("No available showtimes found!");
        }
      } catch (error) {
        console.error("API Error:", error);
        message.error("Failed to load showtimes!");
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  const handleSeatSelection = (seat: string) => {
    const currentShowtime = showtimes.find(st => st._id === selectedShowtime);
    if (!currentShowtime) return;

    if (currentShowtime.bookedSeats.includes(seat)) {
      return; // Prevent selecting booked seats
    }

    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      message.error("Please select a showtime and seats!");
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const showtime = showtimes.find(st => st._id === selectedShowtime);

      if (!showtime) {
        message.error("Invalid showtime!");
        return;
      }

      const payload = {
        userId,
        showtimeId: selectedShowtime,
        movieId,
        theaterId: selectedTheater,
        seats: selectedSeats,
        totalPrice: showtime.price * selectedSeats.length,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/booking/add_booking",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.booking) {
        message.success("Booking successful!");
        // Update local state to reflect booked seats
        setShowtimes(prev => prev.map(st =>
          st._id === selectedShowtime
            ? { ...st, bookedSeats: [...st.bookedSeats, ...selectedSeats] }
            : st
        ));
        setSelectedSeats([]);
      } else {
        message.error("Booking failed, please try again!");
      }
    } catch (error: any) {
      console.error("Booking Error:", error);
      message.error(error.response?.data?.message || "Booking error occurred!");
    } finally {
      setBookingLoading(false);
    }
  };

  const getSeatStatus = (seat: string) => {
    const currentShowtime = showtimes.find(st => st._id === selectedShowtime);
    if (!currentShowtime) return 'available';

    if (currentShowtime.bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  // Organize seats by row for display
  const seatRows = useMemo(() => {
    const rows: Record<string, string[]> = {};
    allSeats.forEach(seat => {
      const row = seat.charAt(0);
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });
    return rows;
  }, [allSeats]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Spin size="large" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-5">
      <Title level={3} className="text-center mb-8">Select Showtime</Title>

      {/* Theater Selection */}
      <Card className="mb-6">
        <Text strong className="block mb-4 text-lg">Select Theater</Text>
        <Select
          className="w-full"
          value={selectedTheater}
          onChange={setSelectedTheater}
          loading={loading}
        >
          {Object.entries(theaters).map(([theaterId, theaterShowtimes]) => (
            <Option key={theaterId} value={theaterId}>
              {theaterShowtimes[0].theater.name} - {theaterShowtimes[0].theater.location.address}
            </Option>
          ))}
        </Select>
      </Card>

      {/* Showtime Selection */}
      {selectedTheater && (
        <Card className="mb-6">
          <Text strong className="block mb-4 text-lg">Available Showtimes</Text>
          <Radio.Group
            className="w-full"
            value={selectedShowtime}
            onChange={(e) => {
              setSelectedShowtime(e.target.value);
              setSelectedSeats([]);
            }}
          >
            <Row gutter={[16, 16]}>
              {theaters[selectedTheater].map((showtime) => (
                <Col key={showtime._id} xs={24} sm={12} md={8}>
                  <Radio.Button
                    value={showtime._id}
                    className="w-full h-full flex flex-col justify-center items-center p-4"
                  >
                    <div className="font-bold">
                      {new Date(showtime.showDate).toLocaleDateString()}
                    </div>
                    <div className="my-2">
                      {showtime.timeSlots.map((slot, idx) => (
                        <div key={idx} className="text-sm">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      ))}
                    </div>
                    <div className="text-blue-500 font-bold">
                      {showtime.price.toLocaleString()} VND
                    </div>
                  </Radio.Button>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Card>
      )}

      {/* Seat Selection */}
      {selectedShowtime && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Text strong className="text-lg">Select Seat</Text>
            <div className="flex space-x-2">
              <Tag color="green">Available</Tag>
              <Tag color="red">Booked</Tag>
            </div>
          </div>

          <Divider />

          {/* Screen Display */}
          <div className="text-center bg-gray-100 py-3 my-6 rounded font-bold">
            SCREEN
          </div>

          {/* Seat Map */}
          <div className="mt-8 flex flex-col items-center">
            {Object.entries(seatRows).map(([row, seats]) => (
              <div key={row} className="flex items-center mb-4">
                <Text strong className="w-16">Row {row}</Text>
                <div className="flex flex-wrap gap-2">
                  {seats.map(seat => {
                    const status = getSeatStatus(seat);
                    const isAvailable = showtimes
                      .find(st => st._id === selectedShowtime)
                      ?.availableSeats.includes(seat);

                    return (
                      <Tooltip
                        key={seat}
                        title={status === 'booked' ? 'Seat booked' :
                          !isAvailable ? 'Seats not available' :
                            `Seats ${seat}`}
                      >
                        <Button
                          className={`w-10 h-10 p-0 flex items-center justify-center ${status === 'selected' ? 'bg-blue-500 text-white' :
                            status === 'booked' ? 'bg-red-500 text-white cursor-not-allowed' :
                              !isAvailable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                                'bg-green-500 text-white'
                            }`}
                          disabled={status === 'booked' || !isAvailable}
                          onClick={() => isAvailable && handleSeatSelection(seat)}
                          icon={status === 'selected' ? <CheckOutlined /> :
                            status === 'booked' ? <CloseOutlined /> : null}
                        >
                          {seat.substring(1)}
                        </Button>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Booking Summary */}
      {selectedSeats.length > 0 && selectedShowtime && (
        <Card>
          <Text strong className="block mb-4 text-lg">Booking Information</Text>
          <div className="space-y-2 mb-6">
            <div>
              <Text strong>Selected Seat: </Text>
              {selectedSeats.join(", ")}
            </div>
            <div>
              <Text strong>Total amount: </Text>
              {(
                showtimes.find(st => st._id === selectedShowtime)?.price || 0
              ) * selectedSeats.length} VND
            </div>
          </div>
          <Button
            type="primary"
            block
            size="large"
            onClick={handleBooking}
            loading={bookingLoading}
            className="mt-4"
          >
            Confirm Booking
          </Button>
        </Card>
      )}
    </div>
  );
};

export default SelectShowtime;