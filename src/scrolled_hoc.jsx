import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

export default (WrappedComponent) => {
  const Scrolled = (props, context) => {
    const { stayScrolled, scrollBottom } = context;
    const { forwardedRef } = props;

    return (
      <WrappedComponent
        {...props}
        ref={forwardedRef}
        stayScrolled={stayScrolled}
        scrollBottom={scrollBottom}
      />
    );
  };

  Scrolled.displayName = `scrolled(${getDisplayName(WrappedComponent)})`;
  Scrolled.WrappedComponent = WrappedComponent;

  Scrolled.contextTypes = {
    stayScrolled: PropTypes.func.isRequired,
    scrollBottom: PropTypes.func.isRequired,
  };

  const HoistedScrolled = hoistStatics(Scrolled, WrappedComponent);

  function forwardScrolled(props, ref) {
    return <HoistedScrolled {...props} forwardedRef={ref} />;
  }
  forwardScrolled.displayName = Scrolled.displayName;

  return forwardRef(forwardScrolled);
};
