import { useState } from "react";

function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [declined, setDeclined] = useState(false);

  return (
    <div className="gen-overlay age-gate" role="dialog" aria-modal="true" aria-label="Parent check">
      <div className="gen-card">
        <span className="gen-emoji" aria-hidden="true">
          {"\u{1F4DA}"}
        </span>
        <p className="gen-message">A grown-up sets things up</p>
        {declined ? (
          <>
            <p className="gen-hint">
              Please ask a parent or grown-up to set up Little Hero Stories for you. Then you can
              read together!
            </p>
            <button type="button" className="nav-button" onClick={() => setDeclined(false)}>
              Back
            </button>
          </>
        ) : (
          <>
            <p className="gen-hint">
              Little Hero Stories is set up by parents. Please confirm you are over 18 years old.
            </p>
            <div className="finish-actions">
              <button type="button" className="nav-button" onClick={() => setDeclined(true)}>
                Not yet
              </button>
              <button type="button" className="nav-button primary age-confirm" onClick={onConfirm}>
                Yes, I'm over 18
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AgeGate;
