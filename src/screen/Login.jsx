import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Lock, LogIn } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import Header from "@/components/Home/Header";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/store/api/auth";
import { saveAuthToStorage } from "@/store/reducer/auth";

// Vector logos
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 170 170">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.9-12.24-14.46-6.19-9.12-10.9-19.34-14.13-30.68-3.23-11.33-4.85-22.38-4.85-33.14 0-14.46 3.63-26.6 10.89-36.42 7.26-9.82 16.37-14.86 27.34-15.11 4.79 0 10.08 1.25 15.86 3.75 5.78 2.5 9.77 3.81 11.97 3.93 1.93-.24 6.07-1.63 12.43-4.17 6.36-2.54 11.83-3.69 16.4-3.45 12.28.61 22.09 4.96 29.43 13.06-10.78 6.53-16.05 15.54-15.81 27.03.24 9.07 3.69 16.73 10.35 22.98 6.66 6.25 14.6 9.72 23.82 10.41-2.43 7.37-5.46 14.73-9.08 22.08zM119.22 33.64c0-7.39 2.65-14.47 7.95-21.24 5.3-6.77 11.97-11.08 20.02-12.4-1.09 7.39-4.04 14.4-8.85 21.03-4.81 6.63-11.16 10.83-19.12 12.61z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const resp = await login({ phone_no: phone, password }).unwrap();

      // ✅ Save auth to Redux + localStorage
      dispatch(saveAuthToStorage(resp));

      // ✅ Redirect after login
      navigate("/");
    } catch (err) {
      setError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    const clientId =
      "565889692174-63dkgig4cjj7mk4p6l7luqruoh3u49sv.apps.googleusercontent.com";
    const redirectUri =
      window.location.origin.includes("cyberawareness.ngo")
        ? "https://cyberawareness.ngo/auth/google/callback"
        : `${window.location.origin}/auth/google/callback`;
    const nonce = Math.random().toString(36).substring(2, 15);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token%20id_token&scope=openid%20profile%20email&nonce=${nonce}`;
    window.location.href = authUrl;
  };

  const handleAppleLogin = () => {
    const clientId = "com.cyberhelpdesk.service";
    const redirectUri = "https://cyberawareness.ngo/auth/apple/callback";
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=${state}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          {/* Title */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-3"
            >
              <LogIn className="w-7 h-7 text-emerald-600" />
            </motion.div>

            <h1 className="text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm">Login to Cyber Help Desk</p>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition shadow-sm cursor-pointer"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-black hover:bg-gray-900 text-white font-semibold text-sm transition shadow-sm cursor-pointer"
            >
              <AppleIcon />
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Or with phone
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-2.5 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-60 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? "Logging in..." : "Login with Phone"}
            </Button>
          </form>

          {/* Register */}
          <p className="text-center text-gray-600 text-sm mt-5">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
