export default function ViewInSpace() {
  return (
    <section id="viewSpace">
      <div className="section-inner view-space">
        <h2>View in Your Space</h2>
        <p className="subtitle">See the 3D model in your room</p>

        <div className="video-mockup">
          <div className="video-bar">
            <div className="dot dot-red" />
            <div className="dot dot-yellow" />
            <div className="dot dot-green" />
          </div>
          <div className="video-content">
            <div className="play-btn">
              <svg width="22" height="22" fill="#2563eb" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <p className="video-caption">Experience how it fits in your environment</p>
      </div>
    </section>
  );
}
