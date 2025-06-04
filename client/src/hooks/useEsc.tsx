import { useEffect } from "react";

export default function useEsc({
  onClose,
  block_close = false,
}: {
  onClose: () => void;
  block_close?: boolean;
}): void {
  const closeOnEscapeKeyDown = (e: { charCode: any; keyCode: any }) => {
    if ((e.charCode || e.keyCode) === 27 && !block_close) {
      onClose();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    }

    return function cleanup() {
      if (typeof window !== "undefined") {
        document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
      }
    };
  }, [onClose, block_close]);
}

export function useEscWithoutOnCloseDependency({
  onClose,
  block_close = false,
}: {
  onClose: () => void;
  block_close?: boolean;
}): void {
  const closeOnEscapeKeyDown = (e: { charCode: any; keyCode: any }) => {
    if ((e.charCode || e.keyCode) === 27 && !block_close) {
      onClose();
    }
  };

  useEffect(() => {
    if (document) {
      document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    }

    return function cleanup() {
      if (document) {
        document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
      }
    };
  }, [document, block_close]);
}
