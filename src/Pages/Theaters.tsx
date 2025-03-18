import React, { useEffect, useState } from "react";
import { Card, Table, message } from "antd";
import { getAllTheaters } from "../service/apiTheater";
import { useNavigate } from "react-router-dom";

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
}

const TheaterList: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Gọi API lấy danh sách rạp phim
  const fetchTheaters = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await getAllTheaters(token);
      console.log("API Response:", response);
      setTheaters(response); // Đảm bảo response là array
    } catch (error) {
      message.error("Error loading cinema list!");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTheaters();
  }, []);

  const columns = [
    {
      title: "Theater Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Theater) => (
        <a
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate(`/theater/${record._id}`)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location: Theater["location"]) =>
        `${location.address}, ${location.city}, ${location.state}`,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Facilities",
      dataIndex: "facilities",
      key: "facilities",
      render: (facilities: string[]) => facilities.join(", "),
    },
  ];

  return (
    <div className="pt-28">
      <Card
        title="List of Cinemas"
        className="shadow-lg rounded-lg border border-gray-200 bg-white"
      >
        <Table
          dataSource={theaters}
          columns={columns}
          rowKey="_id"
          loading={loading}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};


export default TheaterList;
