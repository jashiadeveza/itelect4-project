import { useCallback, useState } from "react";

export interface UseToggleResult {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export function useToggle(initialValue = false): UseToggleResult {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((current) => !current);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse };
}
