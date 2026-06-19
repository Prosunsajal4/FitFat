export function createWorker(fn) {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
}

export function runInWorker(fn, data) {
  return new Promise((resolve, reject) => {
    const worker = createWorker(() => {
      self.onmessage = (e) => {
        try {
          const result = (${fn.toString()})(e.data);
          self.postMessage({ result });
        } catch (err) {
          self.postMessage({ error: err.message });
        }
      };
    });
    worker.onmessage = (e) => {
      worker.terminate();
      if (e.data.error) reject(new Error(e.data.error));
      else resolve(e.data.result);
    };
    worker.onerror = (e) => { worker.terminate(); reject(e); };
    worker.postMessage(data);
  });
}
