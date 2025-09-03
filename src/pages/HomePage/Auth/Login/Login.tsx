import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { AlertTriangle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth() as { setIsLoginPageInTheWindow?: (v: boolean) => void } | undefined;

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email before sending OTP.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.msg);
        setOtpSent(true);
      } else {
        toast.error(data.msg || "Failed to send OTP");
        setOtpSent(false);
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput.trim()) {
      toast.error("Enter the OTP first");
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp: otpInput }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.msg);
        await login();
      } else {
        toast.error(data.msg || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to verify OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const login = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.msg);
        navigate("/notes");
      } else {
        toast.error(data.msg || "Login failed");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to login");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-white px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center items-center mb-2 gap-2">
          <img src="./logo.png" alt="HD logo" className="w-10 h-10" />
          <p className="font-bold text-2xl">HD</p>
        </div>

        <h2 className="text-3xl font-bold">Sign in with Email</h2>
        <p className="text-gray-500">We’ll send you an OTP for verification</p>

        <div className="space-y-4 text-left">
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoFocus
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                {sendingOtp ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
                className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyingOtp}
                className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50"
              >
                {verifyingOtp ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm mt-4 justify-center">
          <AlertTriangle className="w-5 h-5" />
          <span>Please make sure your browser allows third-party cookies for this app.</span>
        </div>

        <p className="text-gray-600 text-sm mt-2">
          Don’t have an account?{" "}
          <span
            onClick={() => auth?.setIsLoginPageInTheWindow?.(false)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
