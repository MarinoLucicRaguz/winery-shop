import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";

const UserDetails = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(`/users/${username}`);
                console.log(response.data);
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load user details.");
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    if (loading) return <p>Loading user details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>User Details</h2>
            {user ? (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            ) : (
                <p>User not found.</p>
            )}
        </div>
    );
};

export default UserDetails;
