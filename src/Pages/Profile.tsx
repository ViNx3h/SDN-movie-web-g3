import axios from "axios";
import React, { useEffect, useState } from "react";

interface User {
  avatar?: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
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
          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.avatar?.trim() || "/default-avatar.png"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border"
            />
            <div className="text-center">
              <h2 className="text-xl font-bold">{user.username || "Unknown User"}</h2>
              <p className="text-gray-600">{user.email || "No email available"}</p>
              <p className="text-gray-500 text-sm">Role: {user.role || "Unknown"}</p>
              {user.bio && <p className="text-gray-700 mt-2 italic">"{user.bio}"</p>}
              {user.location && <p className="text-gray-600">📍 {user.location}</p>}
              {user.createdAt && (
                <p className="text-gray-500 text-xs">
                  Account created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
              {user.updatedAt && (
                <p className="text-gray-500 text-xs">
                  Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              )}
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
