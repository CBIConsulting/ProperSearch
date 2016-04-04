import React from 'react';

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
		minLength: 3
	}
}

class SearchField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showClear: false,
			inputValue: this.props.defaultValue
		};

		this.clearField = this.clearField.bind(this);
	}

	componentWillMount() {
		this.onChange = (e => {
			let	value;

			e.preventDefault();

			if (e.keyCode==27) {
				this.clearField(e);
				return;
			}

			if (e.keyCode == 13) {
				if (typeof this.props.onEnter == 'function') {
					this.onEnter.call(this);
				}
			}

			if (this.tout) {
				clearInterval(this.tout);
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

	componentDidUpdate() {
		let el = this.getInput();

		if (el) {
			el.focus();
		}
	}

	getInputValue() {
		let el = this.getInput();

		if (el) {
			return el.value;
		}

		return this.props.defaultValue;
	}

	getInput() {
		let el = this.el || null;

		if (!el) {
			this.el = this.refs.searchfield;
			return this.el;
		}

		return el;
	}

	componentDidMount() {
		if (this.props.defaultValue || this.props.sendEmpty) {
			this.sendFilter(this.props.defaultValue);
		}

		this.updateClear(this.props.defaultValue);
	}

	clearField(e) {
		e.preventDefault();

		let el = this.getInput();

		if (el) {
			el.value = '';
		}

		this.sendFilter(null);
		this.updateClear(null)
	}

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
			clearBtn = <button className="btn btn-clear btn-small btn-xs" onClick={this.clearField} ref="clear"> <i className={this.props.clearIcon} /></button>;
		}

		return (
			<div className={className} id={uniqueId}>
				<div className="search-input">
					<i className={this.props.searchIcon + ' ' + 'proper-search-field-icon'} />
					<input
						ref="searchfield"
						checkAll={false}
						type="text"
						autoComplete="off"
						placeholder={this.props.placeholder}
						defaultValue={this.props.defaultValue}
						onKeyUp={this.onChange}
					/>
					{clearBtn}
				</div>
			</div>
		);
	}
};

SearchField.defaultProps = getDefaultProps();

export default SearchField;