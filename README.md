# SemaphoreJS

A functional-style Semaphore for managing concurrent access to a resource with async functions and Promises.

Use it to limit access to an async function:

```javascript
import Semaphore from 'semaphorejs';

let semaphore = Semaphore(navigator.hardwareConcurrency || 4);

// Main
(async () => {
  // ...

  let result = await semaphore(async () => {
    console.log('Acquired a lock!');
    return await accessDB();
  });

  // ...
});
```

At most, 4 instances of `accessDB()` will run at the same time. There's some boilerplate that can be eliminated with the `limit()` helper, which transforms any async function into a "rate limited" async function:

```javascript
import { limit } from 'semaphorejs';

let intensiveAction = async (data) => {
  console.log(`START ${data}`);
  let result = await doSomeWork(data);
  console.log(`END ${data}`);
  return result;
};

let limitedIntensiveAction = limit(2, intensiveAction);

// Main
(async () => {
  // ...

  let [ result1, result2, result3, result4 ] = await Promise.all([
    limitedIntensiveAction('one'),
    limitedIntensiveAction('two'),
    limitedIntensiveAction('three'),
    limitedIntensiveAction('four'),
  ]);
});

// => START one
// => START two
// => END one
// => START three
// => END two
// => START four
// => END three
// => END four
```

Most of the time, you should use `limit()` instead of creating a Semaphore yourself. `limit()` preserves your existing API and simply "decorates" the async function with rate limiting.
