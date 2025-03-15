export function throttle(fn, delay, ctx) {
  let lastCall = 0;
  let timeout;
  let lastArgs;

  return function(...args) {
    const now = Date.now();

    if (!lastCall) {
      fn.apply(ctx, args);
      lastCall = now;
      return;
    }

    if (now - lastCall >= delay) {
      fn.apply(ctx, args);
      lastCall = now;
    } else {
      lastArgs = args;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (lastArgs) {
          fn.apply(ctx, lastArgs);
          lastCall = Date.now();
          lastArgs = null;
        }
      }, delay - (now - lastCall));
    }
  };
}
