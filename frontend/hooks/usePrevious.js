export function usePrevious(value) {
  const { useRef, useEffect } = require('react');
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
