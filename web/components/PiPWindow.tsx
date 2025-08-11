import React from 'react';
import { createPortal } from 'react-dom';

interface PiPWindowProps {
  pipWindow: Window;
  children: React.ReactNode;
}

export const PiPWindow: React.FC<PiPWindowProps> = ({ pipWindow, children }) => {
  return createPortal(children, pipWindow.document.body);
};
