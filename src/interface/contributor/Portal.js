import React from 'react';
import { createPortal } from 'react-dom';

/*
  Wraps child and appends it to DOMs #portal-div
  necessary to avoid css inheritance
*/
// TODO: Refactor this into a common component and folder when this gets used a second time

const Portal = ({ children, onClose }) => {
  return createPortal(
    <div className="modal">
      {children}
      <div onClick={onClose} className="btn btn-primary btn-close">close</div>
    </div>,
    document.getElementById('portal')
  );
};

export default Portal;
