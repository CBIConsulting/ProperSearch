import React from 'react';
import _ from 'underscore';
import Dimensions from 'react-dimensions';
import {shallowEqualImmutable} from 'react-immutable-render-mixin';


// For more info about this read ReadMe.md
function getDefaultProps() {
	return {
		clearable: true,
		defaultValue: '',
		placeholder: 'Search...',
		searchIcon: 'fa fa-search fa-fw',
		clearIcon: 'fa fa-times fa-fw',
		onSearch: null,
		onEnter: null,
		throttle: 160, // milliseconds
		sendEmpty: true,
		minLength: 3,
		autoComplete: 'off'
	}
}

/**
 * A Component that render a search field which return the written string every props.trottle miliseconds as a parameter
 * in a function of onSearch, only if the length is bigger than props.minlength. Get clean each time the Scape key is down/up or the
 * clear button is cliked.
 *
 * Simple example usage:
 *
 * 	<SeachField
 *		onSearch={value => console.log(value)}
 *	/>
 * ```
 */
class SearchField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showClear: false,
			inputValue: ''
		};
	}

	componentWillMount() {
		this.onChange = (e => {
			let	value;

			e.preventDefault();

			// Scape key
			if (e.keyCode==27) {
				this.clearField(e);
				return;
			}

			// Enter key
			if (e.keyCode == 13) {
				if (typeof this.props.onEnter == 'function') {
					this.props.onEnter.call(this);
				}
			}

			// If there is a call to the update functions and to send the search filter then reset it.
			if (this.tout) {
				clearTimeout(this.tout);
			}

			value = this.getInputValue();

			if (value.length >= this.props.minLength || this.props.sendEmpty && !value.length) {
				this.tout = setTimeout(() => {
					value = this.getInputValue();
					this.updateClear(value);
					this.sendFilter(value);

				}, this.props.throttle);
			}
		});
	}

	shouldComponentUpdate(nextProps, nextState){
		let stateChanged = !shallowEqualImmutable(this.state, nextState);
		let propsChanged = !shallowEqualImmutable(this.props, nextProps);
		let somethingChanged = propsChanged || stateChanged;

		if (propsChanged) {
			if (nextProps.defaultValue != this.props.defaultValue) {
				this.updateClear(nextProps.defaultValue);
				this.setState({inputValue: nextProps.defaultValue});
				this.getInput().value = nextProps.defaultValue;

				return false;
			}
		}

		if (stateChanged) {
			if (nextState.inputValue != this.state.inputValue) {
				this.sendFilter(nextState.inputValue);
				return false;
			}
		}


		return somethingChanged;
	}

	componentDidUpdate(prevProps, prevState) {
		let el = this.getInput();

		if (el) {
			el.focus();
		}
	}

	componentDidMount() {
		if (this.props.defaultValue || this.props.sendEmpty) {
			this.sendFilter(this.props.defaultValue);
		}

		this.updateClear(this.props.defaultValue);
	}

/**
 * Get the value of the search input field.
 *
 * @return (String)	searchValue 	Search field value
 */
	getInputValue() {
		let el = this.getInput();

		if (el) {
			return el.value;
		}

		return this.props.defaultValue;
	}

/**
 * Get a ref to the search field input
 *
 * @return (object)	el 	A ref to the search field input
 */
	getInput() {
		let el = this.el || null;

		if (!el) {
			this.el = this.refs.propersearch_field;
			return this.el;
		}

		return el;
	}

/**
 * Clear the search field
 */
	clearField(e) {
		e.preventDefault();
		let el = this.getInput();

		if (el) {
			el.value = '';
		}

		this.sendFilter(null);
		this.updateClear(null)
	}

/**
 * Update the show state of the component to show / hide the clear button.
 *
 * @param (String)	value 	Search field value
 */
	updateClear(value) {
		let show = false;

		if (value && value.length) {
			show = true;
		}

		if(this.state.showClear != show) {
			this.setState({
				showClear: show
			});
		}
	}

/**
 * Send the value in the search field to the function onSearch if this was set up in the props.
 *
 * @param (String)	value 	Search field value
 */
	sendFilter(value) {
		if (typeof this.props.onSearch == 'function') {
			this.props.onSearch.call(this, value);
		}
	}

	render() {
		let className = 'proper-search-field', uniqueId = _.uniqueId('search-'), clearBtn = null;

		if (this.props.className) {
			className += ' '+this.props.className;
		}

		if (this.props.uniqueId) {
			uniqueId = this.props.uniqueId;
		}

		if (this.state.showClear) {
			clearBtn = <button className="btn btn-clear btn-small btn-xs" onClick={this.clearField.bind(this)} ref="clear"> <i className={this.props.clearIcon} /></button>;
		}

		return (
			<div className={className} id={uniqueId}>
				<div className="proper-search-input">
					<i className={this.props.searchIcon + ' ' + 'proper-search-field-icon'} />
					<input
						ref="propersearch_field"
						className="proper-search-input-field"
						type="text"
						autoComplete={this.props.autoComplete}
						placeholder={this.props.placeholder}
						defaultValue={this.props.defaultValue}
						onKeyUp={this.onChange}
						style={{maxWidth: this.props.containerWidth - 5, boxSizing: 'border-box'}}
					/>
					{clearBtn}
				</div>
			</div>
		);
	}
};

SearchField.defaultProps = getDefaultProps();

let toExport = process.env.NODE_ENV === 'Test' ?  SearchField : Dimensions()(SearchField)
export default toExport;