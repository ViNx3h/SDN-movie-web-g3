import { fetchAuthSession } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import Card from "../Components/Card";
import "../index.css";

const client = generateClient<Schema>();

const List = () => {
    const [list, setList] = useState<Array<Schema["List"]["type"]>>([]);
    const [data, setData] = useState<any[]>([]);
    const [mediaType, setMediaType] = useState<any>([]);
    const [userId, setUserId] = useState<string | undefined>();

    useEffect(() => {
        // Observe query only after userId is available
        if (userId) {
            const subscription = client.models.List?.observeQuery()?.subscribe({
                next: (data) => {
                    const filteredItems = data.items.filter(item => item.user_id === userId);
                    setList([...filteredItems]); // Set filtered items
                }
            });
            return () => subscription?.unsubscribe(); // Cleanup subscription on unmount
        }
    }, [userId]); // Dependency on userId, refetch when it changes

    const handleGetToken = async () => {
        const session = await fetchAuthSession();
        const username = session.tokens?.accessToken.payload.username;
        if (typeof username === 'string') {
            setUserId(username); // Only set userId if it's valid
        }
        console.log("access token", session.tokens?.accessToken.payload.username);
    };

    const fetchData = async () => {
        try {
            const fetchedData = await Promise.all(
                list.map(async (item) => {
                    const response = await axios.get(`/${item.media_type}/${item.id}`);
                    setMediaType((prev: any) => [...prev, item.media_type]); // Correct typo (prev instead of preve)
                    return response.data;
                })
            );
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data when the list changes
    }, [list]); // Add list as a dependency so it refetches when list is updated

    useEffect(() => {
        handleGetToken(); // Fetch token on component mount
    }, []); // Empty array so it runs only once on mount

    return (
        <div>
            <div className="container mx-auto py-16 pl-6">
                <h3 className="capitalize text-lg lg:text-xl font-semibold my-3 text-center">List</h3>
                <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-5 justify-center lg:justify-start">
                    {
                        data.map((detail: any, index: any) => (
                            <Card
                                data={detail}
                                index={index + 1}
                                media_type={mediaType[index]}
                                key={index}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default List;
