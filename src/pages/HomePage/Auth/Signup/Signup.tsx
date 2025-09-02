import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

type FormDataType = {
  name: string;
  dob: string;
  email: string;
  otp: string;
};

export default function Signup() {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });

  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verified, setVerified] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const auth = useAuth() as { setIsLoginPageInTheWindow?: (v: boolean) => void } | undefined;
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormDataType));
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email before sending OTP.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setShowOtp(true);
        setVerified(false);
        setOtpInput("");
        toast.success(data.msg || `OTP sent to ${formData.email}`);
      } else {
        setOtpSent(false);
        toast.error(data.msg || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP");
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
        body: JSON.stringify({ email: formData.email, otp: otpInput }),
      });

      const data = await res.json();
      if (data.success) {
        setVerified(true);
        setFormData((prev) => ({ ...prev, otp: otpInput } as FormDataType));
        toast.success(data.msg || "OTP verified");
      } else {
        setVerified(false);
        toast.error(data.msg || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!verified) {
      toast.error("Please verify your email with OTP before signing up.");
      return;
    }
    if (signingUp) {
      toast.info("Signup already in progress...");
      return;
    }
    setSigningUp(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: formData.name, dob: formData.dob }),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success(data.msg || "Signup successful");
        navigate("/notes");
      } else {
        toast.error(data.msg || "Signup failed");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to signup");
    } finally {
      setSigningUp(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-[100dvh] bg-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center mb-2">
          <img src="logo.png" alt="HD logo" className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-bold">Sign up</h2>
        <p className="text-gray-500">Sign up to enjoy the feature of HD</p>

        <div className="space-y-4 text-left">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {sendingOtp ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
          </div>

          {showOtp && (
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

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition"
        >
          {signingUp ? "Signing up..." : "Sign up"}
        </button>

        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => auth?.setIsLoginPageInTheWindow?.(true)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}
