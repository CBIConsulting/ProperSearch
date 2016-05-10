'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _reactImmutableRenderMixin = require('react-immutable-render-mixin');

var _reactVirtualized = require('react-virtualized');

var _reactDimensions = require('react-dimensions');

var _reactDimensions2 = _interopRequireDefault(_reactDimensions);

var _cache = require('../lib/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Set = require('es6-set');

// For more info about this read ReadMe.md
function getDefaultProps() {
	return {
		data: null,
		indexedData: null, // Just when you use a function as a display field. (array) (Full indexed data not filted)
		onSelectionChange: null,
		rowFormater: null, // function
		multiSelect: false,
		messages: null,
		selection: new Set(),
		allSelected: false,
		listRowHeight: 26,
		listHeight: 200,
		listWidth: 100, // Container width by default
		idField: 'value',
		displayField: 'label',
		showIcon: true,
		listElementClass: null,
		uniqueID: _underscore2['default'].uniqueId('search_list_')
	};
}

/**
 * A Component that render a list of selectable items, with single or multiple selection and return the selected items each time a new item be selected.
 *
 * Simple example usage:
 *	let handleSelection = function(selection){
 *		console.log('Selected values: ' + selection) // The selection is a Set obj
 *	}
 *
 * 	<SearchList
 *		data={data} // As an Inmutable obj
 *		idField={'value'} // Field used as an id
 *		onSelectionChange={handleSelection}
 * 		multiselect={false}
 *	/>
 * ```
 */

var SearchList = function (_React$Component) {
	_inherits(SearchList, _React$Component);

	function SearchList(props) {
		_classCallCheck(this, SearchList);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchList).call(this, props));

		_this.state = {
			allSelected: _this.props.allSelected,
			nothingSelected: _this.props.selection.size == 0
		};
		return _this;
	}

	_createClass(SearchList, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var propschanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props, nextProps);

			if (propschanged) {
				var nothingSelected = false;

				if (!nextProps.allSelected) nothingSelected = this.isNothingSelected(nextProps.data, nextProps.selection);

				// When the props change update the state.
				if (nextProps.allSelected != this.state.allSelected || nothingSelected != this.state.nothingSelected) {
					this.setState({
						allSelected: nextProps.allSelected,
						nothingSelected: nothingSelected
					});
				}
			}

			return propschanged;
		}

		/**
   * Function called each time an element of the list is selected. Get the value (value of the idField) of the
   * element that was selected, them change the selection and call to onSelectionChange function in the props sending
   * the new selection.
   *
   * @param (String)	itemValue 	Value of the idField of the selected element
   * @param (Array)	e 			Element which call the function
   */

	}, {
		key: 'handleElementClick',
		value: function handleElementClick(itemValue, e) {
			e.preventDefault();
			var data = this.props.data,
			    selection = this.props.selection,
			    nothingSelected = false,
			    allSelected = false;

			if (this.props.multiSelect) {
				if (selection.has(itemValue)) {
					selection['delete'](itemValue);
				} else {
					selection.add(itemValue);
				}
			} else {
				if (selection.has(itemValue)) selection = new Set();else selection = new Set([itemValue]);
			}

			allSelected = this.isAllSelected(data, selection);
			if (!allSelected) nothingSelected = this.isNothingSelected(data, selection);

			// If the state has changed update it
			if (allSelected != this.state.allSelected || nothingSelected != this.state.nothingSelected) {
				this.setState({
					allSelected: allSelected,
					nothingSelected: nothingSelected
				});
			}

			if (typeof this.props.onSelectionChange == 'function') {
				this.props.onSelectionChange.call(this, selection);
			}
		}

		/**
   * Check if all the current data are not selected
   *
   * @param {array}	data		The data to compare with selection
   * @param {object}	selection	The current selection Set of values (idField)
   */

	}, {
		key: 'isNothingSelected',
		value: function isNothingSelected(data, selection) {
			var _this2 = this;

			var result = true;
			if (selection.size == 0) return true;

			data.forEach(function (element) {
				if (selection.has(element.get(_this2.props.idField, null))) {
					// Some data not in selection
					result = false;
					return false;
				}
			});

			return result;
		}

		/**
   * Check if all the current data are selected.
   *
   * @param {array}	data		The data to compare with selection
   * @param {object}	selection	The current selection Set of values (idField)
   */

	}, {
		key: 'isAllSelected',
		value: function isAllSelected(data, selection) {
			var _this3 = this;

			var result = true;
			if (data.size > selection.size) return false;

			data.forEach(function (element) {
				if (!selection.has(element.get(_this3.props.idField, null))) {
					// Some data not in selection
					result = false;
					return false;
				}
			});

			return result;
		}

		/**
   * Function called each time the buttons in the bar of the list has been clicked. Delete or add all the data elements into the selection, just if it has changed.
   * Prevent multiple clicks in the same button.
   *
   * @param (Boolean)	selectAll 	If its a select all action or an unselect all.
   * @param (Array)	e 			Element which call the function
   */

	}, {
		key: 'handleSelectAll',
		value: function handleSelectAll(selectAll, e) {
			e.preventDefault();

			var newData = [],
			    data = this.props.data,
			    field = this.props.idField;
			var selection = this.props.selection;
			var hasChanged = selectAll != this.state.allSelected || !selectAll && !this.state.nothingSelected; // nothingSelected = false then something is selected

			if (selectAll && hasChanged) {
				data.forEach(function (element) {
					selection.add(element.get(field, null));
				});
			} else {
				data.forEach(function (element) {
					selection['delete'](element.get(field, null));
				});
			}

			if (hasChanged) {
				this.setState({
					allSelected: selectAll,
					nothingSelected: !selectAll
				});
			}

			if (typeof this.props.onSelectionChange == 'function' && hasChanged) {
				this.props.onSelectionChange.call(this, selection);
			}
		}

		/**
   * Return the tool bar for the top of the list. It will be displayed only when the selection can be multiple.
   *
   * @return (html) 	The toolbar code
   */

	}, {
		key: 'getToolbar',
		value: function getToolbar() {
			return _react2['default'].createElement(
				'div',
				{ className: 'proper-search-list-bar' },
				_react2['default'].createElement(
					'div',
					{ className: 'btn-group form-inline' },
					_react2['default'].createElement(
						'a',
						{
							id: 'proper-search-list-bar-check',
							ref: this.props.uniqueID + '_all',
							className: 'btn-select list-bar-check', role: 'button',
							onClick: this.handleSelectAll.bind(this, true),
							style: { maxWidth: this.props.containerWidth / 2, boxSizing: 'border-box' } },
						_react2['default'].createElement(
							'label',
							null,
							this.props.messages.all
						)
					),
					_react2['default'].createElement(
						'a',
						{
							id: 'proper-search-list-bar-unCheck',
							ref: this.props.uniqueID + '_none',
							className: 'btn-select list-bar-unCheck',
							role: 'button',
							onClick: this.handleSelectAll.bind(this, false),
							style: { maxWidth: this.props.containerWidth / 2, boxSizing: 'border-box' } },
						_react2['default'].createElement(
							'label',
							null,
							this.props.messages.none
						)
					)
				)
			);
		}

		/**
   * Build and return the content of the list.
   *
   * @param {integer} index 		Index of the data to be rendered
   * @return {html}	list-row	A row of the list
   */

	}, {
		key: 'getContent',
		value: function getContent(index) {
			var icon = null,
			    selectedClass = null,
			    className = null,
			    element = null,
			    listElementClass = this.props.listElementClass;
			var data = this.props.data,
			    rowdata = undefined,
			    field = this.props.idField,
			    displayField = this.props.displayField,
			    showIcon = this.props.showIcon;

			rowdata = data.get(index);
			element = rowdata.get(displayField);
			className = "proper-search-list-element";

			if (this.props.multiSelect) {
				if (showIcon) {
					if (rowdata.get('_selected', false)) {
						icon = _react2['default'].createElement('i', { className: 'fa fa-check-square-o' });
						selectedClass = ' proper-search-selected';
					} else {
						icon = _react2['default'].createElement('i', { className: 'fa fa-square-o' });
						selectedClass = null;
					}
				}
			} else {
				if (rowdata.get('_selected')) selectedClass = ' proper-search-single-selected';else selectedClass = null;
			}

			if (listElementClass) {
				className += ' ' + listElementClass;
			}

			if (selectedClass) {
				className += ' ' + selectedClass;
			}

			if (typeof element == 'function') {
				var id = rowdata.get(field);
				element = element(this.props.indexedData[id]);
			} else if (this.props.rowFormater) {
				var ckey = ['search_list', 'list_' + this.props.uniqueID, 'row__' + rowdata.get(this.props.idField), displayField];
				element = _cache2['default'].read(ckey);

				if (element === undefined) {
					element = this.props.rowFormater(rowdata.get(displayField));
					_cache2['default'].write(ckey, element);
				}
			}

			return _react2['default'].createElement(
				'div',
				{ key: 'element-' + index, ref: this.props.uniqueID + '_' + index, className: className, onClick: this.handleElementClick.bind(this, rowdata.get(field)) },
				icon,
				element
			);
		}
		/**
   * To be rendered when the data has no data (Ex. filtered data)
   *
   * @return (html) An div with a message
   */

	}, {
		key: 'noRowsRenderer',
		value: function noRowsRenderer() {
			return _react2['default'].createElement(
				'div',
				{ key: 'element-0', ref: this.props.uniqueID + '_noData', className: "proper-search-list search-list-no-data" },
				this.props.messages.noData
			);
		}

		/**
   * Function called to get the content of each element of the list.
   *
   * @param 	list 		List of elements builded on getContent.
   * @param 	index 		Current index to be rendered.
   * @return 	element 	The element on the index position
   */

	}, {
		key: 'rowRenderer',
		value: function rowRenderer(index) {
			return this.getContent(index);
		}
	}, {
		key: 'render',
		value: function render() {
			var toolbar = null,
			    rowsCount = 0,
			    className = "proper-search-list";

			if (this.props.multiSelect) toolbar = this.getToolbar();
			rowsCount = this.props.data.size;

			if (this.props.className) {
				className += ' ' + this.props.className;
			}

			return _react2['default'].createElement(
				'div',
				{ className: className },
				toolbar,
				_react2['default'].createElement(_reactVirtualized.VirtualScroll, {
					ref: this.props.uniqueID + '_virtual',
					className: "proper-search-list-virtual",
					width: this.props.listWidth || this.props.containerWidth,
					height: this.props.listHeight,
					rowRenderer: this.rowRenderer.bind(this),
					rowHeight: this.props.listRowHeight,
					noRowsRenderer: this.noRowsRenderer.bind(this),
					rowsCount: rowsCount,
					overscanRowsCount: 5
				})
			);
		}
	}]);

	return SearchList;
}(_react2['default'].Component);

SearchList.defaultProps = getDefaultProps();
var toExport = process.env.NODE_ENV === 'Test' ? SearchList : (0, _reactDimensions2['default'])()(SearchList);
exports['default'] = toExport;
module.exports = exports['default'];