import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useGoogleAuthMutation } from "@/store/api/auth";
import { saveAuthToStorage } from "@/store/reducer/auth";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("processing"); // "processing" | "redirecting_to_app" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [appRedirectUrl, setAppRedirectUrl] = useState("");

  const [googleAuth] = useGoogleAuthMutation();

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      try {
        // 1. Parse query search params
        const searchParams = new URLSearchParams(location.search);
        // 2. Parse hash fragment params (for token/id_token response_type)
        const hash = location.hash.startsWith("#")
          ? location.hash.substring(1)
          : location.hash;
        const hashParams = new URLSearchParams(hash);

        const error =
          searchParams.get("error") ||
          hashParams.get("error") ||
          searchParams.get("error_description");

        if (error) {
          if (!isMounted) return;
          setStatus("error");
          setErrorMessage(error || "Google authentication was cancelled or failed.");
          return;
        }

        const id_token =
          hashParams.get("id_token") || searchParams.get("id_token");
        const access_token =
          hashParams.get("access_token") || searchParams.get("access_token");
        const code =
          searchParams.get("code") || hashParams.get("code");

        // Check if authentication was initiated by mobile app or user is on mobile
        let targetReturnUrl = null;
        let isMobileApp = false;

        const stateRaw = hashParams.get("state") || searchParams.get("state");
        if (stateRaw) {
          try {
            const parsed = JSON.parse(decodeURIComponent(stateRaw));
            if (parsed?.returnUrl) targetReturnUrl = parsed.returnUrl;
            if (parsed?.source === "mobile_app") isMobileApp = true;
          } catch {
            if (stateRaw.startsWith("myapp://") || stateRaw.startsWith("exp://")) {
              targetReturnUrl = stateRaw;
              isMobileApp = true;
            } else if (stateRaw === "mobile_app") {
              isMobileApp = true;
            }
          }
        }

        if (
          searchParams.get("source") === "mobile_app" ||
          hashParams.get("source") === "mobile_app"
        ) {
          isMobileApp = true;
        }

        const isMobileDevice =
          typeof navigator !== "undefined" &&
          /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

        if (!targetReturnUrl && (isMobileApp || isMobileDevice)) {
          targetReturnUrl = "myapp://auth/callback";
        }

        // If this is for mobile app and tokens are present
        if (targetReturnUrl && (id_token || access_token || code)) {
          const params = new URLSearchParams();
          if (id_token) params.set("id_token", id_token);
          if (access_token) params.set("access_token", access_token);
          if (code) params.set("code", code);
          const queryString = params.toString();

          const separator = targetReturnUrl.includes("?") ? "&" : "?";
          const fullAppUrl = `${targetReturnUrl}${separator}${queryString}#${queryString}`;

          if (isMounted) {
            setAppRedirectUrl(fullAppUrl);
            setStatus("redirecting_to_app");
          }

          // Trigger immediate app deep link redirect
          try {
            window.location.replace(fullAppUrl);
          } catch (e) {
            console.warn("Auto-redirect to app failed:", e);
          }

          // Also attempt window.location.href fallback after short delay
          setTimeout(() => {
            try {
              window.location.href = fullAppUrl;
            } catch {}
          }, 300);

          return;
        }

        // Notify opener window if opened in a popup/tab (Desktop web popup)
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage(
              {
                type: "GOOGLE_AUTH_CALLBACK",
                url: window.location.href,
                id_token,
                access_token,
                code,
              },
              "*"
            );
          } catch (e) {
            console.warn("Opener postMessage warning:", e);
          }
        }

        if (!id_token && !access_token && !code) {
          if (!isMounted) return;
          setStatus("error");
          setErrorMessage(
            "No authentication credentials received from Google. Please try logging in again."
          );
          return;
        }

        // Call backend Google Auth API (Standard Web Session)
        const payload = {
          id_token: id_token || undefined,
          access_token: access_token || undefined,
          authorization_code: code || undefined,
        };

        const res = await googleAuth(payload).unwrap();

        if (!isMounted) return;

        // Save auth to Redux store and localStorage
        dispatch(saveAuthToStorage(res));
        setStatus("success");

        // Redirect after brief delay
        setTimeout(() => {
          if (isMounted) {
            const redirectUrl =
              sessionStorage.getItem("oauth_return_to") || "/";
            sessionStorage.removeItem("oauth_return_to");
            navigate(redirectUrl, { replace: true });
          }
        }, 1200);
      } catch (err) {
        if (!isMounted) return;
        console.error("Google Callback Error:", err);
        setStatus("error");
        setErrorMessage(
          err?.data?.message ||
            err?.message ||
            "Unable to verify Google credentials with the server. Please try again."
        );
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [location, googleAuth, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
      >
        {status === "processing" && (
          <div className="py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-5">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              Authenticating with Google
            </h2>
            <p className="text-sm text-slate-500">
              Please wait while we verify your Google credentials and log you in...
            </p>
          </div>
        )}

        {status === "redirecting_to_app" && (
          <div className="py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-5">
              <CheckCircle2 className="w-9 h-9 text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              Redirecting to App
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Google authentication was successful! Returning to Cyber Help Desk app...
            </p>
            {appRedirectUrl && (
              <div className="flex flex-col gap-3">
                <a
                  href={appRedirectUrl}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold text-base shadow-lg shadow-blue-500/20 transition w-full"
                >
                  Open Cyber Help Desk App <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-xs text-slate-400">
                  If the app does not open automatically, tap the button above.
                </p>
              </div>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mb-5">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              Login Successful!
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Welcome back to Cyber Help Desk. Redirecting you to the home page...
            </p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Go to Homepage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mb-5">
              <AlertCircle className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              Authentication Failed
            </h2>
            <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-xl border border-red-100">
              {errorMessage}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Return to Login
              </Link>
              <Link
                to="/"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
