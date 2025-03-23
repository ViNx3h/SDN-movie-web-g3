import axios from "axios";
import React, { useEffect, useState } from "react";

interface User {
  avatar?: string;
  username: string;
  email: string;
  role: string;
}

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]); // Chỉ fetch khi userId thay đổi

  return (
    <div className="pt-16">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-10">
        {user ? (
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar?.trim() || "/default-avatar.png"}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-bold">
                {user.username || "Unknown User"}
              </h2>
              <p className="text-gray-600">
                {user.email || "No email available"}
              </p>
              <p className="text-gray-500 text-sm">
                Role: {user.role || "Unknown"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
