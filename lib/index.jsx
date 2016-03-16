import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class StayScrolled extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([ PropTypes.string, PropTypes.func, PropTypes.element ]),
		startScrolled: PropTypes.bool,
		onStayScrolled: PropTypes.func,
		Velocity: PropTypes.func
	};

	static defaultProps = {
		component: "div",
		startScrolled: true
	}

	static childContextTypes = {
		scrollBottom: PropTypes.func,
		stayScrolled: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.wasScrolled = props.startScrolled;

		this.onScroll = this.onScroll.bind(this);
		this.storeDOM = this.storeDOM.bind(this);
		this.scrollBottom = this.scrollBottom.bind(this);
		this.stayScrolled = this.stayScrolled.bind(this);
	}

	getChildContext() {
		return {
			scrollBottom: this.scrollBottom,
			stayScrolled: this.stayScrolled
		};
	}

	componentDidMount() {
		const { startScrolled } = this.props;

		if(startScrolled)
			this.scrollBottom();
	}

	isScrolled() {
		const dom = this.getDOM();
		return dom.scrollTop + dom.offsetHeight === dom.scrollHeight
	}

	onScroll() {
		this.wasScrolled = this.isScrolled();

		if(this.wasScrolled && this.props.onScrolled) 
			this.props.onScrolled();
	}

	stayScrolled(notify = true) {
		const { onStayScrolled } = this.props;

		if(this.wasScrolled)
			this.scrollBottom();

		if(notify && onStayScrolled)
			return onStayScrolled(this.wasScrolled);
	}

	scrollBottom() {
		const { Velocity, onScrolled } = this.props;
		const dom = this.getDOM();

		if(Velocity) { // Use smooth scrolling if available
			Velocity(
				dom.firstChild,
				'scroll', 
				{ 
					container: dom,
					offset: dom.scrollHeight,
					duration: 300,
					easing: 'ease-out',
					complete: onScrolled
				}
			);
		} else {
			const dom = this.getDOM();
			dom.scrollTop = dom.scrollHeight;

			if(onScrolled) onScrolled();
		}
	}

	getDOM() {
		return ReactDOM.findDOMNode(this.dom);
	}

	storeDOM(dom) {
		this.dom = dom;
	}

	render() {
		const  { component, children, ...rest } = this.props;

		return React.createElement(
			component, 
			{
				ref: this.storeDOM, // Inline function is problematic with null calls
				onScroll: this.onScroll,
				...rest
			},
			children
		)
	}

}
