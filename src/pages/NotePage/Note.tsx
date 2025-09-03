import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "./Welcome";
import AllNotes from "./AllNotes";
import { toast } from "react-toastify";

const Note = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch("/verify", {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();

        if (!data.success) {
          navigate("/");
          toast(data.msg)
        }
      } catch (err) {
        navigate("/");
      }
    };

    checkAccess();
  }, [navigate]);

  return (
    <div className="w-[100dvw]">
      <Welcome />
      <AllNotes />
    </div>
  );
};

export default Note;
