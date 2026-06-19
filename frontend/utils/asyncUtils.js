export function throttleAsync(fn, ms = 1000) {
  let lastCall = 0;
  let pending = null;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      return fn(...args);
    }
    if (!pending) {
      pending = new Promise((resolve) => {
        setTimeout(async () => {
          lastCall = Date.now();
          const result = await fn(...args);
          pending = null;
          resolve(result);
        }, ms - (now - lastCall));
      });
    }
    return pending;
  };
}

export function batchCalls(fn, delay = 0) {
  let timer;
  let latestArgs;
  return (...args) => {
    latestArgs = args;
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...latestArgs)), delay);
    });
  };
}
