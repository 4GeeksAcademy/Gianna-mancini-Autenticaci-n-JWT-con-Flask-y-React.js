import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const getProfile = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const resp = await fetch(`${backendUrl}/api/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await resp.json();

            if (resp.ok) {
                setMessage(data.msg);
            } else {
                sessionStorage.removeItem("token");
                navigate("/login");
            }
        };

        getProfile();
    }, []);

    const logout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1>Welcome! 🎉</h1>
                    <p className="text-muted mb-0">{message}</p>
                </div>

                <button
                    className="btn btn-dark"
                    onClick={logout}>Logout</button>
            </div>
        </div>
    );
}; 
