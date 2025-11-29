import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import slide1 from './assets/slide1.png';
import slide2 from './assets/slide2.jpg';
import slide3 from './assets/slide3.png';
import { motion } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Expenses from './components/Expense'; 

function AppContent() {
  const navigate = useNavigate();

  const heroSlides = [
    { image: slide1, title: "Track Every Rupee", highlight: "With Xpense Distributor", subtext: "Split and settle group expenses easily and transparently." },
    { image: slide2, title: "Simplify Shared Costs", highlight: "For Friends, Teams & Families", subtext: "Automatically calculate who owes what in seconds." },
    { image: slide3, title: "Built for Collaboration", highlight: "Stay On Top of Group Expenses", subtext: "Real-time updates, detailed reports, and seamless settlements." }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timeout);
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const content = document.querySelector('.hero-content');
    if (content) {
      content.classList.remove('fadeIn');
      void content.offsetWidth;
      content.classList.add('fadeIn');
    }
  }, [currentSlide]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleNavLinkClick = () => setMenuOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLogin(false);
    setShowSignup(false);
    navigate('/expenses');
  };

  return (
    <>
     {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-white fs-3" href="#">Xpenses</a>
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse justify-content-end ${menuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav fw-bold text-end">
              <li className="nav-item">
                <a href="#login" className="nav-link" onClick={() => { setShowLogin(true); handleNavLinkClick(); }}>Login</a>
              </li>
              <li className="nav-item">
                <a href="#signup" className="nav-link" onClick={() => { setShowSignup(true); handleNavLinkClick(); }}>Sign Up</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="hero-section-wrapper">
        <div className="hero-slide" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroSlides[currentSlide].image})`
        }}>
          <div className="hero-content slide-up">
            <h1 className={`hero-title ${animate ? 'bounce' : ''}`}>
              {heroSlides[currentSlide].title}<br />
              <motion.span
                key={heroSlides[currentSlide].highlight}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="typing-text"
              >
                {heroSlides[currentSlide].highlight}
              </motion.span>
            </h1>
            <p className="hero-subtext mt-3">{heroSlides[currentSlide].subtext}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary mt-4 px-4 py-2"
              onClick={() => setShowLogin(true)}
            >
              Let’s Start
            </motion.button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {heroSlides.map((_, index) => (
            <span key={index} className={`indicator ${index === currentSlide ? 'active' : ''}`}></span>
          ))}
        </div>

        {/* Nav Buttons */}
        <button className="nav-button left" onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}>❮</button>
        <button className="nav-button right" onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}>❯</button>
      </div>

      {/* Login Modal */}
      {showLogin && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-4">
        <h5 className="modal-title mb-3">Login</h5>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="form-control mb-2" required />
          <input type="password" placeholder="Password" className="form-control mb-3" required />
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => setShowLogin(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
        <div className="mt-3 text-center">
          <small>
            New here?{" "}
            <button className="btn btn-link p-0" onClick={() => { setShowLogin(false); setShowSignup(true); }}>
              Sign Up
            </button>
          </small>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Signup Modal */}
      {showSignup && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-4">
        <h5 className="modal-title mb-3">Sign Up</h5>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" className="form-control mb-2" required />
          <input type="email" placeholder="Email" className="form-control mb-2" required />
          <input type="password" placeholder="Password" className="form-control mb-3" required />
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => setShowSignup(false)}>Cancel</button>
            <button type="submit" className="btn btn-success">Sign Up</button>
          </div>
        </form>
        <div className="mt-3 text-center">
          <small>
            Already have an account?{" "}
            <button className="btn btn-link p-0" onClick={() => { setShowSignup(false); setShowLogin(true); }}>
              Login
            </button>
          </small>
        </div>
      </div>
    </div>
  </div>
)}
 
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="expenses" element={<Expenses />} />
<Route path="expense" element={<AppContent />} />


    </Routes>
  );
}

export default App;
