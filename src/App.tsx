import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/home";
import Program from "./pages/Program/program";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/program"  element={<Program />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
