import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import { Link } from "react-router-dom";

const ListUsernames = () => {
    const [usernames, setUsernames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsernames = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get("/users/names");
                setUsernames(response.data);
            } catch (err) {
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsernames();
    }, []);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
            {usernames.map((user, index) => (
                <Link to={`/users/${user.username}`} key={index}>
                    <p>{user.username}</p>
                </Link>
                ))}
            </ul>
        </div>
    );
};

export default ListUsernames;
