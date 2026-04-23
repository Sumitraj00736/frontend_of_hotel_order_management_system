import React from 'react';
import { QrCode } from 'lucide-react';

const WebsiteQrPreview = ({ restaurantName, shareLink }) => (
  <div className="web-qr-card">
    <div className="web-qr-brand">
      <div className="web-qr-logo">V</div>
      <div>
        <strong>{restaurantName}</strong>
        <span>merorestro</span>
      </div>
    </div>
    <div className="web-qr-frame">
      <QrCode size={170} strokeWidth={1.4} />
    </div>
    <div className="web-qr-link">{shareLink}</div>
  </div>
);

export default WebsiteQrPreview;
