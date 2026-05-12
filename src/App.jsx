import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Books from "./components/Books";
import BookDetail from "./components/BookDetail";
import Account from "./components/Account";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return ( 
    <BrowserRouter>
      <NavBar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail token={token} />} />
        <Route path="/account" element={<Account token={token} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );
}
