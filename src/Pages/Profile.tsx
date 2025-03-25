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
      if (response.data?.user) {
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
        message.warning("Error updating profile");
      }

      setEditMode(false);
      fetchData();
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-md w-full bg-gray-900 shadow-lg rounded-2xl overflow-hidden p-8">
        {user ? (
          <div className="flex flex-col items-center space-y-6">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={user.avatar?.trim() || "/default-avatar.png"}
                alt="User Avatar"
                className="w-28 h-28 rounded-full border-4 border-gray-700 shadow-lg transform transition duration-300 group-hover:scale-105"
              />
            </div>

            {editMode ? (
              <div className="w-full space-y-3">
                <input
                  type="text"
                  name="avatar"
                  value={user.avatar}
                  onChange={handleChange}
                  placeholder="Avatar URL"
                  className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="location"
                  value={user.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-blue-400">{user.email}</p>
                <span className="px-3 py-1 bg-blue-700 text-white rounded-full text-sm font-semibold">
                  {user.role}
                </span>
                <p className="text-gray-300 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  {user.bio || "No bio available"}
                </p>
                <div className="flex items-center justify-center text-gray-400 space-x-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{user.location || "Unknown"}</span>
                </div>

                {/* Update Button */}
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-500 hover:to-purple-400 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400">Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
