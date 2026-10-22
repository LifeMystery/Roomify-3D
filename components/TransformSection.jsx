import ProductViewer from '@/components/ProductViewer';

export default function TransformSection({ item }) {
  const scrollToViewSpace = () => {
    document.getElementById('viewSpace')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="how-it-works">
      <div className="section-inner transform">
        <h2>Your Listed Item</h2>
        <p className="subtitle">Spin it around, then tap “View in your room” on your phone to see it through your camera at real size</p>

        <div className="model-card">
          <div className={`model-display${item ? ' has-model' : ''}`}>
            {item ? (
              <ProductViewer item={item} />
            ) : (
              <div className="model-display-placeholder">
                <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth="1.5">
                  <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                <span style={{ fontSize: '13px' }}>List an item to see it here</span>
              </div>
            )}
          </div>

          {item && (
            <p className="item-dims">
              {item.name && <strong>{item.name} · </strong>}
              {item.widthCm} W × {item.heightCm} H{item.depthCm ? ` × ${item.depthCm} D` : ''} cm
            </p>
          )}

          <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={scrollToViewSpace}>
            No AR on your phone? Use a photo instead →
          </button>
        </div>
      </div>
    </section>
  );
}
