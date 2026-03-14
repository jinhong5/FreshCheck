import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from './userContext.jsx';

export default function GoogleSignIn() {
    const navigate = useNavigate();
    const { login } = useContext(UserContext)

    async function handleSuccess(response) {
        console.log(response);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                credential: response.credential,
                clientId: response.clientId
            }),
        })

        if (res.ok) {
            const data = await res.json();
            // localStorage.setItem("token", data.token);
            login(data.token);;
            navigate("/");
        }

    }

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Google Login Failed")}
        />
    );
}