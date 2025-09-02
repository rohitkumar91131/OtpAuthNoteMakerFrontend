import React, { useEffect, useState } from "react";
import Welcome from "./Welcome";
import { useAuth } from "../../context/AuthContext";
import AllNotes from "./AllNotes";

interface User   {
  name: string;
  email: string;
  dob?: string;
}

const Note = () => {
  return (
    <div className="w-[100dvw]">
      <Welcome  />
      <AllNotes/>
    </div>
  );
};

export default Note;
