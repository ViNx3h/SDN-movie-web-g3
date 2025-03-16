import { domain } from "./domain";

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
    showtimes: {
        _id: string;
        movie: {
            _id: string;
            title: string;
            posterUrl: string;
        };
        showDate: string;
        timeSlots: {
            _id: string;
            startTime: string;
            endTime: string;
        }[];
        price: number;
        availableSeats: string[];
    }[];
}

export const getAllTheaters = async (token: string): Promise<Theater[]> => {
    try {
        const response = await domain.get<Theater[]>('/get_all_theater', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Giữ nguyên, nếu API đúng
    } catch (error) {
        console.error("Error fetching theaters:", error);
        throw error;
    }
};

export const getTheaterDetails = async (token: string, theaterId: string): Promise<Theater> => {
    try {
        const response = await domain.get<Theater>(`/get_theater_detail/${theaterId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Giữ nguyên, nếu API đúng
    } catch (error) {
        console.error("Error fetching theater details:", error);
        throw error;
    }
};



