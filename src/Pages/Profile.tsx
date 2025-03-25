import axios from "axios";
import React, { useEffect, useState } from "react";
import { message } from "antd";

interface User {
  avatar?: string;
  username: string;
  email: string;
  role: string;
  bio: string;
  location: string;
}

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [userId]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // Update user profile
  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/profile/edit/${userId}`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Update successfully") {
        message.success("Update successfully!");
      } else {
        message.warning("Eros");
      }

      setEditMode(false);
      fetchData(); // Cập nhật lại dữ liệu mới
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <div className="max-w-md mx-auto bg-gray-400 shadow-lg rounded-lg overflow-hidden p-10">
        {user ? (
          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.avatar?.trim() || "/default-avatar.png"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border"
            />

            {editMode ? (
              <div className="w-full">
                <input
                  type="text"
                  name="avatar"
                  value={user.avatar}
                  onChange={handleChange}
                  placeholder="Link ảnh đại diện"
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder="Tên người dùng"
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                />
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  name="location"
                  value={user.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    disabled={loading}
                  >
                    {loading ? "Updating" : "Updated"}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-white font-bold text-lg">
                  {user.username}
                </h2>
                <p className="text-white">{user.email}</p>
                <p className="text-white text-sm">Role: {user.role}</p>
                <p className="text-white text-sm">
                  Bio: {user.bio || "Unknown"}
                </p>
                <p className="text-white text-sm">
                  Location: {user.location || "Unknown"}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-green-400 transition"
                >
                  Update Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
