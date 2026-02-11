import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home/Home.tsx";
import Login from "./pages/Login/Login.tsx";
// import { PrivateRoute } from './components/PrivateRoute';

function App() {
    return (
        // <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        // </AuthProvider>
    );
}

export default App;
