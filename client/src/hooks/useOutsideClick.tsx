import { useEffect } from "react";

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  ignoreRefs: React.RefObject<HTMLElement | null>[] = []
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !ignoreRefs.some((ignoreRef) =>
          ignoreRef.current?.contains(event.target as Node)
        )
      ) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    if (!ref.current) return;
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, ignoreRefs]);
}

export default useOutsideClick;
