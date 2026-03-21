export default function Navbar({ onGetStarted }) {
  return (
    <nav>
      <a className="nav-logo" href="#">
        <div className="nav-logo-icon">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </div>
        Roomify 3D
      </a>

      <ul className="nav-links">
        <li>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>
            How it Works
          </a>
        </li>
        <li>
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Features
          </a>
        </li>
      </ul>

      <button className="btn-primary" onClick={onGetStarted}>
        Get Started
      </button>
    </nav>
  );
}
