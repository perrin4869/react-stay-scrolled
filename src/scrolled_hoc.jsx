import React, { forwardRef } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import ScrolledContext from './context';

export default (WrappedComponent) => {
  function forwardScrolled(props, ref) {
    return (
      <ScrolledContext.Consumer>
        {({ stayScrolled, scrollBottom }) => (
          <WrappedComponent
            {...props}
            ref={ref}
            stayScrolled={stayScrolled}
            scrollBottom={scrollBottom}
          />
        )}
      </ScrolledContext.Consumer>
    );
  }
  forwardScrolled.displayName = `scrolled(${getDisplayName(WrappedComponent)})`;

  return hoistStatics(forwardRef(forwardScrolled), WrappedComponent);
};
