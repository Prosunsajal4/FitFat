export function createStore(initialState) {
  let state = { ...initialState };
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (updates) => {
      state = { ...state, ...(typeof updates === 'function' ? updates(state) : updates) };
      listeners.forEach((fn) => fn(state));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export function createSelector(selectors, combiner) {
  let lastArgs = null;
  let lastResult = null;
  return (state) => {
    const args = selectors.map((s) => s(state));
    if (lastArgs && args.every((a, i) => a === lastArgs[i])) return lastResult;
    lastArgs = args;
    lastResult = combiner(...args);
    return lastResult;
  };
}
