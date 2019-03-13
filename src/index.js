import { useLayoutEffect, useRef, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { maxScrollTop, runScroll as defaultRunScroll } from './util';

const noop = () => {};

export default (domRef, {
  initialScroll = null,
  inaccuracy = 0,
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

  const scroll = useCallback((position) => {
    invariant(domRef.current !== null, `Trying to scroll to the bottom, but no element was found.
      Did you call this scrollBottom before the component with this hook finished mounting?`);

    const offset = position === Infinity ? maxScrollTop(domRef.current) : position;
    runScroll(domRef.current, offset);
  }, [runScroll]);

  const scrollBottom = useCallback(() => {
    scroll(Infinity);
  }, [scroll]);

  const stayScrolled = useCallback(() => {
    if (wasScrolled.current) scrollBottom();

    return wasScrolled.current;
  }, [scrollBottom]);

  useLayoutEffect(() => {
    if (initialScroll !== null) {
      scroll(initialScroll);
    }

    wasScrolled.current = isScrolled();
  }, []);

  return {
    scroll,
    stayScrolled,
    scrollBottom,
  };
};
