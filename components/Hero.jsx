export default function Hero({ onUploadPhoto, onWatchDemo }) {
  return (
    <section id="home">
      <div className="section-inner hero">
        <div className="hero-text">
          <h1>See If It Fits<br />Before You Buy</h1>
          <p>
            Sellers snap the front, side and top with any bank, ID or Smart Shopper<br />
            card as a ruler. Buyers see it in 3D, at real size, in their own room.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onUploadPhoto}>
              Sell an Item
            </button>
            <button className="btn-outline" onClick={onWatchDemo}>
              How It Works
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="phone-screen-placeholder">
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                >
                  <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <span style={{ fontSize: '13px', color: '#d1d5db' }}>Camera Ready</span>
              </div>
              <div className="camera-circle" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
