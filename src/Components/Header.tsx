import "@aws-amplify/ui-react/styles.css";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";

const Header = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [data, setData] = useState<string | undefined>();
  const [isSearching, setIsSearching] = useState(false);
  const nav = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  // Thêm state để theo dõi sự thay đổi auth
  const [authChange, setAuthChange] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGetId = async () => {
    const username = localStorage.getItem("email");
    console.log("user", username);

    if (typeof username === "string") {
      setData(username); // Only set data if it's a valid string
    }
  };
  useEffect(() => {
    if (searchInput && isSearching) {
      nav(`/search?q=${searchInput}`);
    }
  }, [searchInput, isSearching, nav, location]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (searchInput) {
      setIsSearching(true);
    }
  };

  useEffect(() => {
    handleGetId();
  }, []);

  // Thêm useEffect để kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("email");
      setIsLoggedIn(!!token);
      setEmail(storedUsername || "");
    };

    // Kiểm tra ngay khi component mount
    checkLoginStatus();

    // Lắng nghe sự kiện storage để cập nhật UI
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Thêm useEffect để theo dõi thay đổi isLoggedIn
  useEffect(() => {
    if (!isLoggedIn) {
      setShowDropdown(false); // Tự động đóng dropdown khi đăng xuất
    }
  }, [isLoggedIn]);

  // Thêm useEffect để xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    // Thêm event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);
    setEmail("");
    setShowDropdown(false);

    window.dispatchEvent(new Event("storage"));
    message.success("Logout successful!!");
    nav("/");
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="fixed top-0 w-full h-16 bg-neutral-800 bg-opacity-90 z-20 shadow-md">
      <div className="container mx-auto px-4 flex items-center h-full text-white">
        {/* Logo */}
        <div className="text-xl font-semibold">
          <Link to="/" className="hover:text-red-500 transition">
            Home
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 ml-8">
          <Link to="/movies" className="hover:text-red-400 transition">
            Movies
          </Link>
          <Link to="/list/fav_list" className="hover:text-red-400 transition">
            Favourite List
          </Link>
          <Link to="/theaters" className="hover:text-red-400 transition">
            Theaters
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center ml-auto">
          <form
            className="flex items-center bg-neutral-700 rounded-full px-3 py-1"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-white placeholder-gray-300 w-40 px-2"
              onChange={(e) => {
                setSearchInput(e.target.value);
                setIsSearching(false);
              }}
              value={searchInput}
            />
            <button className="text-white text-lg">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-6">
          <div
            onClick={handleProfileClick}
            className="cursor-pointer text-white text-3xl hover:text-red-500 transition"
          >
            <CgProfile />
          </div>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-md shadow-lg py-2"
            >
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-sm border-b flex items-center">
                    <p className="font-semibold max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                      Hello, {email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/ticket"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Ticket
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setShowDropdown(false)}
                    className="block text-center py-2 text-sm hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setShowDropdown(false)}
                    className="block text-center py-2 text-sm hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
