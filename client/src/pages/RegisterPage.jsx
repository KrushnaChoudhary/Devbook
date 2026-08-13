import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (formData) => {
    try {
      const { confirmPassword, ...payload } = formData;

      const { data } = await API.post("/auth/register", payload);

      // Store token (Automatic Login After Signup)
      login(data.token);

      // Redirect home
      navigate("/");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message || "Registration failed";

      const field = error.response?.data?.field;

      // If the backend told us which field conflicted (email/username),
      // attach the error to that specific input instead of a generic alert
      if (field === "email" || field === "username") {
        setError(field, { type: "server", message });
      } else {
        alert(message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-zinc-900 p-8 rounded-xl w-[400px] space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Register
          </h1>

          <p className="text-zinc-400 text-sm mt-1">
            Create your DevBook account
          </p>
        </div>

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-600"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />

          {errors.name && (
            <p className="text-red-400 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-600"
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[a-zA-Z0-9_]{3,20}$/,
                message:
                  "3-20 characters: letters, numbers, underscores only",
              },
            })}
          />

          {errors.username && (
            <p className="text-red-400 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-600"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-11 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-600"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-600"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black p-3 rounded font-bold hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <p className="text-zinc-400 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
