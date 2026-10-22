'use client';

import { useEffect } from 'react';

// Rotating true-size preview. On phones the AR button opens the live camera with the item at real scale:
// WebXR / Scene Viewer on Android, Quick Look on iPhone (model-viewer converts the GLB to USDZ itself).
export default function ProductViewer({ item }) {
  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  return (
    <model-viewer
      src={item.modelUrl}
      alt={item.name || 'Listed item'}
      camera-controls=""
      auto-rotate=""
      ar=""
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="fixed"
      shadow-intensity="1"
      touch-action="pan-y"
      style={{ width: '100%', height: '100%' }}
    >
      <button slot="ar-button" className="btn-primary ar-button">
        View in your room
      </button>
    </model-viewer>
  );
}
