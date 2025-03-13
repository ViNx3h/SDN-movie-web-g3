import axios from "axios";
import React, { useState, useEffect } from "react";

const Theaters = () => {
  const [theater, setTheater] = useState(null);
  
  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const theaterId = "your-theater-id"; // Replace with actual theater ID
        const response = await axios.get(`http://localhost:5000/api/auth/theater/${theaterId}`);
        setTheater(response.data);
      } catch (error) {
        console.error("Error fetching theater:", error);
      }
    };

    fetchTheater();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-around bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {theater ? (
        <div>
          {/* Display theater data here */}
          <pre>{JSON.stringify(theater, null, 2)}</pre>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Theaters;