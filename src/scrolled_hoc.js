import { PropTypes, createElement } from 'react';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    (typeof WrappedComponent === 'string') ? WrappedComponent : 'Component'
  );
}

export default WrappedComponent => {
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
