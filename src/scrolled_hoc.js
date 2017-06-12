import { createElement } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

export default (WrappedComponent) => {
  const Scrolled = (props, context) => {
    const { stayScrolled, scrollBottom } = context;
    return createElement(WrappedComponent, { ...props, stayScrolled, scrollBottom });
  };

  Scrolled.displayName = `scrolled(${getDisplayName(WrappedComponent)})`;
  Scrolled.WrappedComponent = WrappedComponent;

  Scrolled.contextTypes = {
    stayScrolled: PropTypes.func.isRequired,
    scrollBottom: PropTypes.func.isRequired,
  };

  return hoistStatics(Scrolled, WrappedComponent);
};
