import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post(
        "/auth/login",
        formData
      );

      login(data.token);

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-[400px] space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <button
          type="submit"
          className="w-full bg-white text-black p-3 rounded font-bold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;