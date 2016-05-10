'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _reactDimensions = require('react-dimensions');

var _reactDimensions2 = _interopRequireDefault(_reactDimensions);

var _reactImmutableRenderMixin = require('react-immutable-render-mixin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
	};
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

var SearchField = function (_React$Component) {
	_inherits(SearchField, _React$Component);

	function SearchField(props) {
		_classCallCheck(this, SearchField);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchField).call(this, props));

		_this.state = {
			showClear: false,
			inputValue: ''
		};
		return _this;
	}

	_createClass(SearchField, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var _this2 = this;

			this.onChange = function (e) {
				var value = undefined;

				e.preventDefault();

				// Scape key
				if (e.keyCode == 27) {
					_this2.clearField(e);
					return;
				}

				// Enter key
				if (e.keyCode == 13) {
					if (typeof _this2.props.onEnter == 'function') {
						_this2.props.onEnter.call(_this2);
					}
				}

				// If there is a call to the update functions and to send the search filter then reset it.
				if (_this2.tout) {
					clearTimeout(_this2.tout);
				}

				value = _this2.getInputValue();

				if (value.length >= _this2.props.minLength || _this2.props.sendEmpty && !value.length) {
					_this2.tout = setTimeout(function () {
						value = _this2.getInputValue();
						_this2.updateClear(value);
						_this2.sendFilter(value);
					}, _this2.props.throttle);
				}
			};
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var stateChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state, nextState);
			var propsChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props, nextProps);
			var somethingChanged = propsChanged || stateChanged;

			if (propsChanged) {
				if (nextProps.defaultValue != this.props.defaultValue) {
					this.updateClear(nextProps.defaultValue);
					this.setState({ inputValue: nextProps.defaultValue });
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
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps, prevState) {
			var el = this.getInput();

			if (el) {
				el.focus();
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
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

	}, {
		key: 'getInputValue',
		value: function getInputValue() {
			var el = this.getInput();

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

	}, {
		key: 'getInput',
		value: function getInput() {
			var el = this.el || null;

			if (!el) {
				this.el = this.refs.propersearch_field;
				return this.el;
			}

			return el;
		}

		/**
   * Clear the search field
   */

	}, {
		key: 'clearField',
		value: function clearField(e) {
			e.preventDefault();
			var el = this.getInput();

			if (el) {
				el.value = '';
			}

			this.sendFilter(null);
			this.updateClear(null);
		}

		/**
   * Update the show state of the component to show / hide the clear button.
   *
   * @param (String)	value 	Search field value
   */

	}, {
		key: 'updateClear',
		value: function updateClear(value) {
			var show = false;

			if (value && value.length) {
				show = true;
			}

			if (this.state.showClear != show) {
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

	}, {
		key: 'sendFilter',
		value: function sendFilter(value) {
			if (typeof this.props.onSearch == 'function') {
				this.props.onSearch.call(this, value);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var className = 'proper-search-field',
			    uniqueId = _underscore2['default'].uniqueId('search-'),
			    clearBtn = null;

			if (this.props.className) {
				className += ' ' + this.props.className;
			}

			if (this.props.uniqueId) {
				uniqueId = this.props.uniqueId;
			}

			if (this.state.showClear) {
				clearBtn = _react2['default'].createElement(
					'button',
					{ className: 'btn btn-clear btn-small btn-xs', onClick: this.clearField.bind(this), ref: 'clear' },
					' ',
					_react2['default'].createElement('i', { className: this.props.clearIcon })
				);
			}

			return _react2['default'].createElement(
				'div',
				{ className: className, id: uniqueId },
				_react2['default'].createElement(
					'div',
					{ className: 'proper-search-input' },
					_react2['default'].createElement('i', { className: this.props.searchIcon + ' ' + 'proper-search-field-icon' }),
					_react2['default'].createElement('input', {
						ref: 'propersearch_field',
						className: 'proper-search-input-field',
						type: 'text',
						autoComplete: this.props.autoComplete,
						placeholder: this.props.placeholder,
						defaultValue: this.props.defaultValue,
						onKeyUp: this.onChange,
						style: { maxWidth: this.props.containerWidth - 5, boxSizing: 'border-box' }
					}),
					clearBtn
				)
			);
		}
	}]);

	return SearchField;
}(_react2['default'].Component);

;

SearchField.defaultProps = getDefaultProps();

var toExport = process.env.NODE_ENV === 'Test' ? SearchField : (0, _reactDimensions2['default'])()(SearchField);
exports['default'] = toExport;
module.exports = exports['default'];