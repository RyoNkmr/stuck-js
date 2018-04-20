/* @flow */
export function throttle(
  callback,
  context,
  duration = 5000,
  leading = true,
  trailing = true,
): () => mixed {
  let timerId = null;
  let cancel = null;
  let lastExcecutedMs = null;

  const fn = async (...args) => {
    try {
      const now = Date.now();

      if (lastExcecutedMs === null) {
        lastExcecutedMs = now;

        if (leading) {
          callback.apply(context, args);
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
      callback.apply(context, args);
    } catch (error) {
      if (error) {
        throw error;
      }
      clearTimeout(timerId);
      cancel = null;
      if (trailing) {
        fn();
      }
    }
  };
  return fn;
}

export function debounce(
  callback,
  context,
  duration = 5000,
  leading = false,
  trailing = true,
) {
  let timerId = null;
  let cancel = null;

  const fn = async (...args) => {
    try {
      if (timerId === null && leading) {
        callback.apply('debounced', context, args);
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
      callback.apply(context, args);
    } catch (error) {
      if (error) {
        throw error;
      }

      clearTimeout(timerId);
      cancel = null;

      if (trailing) {
        fn();
      }
    }
  };

  return fn;
}

export const throttled = (duration = 100, leading = true, trailing = true) => (
  (
    className,
    methodName,
    descriptor: PropertyDescriptor<T>,
  ): PropertyDescriptor<T> => {
    const undecorated = descriptor.value;
    return {
      ...descriptor,
      value: throttle(undecorated, descriptor, duration, leading, trailing),
    };
  }
);

export const debounced = (duration = 100, leading = false, trailing = true) => (
  (
    className,
    methodName,
    descriptor: PropertyDescriptor<T>,
  ): PropertyDescriptor<T> => {
    const undecorated = descriptor.value;
    return {
      ...descriptor,
      value: debounce(undecorated, descriptor, duration, leading, trailing),
    };
  }
);
