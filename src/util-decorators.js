/* @flow */
export function throttle(
  callback,
  duration = 5000,
  leading = true,
  trailing = true,
): () => mixed {
  let timerId = null;
  let cancel = null;
  let lastExcecutedMs = null;

  const fn = async function _throttle(...args) {
    try {
      const now = Date.now();

      if (lastExcecutedMs === null) {
        lastExcecutedMs = now;

        if (leading) {
          callback.apply(this, args);
          return;
        }
      }

      if (timerId && cancel) {
        cancel();
      }

      await new Promise((resolve, reject) => {
        timerId = setTimeout(resolve, (lastExcecutedMs + duration) - now);
        cancel = reject;
      });

      lastExcecutedMs = now;
      callback.apply(this, args);
    } catch (error) {
      if (error) {
        throw error;
      }
      clearTimeout(timerId);
      cancel = null;
      if (trailing) {
        fn.apply(this, args);
      }
    }
  };
  return fn;
}

export function debounce(
  callback,
  duration = 5000,
  leading = false,
  trailing = true,
) {
  let timerId = null;
  let cancel = null;

  const fn = async function _debounce(...args) {
    try {
      if (timerId === null && leading) {
        callback.apply(this, args);
      }

      if (timerId && cancel) {
        if (!leading) {
          cancel();
        }
        clearTimeout(timerId);
      }

      await new Promise((resolve, reject) => {
        timerId = setTimeout(resolve, duration);
        cancel = reject;
      });

      timerId = null;
      cancel = null;

      if (leading && !trailing) {
        return;
      }
      callback.apply(this, args);
    } catch (error) {
      if (error) {
        throw error;
      }

      clearTimeout(timerId);
      cancel = null;

      if (trailing) {
        fn.apply(this, args);
      }
    }
  };
  return fn;
}

export const throttled = (duration = 100, leading = true, trailing = true) => (
  (
    targetClass: Class,
    methodName: string,
    descriptor: PropertyDescriptor<T>,
  ): PropertyDescriptor<T> => ({
    ...descriptor,
    value: throttle(descriptor.value, duration, leading, trailing),
  })
);

export const debounced = (duration = 100, leading = false, trailing = true) => (
  (
    targetClass: Class,
    methodName: string,
    descriptor: PropertyDescriptor<T>,
  ): PropertyDescriptor<T> => ({
    ...descriptor,
    value: debounce(descriptor.value, duration, leading, trailing),
  })
);
