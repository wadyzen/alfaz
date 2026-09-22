import { useEffect } from "react";

function SideMenu({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`menu-overlay ${isOpen ? "open" : ""}`}
        onClick={handleOverlayClick}
      />

      <aside className={`side-menu ${isOpen ? "open" : ""}`}>
        <div className="menu-header">
          <h2 className="menu-title">Menu</h2>
          <button
            className="menu-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="menu-content">{children}</div>
      </aside>
    </>
  );
}

export default SideMenu;
