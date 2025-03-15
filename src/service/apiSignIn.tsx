import { domain } from "./domain";

interface UserIdResponse {
    userId: string; // Định nghĩa đúng theo API trả về
}

export const getIdUser = async (token: string): Promise<UserIdResponse> => {
    try {
        const response = await domain.get<UserIdResponse>('/token/get_id_user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("responseID", response.data.userId);
        return { userId: response.data.userId };
    } catch (error) {
        console.error("Error fetching user ID:", error);
        throw error;
    }
};
