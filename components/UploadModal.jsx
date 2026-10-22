'use client';

import { useState } from 'react';
import CardMeasure from '@/components/CardMeasure';
import { buildBoxModel, canvasToBlob, cropToCanvas } from '@/lib/buildModel';

const VIEWS = [
  {
    key: 'front',
    label: 'Front',
    required: true,
    axes: ['Width', 'Height'],
    hint: 'Stand straight in front of the item. Hold a card flat against the front.',
  },
  {
    key: 'side',
    label: 'Side',
    required: true,
    axes: ['Depth', 'Height'],
    hint: 'Shoot the right-hand side straight on (front edge on the left of the photo). Card flat against the side.',
  },
  {
    key: 'top',
    label: 'Top',
    required: false,
    axes: ['Width', 'Depth'],
    hint: 'Optional. Shoot from directly above with the front at the bottom of the photo. Card flat on top.',
  },
];

const EMPTY_DIMS = { widthCm: '', heightCm: '', depthCm: '' };

// front gives width × height, side gives depth × height, top gives width × depth
function deriveDims(m) {
  const dims = {};
  const width = m.front?.xCm ?? m.top?.xCm;
  const height = m.front?.yCm ?? m.side?.yCm;
  const depth = m.side?.xCm ?? m.top?.yCm;
  if (width) dims.widthCm = width;
  if (height) dims.heightCm = height;
  if (depth) dims.depthCm = depth;
  return dims;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [activeView, setActiveView] = useState('front');
  const [files, setFiles] = useState({});
  const [measures, setMeasures] = useState({});
  const [dims, setDims] = useState(EMPTY_DIMS);
  const [name, setName] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [status, setStatus] = useState(null); // { message, type }
  const [isUploading, setIsUploading] = useState(false);

  const view = VIEWS.find((v) => v.key === activeView);

  const handleClose = () => {
    setActiveView('front');
    setFiles({});
    setMeasures({});
    setDims(EMPTY_DIMS);
    setName('');
    setProgress(0);
    setShowProgress(false);
    setStatus(null);
    onClose();
  };

  const handleFile = (key, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFiles({ ...files, [key]: file });
    setMeasures({ ...measures, [key]: null });
  };

  const handleMeasured = (key, m) => {
    const next = { ...measures, [key]: m };
    setMeasures(next);
    setDims((d) => ({ ...d, ...deriveDims(next) }));
  };

  const handleUpload = async () => {
    const missing = VIEWS.find((v) => v.required && !measures[v.key]);
    if (missing) {
      setActiveView(missing.key);
      setStatus({ message: `Add and measure the ${missing.label.toLowerCase()} photo.`, type: 'error' });
      return;
    }
    const widthCm = Number(dims.widthCm);
    const heightCm = Number(dims.heightCm);
    const depthCm = Number(dims.depthCm);
    if (!(widthCm > 0 && heightCm > 0 && depthCm > 0)) {
      setStatus({ message: 'Width, height and depth are all needed.', type: 'error' });
      return;
    }

    setShowProgress(true);
    setProgress(15);
    setStatus({ message: 'Building 3D model…', type: 'success' });
    setIsUploading(true);

    try {
      const [front, side, top] = await Promise.all(
        VIEWS.map((v) => (measures[v.key] ? cropToCanvas(files[v.key], measures[v.key].rect) : null))
      );
      const model = await buildBoxModel({ widthCm, heightCm, depthCm, front, side, top });
      setProgress(50);

      const formData = new FormData();
      formData.append('product', await canvasToBlob(front), 'front.jpg');
      formData.append('model', model, 'item.glb');
      formData.append('name', name);
      formData.append('widthCm', widthCm);
      formData.append('heightCm', heightCm);
      formData.append('depthCm', depthCm);

      setStatus({ message: 'Uploading…', type: 'success' });
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      setProgress(90);
      const data = await res.json();

      if (data.success) {
        setProgress(100);
        setStatus({ message: 'Item listed! Buyers can now see it in their space.', type: 'success' });
        onUploadSuccess(data.item);
        setTimeout(() => {
          handleClose();
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }, 1200);
      } else {
        setStatus({ message: data.message || 'Upload failed. Please try again.', type: 'error' });
        setProgress(0);
      }
    } catch (err) {
      console.error(err);
      setStatus({ message: 'Something went wrong. Please try again.', type: 'error' });
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal modal-wide">
        <h2>List an Item</h2>
        <p>Take each photo with any bank, ID or Smart Shopper card on the item — it&apos;s the ruler.</p>

        <div className="view-tabs">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              className={`btn-ghost${activeView === v.key ? ' active' : ''}`}
              onClick={() => setActiveView(v.key)}
            >
              {measures[v.key] ? '✓ ' : ''}{v.label}{v.required ? '' : ' (optional)'}
            </button>
          ))}
        </div>

        <p className="view-hint">{view.hint}</p>

        <label className="drop-zone">
          <p>{files[view.key] ? `✓ ${files[view.key].name}` : `Take / choose ${view.label.toLowerCase()} photo`}</p>
          <span>PNG, JPG or WebP</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(view.key, e.target.files?.[0])}
          />
        </label>

        {files[view.key] && (
          <CardMeasure
            key={view.key}
            file={files[view.key]}
            axisLabels={view.axes}
            onMeasured={(m) => handleMeasured(view.key, m)}
          />
        )}

        <div className="item-fields">
          <label className="fit-field item-name">
            Item name
            <input type="text" placeholder="e.g. 3-seater couch" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          {[['widthCm', 'Width'], ['heightCm', 'Height'], ['depthCm', 'Depth']].map(([key, label]) => (
            <label key={key} className="fit-field">
              {label} (cm)
              <input
                type="number"
                min="1"
                value={dims[key]}
                onChange={(e) => setDims({ ...dims, [key]: e.target.value })}
              />
            </label>
          ))}
        </div>

        {showProgress && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {status && (
          <div className={`status-msg ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleUpload} disabled={isUploading}>
            List Item
          </button>
        </div>
      </div>
    </div>
  );
}
