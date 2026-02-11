import "./Navbar.css";
import { useState } from "react";

import logo from "../../assets/vaulthub-mini.png";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="navbar">

            <nav>
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
                <div
                    className={`burger ${menuOpen ? "open" : ""}`}
                    onClick={toggleMenu}
                >
                    <div className="burger-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div className={`items ${menuOpen ? "active" : ""}`}>
                    <a href="/">
                        Repositories
                    </a>
                    <a href="/repositories">
                        Problems
                    </a>
                    <a href="/oroject">
                        Project
                    </a>
                    <a href="/pricing">
                        Pricing
                    </a>
                </div>
                <div className={`panel ${menuOpen ? "active" : ""}`}>
                    <a href="/login">
                        <button>
                            Sign in
                        </button>
                    </a>
                </div>
            </nav>
        </div>
    );
}
export default Navbar;
