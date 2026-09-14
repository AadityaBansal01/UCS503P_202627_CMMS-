export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

