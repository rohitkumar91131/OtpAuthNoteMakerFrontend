import { ToastContainer } from "react-toastify";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from "./pages/HomePage/Home";
import { AuthProvider } from "./context/AuthContext";
import Note from "./pages/NotePage/Note";
export default function App(){
  return (
    <BrowserRouter>
    <AuthProvider>
    <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
       <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/:notes" element={<Note/>} />
       </Routes>   
       </AuthProvider>
    </BrowserRouter>
  )
}