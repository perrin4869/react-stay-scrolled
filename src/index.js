import { useLayoutEffect, useRef, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { maxScrollTop, runScroll as defaultRunScroll } from './util';

const noop = () => {};

export default (domRef, {
  initialScroll = null,
  inaccuracy = 0,
  onStayScrolled = noop,
  onScrolled = noop,
  runScroll = defaultRunScroll,
} = {}) => {
  const wasScrolled = useRef(null);

  const isScrolled = () => Math.ceil(domRef.current.scrollTop) >= maxScrollTop(domRef.current) - inaccuracy;

  useLayoutEffect(() => {
    const onScroll = () => {
      if (wasScrolled.current = isScrolled()) { // eslint-disable-line no-cond-assign
        onScrolled();
      }
    };

    domRef.current.addEventListener('scroll', onScroll);
    return () => domRef.current.removeEventListener('scroll', onScroll);
  }, [onScrolled]);

  const scrollBottom = useCallback(() => {
    invariant(domRef.current !== null, `Trying to scroll to the bottom, but no element was found.
      Did you call this scrollBottom before the component with this hook finished mounting?`);

    const offset = maxScrollTop(domRef.current);
    runScroll(domRef.current, offset);
  }, [runScroll]);

  const stayScrolled = useCallback((notify = true) => {
    if (wasScrolled.current) scrollBottom();
    if (notify) onStayScrolled(wasScrolled.current);
  }, [scrollBottom, onStayScrolled]);

  useLayoutEffect(() => {
    if (initialScroll !== null) {
      const offset = initialScroll === Infinity ? maxScrollTop(domRef.current) : initialScroll;
      runScroll(domRef.current, offset);
    }

    wasScrolled.current = isScrolled();
  }, []);

  return {
    stayScrolled,
    scrollBottom,
  };
};
