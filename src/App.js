import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home.jsx";
import Registro from "./components/registro/Registro";
import Ingreso from "./components/ingreso/Ingreso.jsx";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Registro" element={<Registro />} />
      <Route path="/Ingreso" element={<Ingreso />} />
    </Routes>
  );
}

export default App;
