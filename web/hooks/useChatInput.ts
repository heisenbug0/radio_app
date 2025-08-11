import { useState, useRef, useEffect, useCallback } from 'react';

export const useChatInput = (isOpen: boolean) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when chat panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Clear input when chat panel closes
  const clearInput = useCallback(() => {
    setInputValue('');
  }, []);

  // Update input value
  const updateInput = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Focus input manually
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return {
    inputValue,
    inputRef,
    clearInput,
    updateInput,
    focusInput,
  };
};