import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/home";
import Goodtube from "./pages/Goodtube/goodtube";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/goodtube" element={<Goodtube />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
