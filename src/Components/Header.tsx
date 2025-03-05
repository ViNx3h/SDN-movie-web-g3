import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { Button, Dropdown, Menu, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const Header = () => {
    const location = useLocation();
    const removeSpace = location?.search?.slice(3).split("%20").join(" ")
    const [data, setData] = useState<string | undefined>();
    const [isSearching, setIsSearching] = useState(false);
    const [searchInput, setSearchInput] = useState(removeSpace);
    const nav = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');

    // Thêm state để theo dõi sự thay đổi auth
    const [authChange, setAuthChange] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleGetToken = async () => {
        const session = await fetchAuthSession();
        const username = session.tokens?.accessToken.payload.username;
        if (typeof username === 'string') {
            setData(username); // Only set data if it's a valid string
        }
        console.log("access token", session.tokens?.accessToken.payload.username)

    }
    useEffect(() => {
        if (searchInput && isSearching) {
            nav(`/search?q=${searchInput}`);
        }
    }, [searchInput, isSearching, nav]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (searchInput) {
            setIsSearching(true);
        }
    };

    useEffect(() => {
        handleGetToken();
    }, [])

    // Thêm useEffect để kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const storedUsername = localStorage.getItem('email');
            setIsLoggedIn(!!token);
            setEmail(storedUsername || '');
        };

        // Kiểm tra ngay khi component mount
        checkLoginStatus();

        // Lắng nghe sự kiện storage để cập nhật UI
        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        // Thêm event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');

        setIsLoggedIn(false);
        setEmail('');
        setShowDropdown(false);

        window.dispatchEvent(new Event('storage'));
        message.success('Đăng xuất thành công!');
        nav('/');
    };

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <header className='fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75 z-20'>
            <div className='container mx-auto px-1 flex text-red-500 h-full items-center'>
                <div className='text-lg font-bold'>
                    <Link to='/'>
                        <h2>Movie</h2>
                    </Link>
                </div>
                <div className=' lg:flex items-center gap-3 ml-5'>


                    <a href='/tv' >
                        <label htmlFor="TV Shows" className='hover:text-neutral-100'>TV Shows</label>
                    </a>
                    <a href='/movie'>
                        <label htmlFor="Movies" className='hover:text-neutral-100'>Movies</label>
                    </a>
                    <Link to={`/list/${data}`} className='hover:text-neutral-100 '> List</Link>


                </div>
                <div className='hidden: lg:flex items-center ml-auto '>
                    <form className='px-4 outline-none border-none flex items-center gap-3' onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Search here.....'
                            className='outline-none border-none bg-neutral-600 rounded-r-lg text-white'
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setIsSearching(false); // Reset isSearching khi user gõ
                            }}
                            value={searchInput}
                        />
                        <button className='text-white text-xl'>
                            <FaSearch />
                        </button>

                    </form>


                </div>
                <div className='items-center justify-center relative'>
                    <div onClick={handleProfileClick} className="cursor-pointer">
                        <CgProfile className='text-black text-3xl' />
                    </div>
                    {showDropdown && (
                        <div ref={dropdownRef} className="absolute right-1/2 transform translate-x-1/2 mt-2 w-40 bg-white rounded-md shadow-lg py-1">
                            {isLoggedIn ? (
                                <>
                                    <div className="block px-4 py-2 text-sm text-gray-700">
                                        <div className='d-flex'>
                                            <p className=''> Hello  </p>
                                            <p> {email} </p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        Logout
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        onClick={() => setShowDropdown(false)}
                                        className="block text-center py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setShowDropdown(false)}
                                        className="block text-center py-2 text-sm text-gray-700 hover:bg-gray-100"
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
    )
}

export default Header