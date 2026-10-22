export default function Features({ onUploadPhoto }) {
  return (
    <section id="features">
      <div className="section-inner features">
        <h2>Why It Works</h2>
        <p className="subtitle">A card in the seller’s photos is the ruler</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2">
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h3>True Scale</h3>
            <p>Every bank, ID and Smart Shopper card is 85.6 × 54 mm, so it sets the scale</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2">
                <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </div>
            <h3>In Your Room</h3>
            <p>Spin the 3D item, then see it through your phone camera at real scale</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Perfect Fit</h3>
            <p>Measure your gap and see exactly how many cm are left</p>
          </div>
        </div>

        <div className="cta-block">
          <h3>Get Started Today!</h3>
          <p>List your first item in under a minute.</p>
          <button
            className="btn-primary"
            style={{ fontSize: '16px', padding: '14px 32px' }}
            onClick={onUploadPhoto}
          >
            List an Item
          </button>
        </div>
      </div>
    </section>
  );
}
