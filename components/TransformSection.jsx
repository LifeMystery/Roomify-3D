export default function TransformSection({ modelUrl }) {
  const scrollToViewSpace = () => {
    document.getElementById('viewSpace')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="how-it-works">
      <div className="section-inner transform">
        <h2>Object Transformed to 3D</h2>
        <p className="subtitle">Your photo is now a 3D model!</p>

        <div className="model-card">
          <div className="model-display">
            {modelUrl ? (
              <img src={modelUrl} alt="3D Model Preview" />
            ) : (
              <div className="model-display-placeholder">
                <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth="1.5">
                  <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                <span style={{ fontSize: '13px' }}>Upload a photo to see your 3D model</span>
              </div>
            )}
          </div>

          <div className="model-actions">
            <button className="btn-ghost">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Rotate
            </button>
            <button className="btn-ghost">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Adjust
            </button>
            <button className="btn-ghost">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Preview
            </button>
          </div>

          <button className="btn-primary" style={{ width: '100%' }} onClick={scrollToViewSpace}>
            Next: See in Your Space →
          </button>
        </div>
      </div>
    </section>
  );
}
