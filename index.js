let Semaphore = (max) => {
  let tasks = [];
  let counter = max;

  let dispatch = () => {
    if (counter > 0 && tasks.length > 0) {
      counter--;
      tasks.shift()();
    }
  };

  let release = () => {
    counter++;
    dispatch();
  };

  let acquire = () =>
    new Promise(resolve => {
      tasks.push(resolve);
      setImmediate(dispatch);
    });

  return async fn => {
    await acquire();
    let result;
    try {
      result = await fn();
    } catch(e) {
      throw e;
    } finally {
      release();
    }
    return result;
  };
};

export let limit = (max, fn) => {
  let semaphore = Semaphore(max);
  return (...args) =>
    semaphore(() => fn(...args));
};

export default Semaphore;
