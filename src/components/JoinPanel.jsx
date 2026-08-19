import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * The join panel on the host screen: big QR plus the code spelled out, because someone in
 * the room always has a camera that refuses to cooperate.
 */
export default function JoinPanel({ code, compact = false }) {
  const [dataUrl, setDataUrl] = useState(null);
  const joinUrl = `${window.location.origin}/j/${code}`;

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(joinUrl, {
      width: 640,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0d0f14', light: '#ffffff' },
    })
      .then((url) => alive && setDataUrl(url))
      .catch(() => alive && setDataUrl(null));
    return () => {
      alive = false;
    };
  }, [joinUrl]);

  return (
    <div className={`join-panel${compact ? ' join-panel--compact' : ''}`}>
      <div className="join-panel__qr">
        {dataUrl ? (
          <img src={dataUrl} alt={`QR code to join game ${code}`} />
        ) : (
          <div className="join-panel__qr-fallback">Loading…</div>
        )}
      </div>
      <div className="join-panel__text">
        <p className="join-panel__step">Scan, or go to</p>
        <p className="join-panel__url">
          {window.location.host}
          <span className="join-panel__dim">/join</span>
        </p>
        <p className="join-panel__step">and enter the code</p>
        <p className="join-panel__code">{code}</p>
      </div>
    </div>
  );
}
