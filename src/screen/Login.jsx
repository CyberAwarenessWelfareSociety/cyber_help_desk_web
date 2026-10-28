import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "@/components/Home/Header";
import {
  useLoginStep1Mutation,
  useLoginStep2Mutation,
} from "@/store/api/auth";
import {
  saveAuthToStorage,
  selectCurrentToken,
  selectCurrentUser,
} from "@/store/reducer/auth";

const RESEND_SECONDS = 30;

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.error || fallback;

const maskPhone = (phone) => `+91 ••••••${phone.slice(-4)}`;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const currentUser = useSelector(selectCurrentUser);
  const requestedLocation = location.state?.from;
  const redirectTo = requestedLocation
    ? `${requestedLocation.pathname}${requestedLocation.search}${requestedLocation.hash}`
    : "/";

  const [step, setStep] = useState("credentials");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [clientId, setClientId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const otpInputRef = useRef(null);

  const [loginStep1, { isLoading: isSendingOtp }] =
    useLoginStep1Mutation();
  const [loginStep2, { isLoading: isVerifyingOtp }] =
    useLoginStep2Mutation();

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;
    const timer = window.setInterval(
      () => setResendSeconds((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (step === "otp") otpInputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (token && currentUser?.id) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser?.id, navigate, redirectTo, token]);

  const sendOtp = async ({ isResend = false } = {}) => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await loginStep1({ phone_no: phone, password }).unwrap();
      setClientId(response.client_id);
      setOtp("");
      setStep("otp");
      setResendSeconds(RESEND_SECONDS);
      setSuccessMessage(
        isResend
          ? "A new verification code has been sent."
          : "Verification code sent successfully.",
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "We could not send the verification code. Please try again.",
        ),
      );
    }
  };

  const handleCredentialsSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit registered mobile number.");
      return;
    }

    if (!password) {
      setError("Enter your password to continue.");
      return;
    }

    await sendOtp();
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!/^\d{4}$/.test(otp)) {
      setError("Enter the 4-digit verification code.");
      return;
    }

    try {
      const response = await loginStep2({
        client_id: clientId,
        phone_no: phone,
        otp,
      }).unwrap();

      await dispatch(saveAuthToStorage(response));
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "The verification code is invalid or has expired.",
        ),
      );
    }
  };

  const handleEditPhone = () => {
    setStep("credentials");
    setOtp("");
    setClientId(null);
    setError("");
    setSuccessMessage("");
    setResendSeconds(0);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f1] text-[#173e36] flex flex-col">
      <Header />

      <main className="relative flex-1 overflow-hidden px-5 py-10 sm:px-8 sm:py-14 lg:py-20">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#dce7a5]/35 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#9fc9b3]/25 blur-3xl" />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#dce3d8] bg-white shadow-[0_28px_80px_rgba(27,67,55,0.12)] lg:grid-cols-[0.92fr_1.08fr]"
        >
          <div className="relative hidden overflow-hidden bg-[#173e36] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-white/10" />
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-[#e5edb5] uppercase">
                <ShieldCheck className="h-4 w-4" /> Secure member access
              </span>
              <h2 className="mt-8 max-w-sm text-4xl leading-[1.12] font-medium tracking-[-0.04em]">
                Two steps.<br />One safer account.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                Your password confirms what you know. A one-time code sent to
                your registered phone confirms it is really you.
              </p>
            </div>

            <div className="mt-16 space-y-4">
              {[
                [<LockKeyhole key="password" className="h-4 w-4 text-[#dce7a5]" />, "Your password is checked securely"],
                [<Smartphone key="phone" className="h-4 w-4 text-[#dce7a5]" />, "OTP goes only to your registered number"],
                [<CheckCircle2 key="access" className="h-4 w-4 text-[#dce7a5]" />, "Access starts after both checks pass"],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                    {icon}
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-9 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
            <div className="mb-8 flex items-center gap-2" aria-label="Login progress">
              <span className="h-1.5 flex-1 rounded-full bg-[#214e3e]" />
              <span
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step === "otp" ? "bg-[#214e3e]" : "bg-[#e6ebe3]"
                }`}
              />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === "credentials" ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-8">
                    <span className="text-[11px] font-bold tracking-[0.14em] text-[#71874c] uppercase">
                      Step 1 of 2
                    </span>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#173e36] sm:text-4xl">
                      Welcome back
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#68756d]">
                      Enter your registered mobile number and password.
                    </p>
                  </div>

                  {error && (
                    <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <form className="space-y-5" onSubmit={handleCredentialsSubmit} noValidate>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#284b41]">
                        Registered mobile number
                      </label>
                      <div className="relative">
                        <Phone className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#74827a]" />
                        <span className="absolute top-1/2 left-12 -translate-y-1/2 border-r border-[#d9dfd7] pr-3 text-sm font-semibold text-[#334f47]">
                          +91
                        </span>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          placeholder="10-digit number"
                          value={phone}
                          onChange={(event) =>
                            setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          className="h-14 w-full rounded-xl border border-[#d8ded6] bg-[#fbfcf8] pr-4 pl-[92px] text-base text-[#173e36] outline-none transition placeholder:text-[#9aa49d] focus:border-[#5c7959] focus:ring-4 focus:ring-[#dce7a5]/45"
                          aria-describedby="phone-hint"
                          required
                        />
                      </div>
                      <p id="phone-hint" className="mt-2 text-xs text-[#7b877f]">
                        Use the number linked to your CAWS account.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#284b41]">
                        Password
                      </label>
                      <div className="relative">
                        <LockKeyhole className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#74827a]" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className="h-14 w-full rounded-xl border border-[#d8ded6] bg-[#fbfcf8] pr-12 pl-12 text-base text-[#173e36] outline-none transition placeholder:text-[#9aa49d] focus:border-[#5c7959] focus:ring-4 focus:ring-[#dce7a5]/45"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-[#68776e] transition hover:bg-[#edf1e8] hover:text-[#173e36]"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#214e3e] px-5 text-sm font-semibold text-white transition hover:bg-[#2d6650] focus:ring-4 focus:ring-[#214e3e]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSendingOtp ? "Checking details…" : "Continue to verification"}
                      {!isSendingOtp && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.22 }}
                >
                  <button
                    type="button"
                    onClick={handleEditPhone}
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#516d55] transition hover:text-[#173e36]"
                  >
                    <ArrowLeft className="h-4 w-4" /> Edit login details
                  </button>

                  <div className="mb-7">
                    <span className="text-[11px] font-bold tracking-[0.14em] text-[#71874c] uppercase">
                      Step 2 of 2
                    </span>
                    <div className="mt-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#edf2d1] text-[#214e3e]">
                      <KeyRound className="h-7 w-7" />
                    </div>
                    <h1 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#173e36] sm:text-4xl">
                      Check your phone
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#68756d]">
                      Enter the 4-digit code sent to <strong className="font-semibold text-[#284b41]">{maskPhone(phone)}</strong>.
                    </p>
                  </div>

                  {successMessage && (
                    <div role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-[#d7e2b5] bg-[#f4f7e8] px-4 py-3 text-sm text-[#47613d]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      {successMessage}
                    </div>
                  )}

                  {error && (
                    <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleOtpSubmit} noValidate>
                    <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-[#284b41]">
                      Verification code
                    </label>
                    <input
                      ref={otpInputRef}
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="• • • •"
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className="h-16 w-full rounded-xl border border-[#d8ded6] bg-[#fbfcf8] px-5 text-center text-2xl font-semibold tracking-[0.65em] text-[#173e36] outline-none transition placeholder:text-[#b2bbb4] focus:border-[#5c7959] focus:ring-4 focus:ring-[#dce7a5]/45"
                      aria-describedby="otp-hint"
                      required
                    />
                    <p id="otp-hint" className="mt-2 text-xs text-[#7b877f]">
                      The code expires shortly and can be used only once.
                    </p>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#214e3e] px-5 text-sm font-semibold text-white transition hover:bg-[#2d6650] focus:ring-4 focus:ring-[#214e3e]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isVerifyingOtp ? "Verifying code…" : "Verify and sign in"}
                      {!isVerifyingOtp && <ShieldCheck className="h-4 w-4" />}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-sm text-[#68756d]">
                    Didn’t receive the code?{" "}
                    <button
                      type="button"
                      onClick={() => sendOtp({ isResend: true })}
                      disabled={resendSeconds > 0 || isSendingOtp}
                      className="font-semibold text-[#4d704e] hover:underline disabled:cursor-not-allowed disabled:text-[#9aa49d] disabled:no-underline"
                    >
                      {isSendingOtp
                        ? "Sending…"
                        : resendSeconds > 0
                          ? `Resend in ${resendSeconds}s`
                          : "Resend OTP"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 border-t border-[#e5e9e2] pt-5 text-center text-xs leading-5 text-[#7b877f]">
              Never share your password or OTP with anyone, including CAWS staff.
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
