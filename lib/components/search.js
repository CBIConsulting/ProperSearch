'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _searchList = require('./searchList');

var _searchList2 = _interopRequireDefault(_searchList);

var _searchField = require('./searchField');

var _searchField2 = _interopRequireDefault(_searchField);

var _messages2 = require('../lang/messages');

var _messages3 = _interopRequireDefault(_messages2);

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

var _reactImmutableRenderMixin = require('react-immutable-render-mixin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Set = require('es6-set');

// For more info about this read ReadMe.md
function getDefaultProps() {
	return {
		data: [],
		messages: _messages3['default'],
		lang: 'ENG',
		defaultSelection: null,
		multiSelect: false,
		listWidth: null,
		listHeight: 200,
		listRowHeight: 26,
		afterSelect: null,
		afterSearch: null,
		onEnter: null, // Optional - To do when key down Enter - SearchField
		fieldClass: null,
		listClass: null,
		listElementClass: null,
		className: null,
		placeholder: 'Search...',
		searchIcon: 'fa fa-search fa-fw',
		clearIcon: 'fa fa-times fa-fw',
		throttle: 160, // milliseconds
		minLength: 3,
		defaultSearch: null,
		autoComplete: 'off',
		idField: 'value',
		displayField: 'label',
		listShowIcon: true,
		filter: null, // Optional function (to be used when the displayField is an function too)
		filterField: null // By default it will be the displayField
	};
}

/**
 * A proper search component for react. With a search field and a list of items allows the user to filter that list and select the items.
 * The component return the selected data when it's selected. Allows multi and single selection. The list is virtual rendered, was designed
 * to handle thousands of elements without sacrificing performance, just render the elements in the view. Used react-virtualized to render the list items.
 *
 * Simple example usage:
 *
 * 	let data = [];
 * 	data.push({
 *	  	value: 1,
 *	  	label: 'Apple'
 * 	});
 *
 *	let afterSelect = (data, selection) => {
 *		console.info(data);
 *		console.info(selection);
 *	}
 *
 * 	<Search
 *		data={data}
 *		multiSelect={true}
 *		afterSelect={afterSelect}
 *	/>
 * ```
 */

var Search = function (_React$Component) {
	_inherits(Search, _React$Component);

	function Search(props) {
		_classCallCheck(this, Search);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Search).call(this, props));

		var preparedData = _this.prepareData(null, _this.props.idField);

		_this.state = {
			data: preparedData.data, // Data to work with (Inmutable)
			initialData: preparedData.data, // Same data as state.data but this data never changes. (Inmutable)
			rawData: preparedData.rawdata, // Received data without any modfication (Inmutable)
			indexedData: preparedData.indexed, // Received data indexed (No Inmutable)
			initialIndexed: preparedData.indexed, // When data get filtered keep the full indexed
			idField: _this.props.idField, // To don't update the idField if that field doesn't exist in the fields of data array
			displayField: _this.props.displayField, // same
			selection: new Set(),
			allSelected: false,
			ready: false
		};
		return _this;
	}

	_createClass(Search, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setDefaultSelection(this.props.defaultSelection);

			this.setState({
				ready: true
			});
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var stateChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state, nextState);
			var propsChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props, nextProps);
			var somethingChanged = propsChanged || stateChanged;

			// Update row indexes when data get filtered
			if (this.state.data.size != nextState.data.size) {
				var parsed = null,
				    indexed = null;

				parsed = this.prepareData(nextState.data);
				indexed = parsed.indexed;

				this.setState({
					data: parsed.data,
					indexedData: parsed.indexed,
					allSelected: this.isAllSelected(parsed.data, nextState.selection)
				});

				return false;
			}

			if (propsChanged) {
				var dataChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props.data, nextProps.data);
				var selectionChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state.selection, new Set(nextProps.defaultSelection));
				var selection = selectionChanged ? nextProps.defaultSelection : null; // With null null the method setDefaultSelection does nothing
				var idFieldChanged = this.props.idField != nextProps.idField,
				    displayFieldChanged = this.props.displayField != nextProps.displayField;

				if (idFieldChanged || displayFieldChanged) {
					var fieldsSet = new Set(_underscore2['default'].keys(nextProps.data[0]));
					var _messages = this.props.messages[this.props.lang];

					// Change idField / displayField but that field doesn't exist in the data
					if (!fieldsSet.has(nextProps.idField) || !fieldsSet.has(nextProps.displayField)) {
						if (!fieldsSet.has(nextProps.idField)) console.error(_messages.errorIdField + ' ' + nextProps.idField + ' ' + _messages.errorData);else console.error(_messages.errorDisplayField + ' ' + nextProps.idField + ' ' + _messages.errorData);

						return false;
					} else {
						// New idField &&//|| displayField exist in data array fields

						if (dataChanged) {
							var preparedData = this.prepareData(_immutable2['default'].fromJS(nextProps.data), nextProps.idField);

							this.setState({
								data: preparedData.data,
								initialData: preparedData.data,
								rawData: preparedData.rawdata,
								indexedData: preparedData.indexed,
								initialIndexed: preparedData.indexed,
								idField: nextProps.idField,
								displayField: nextProps.displayField
							}, this.setDefaultSelection(selection));
						} else {
							var initialIndexed = null,
							    _indexed = null;

							// If the id field change then the indexed data has to be changed but not for display
							if (displayFieldChanged) {
								initialIndexed = this.state.initialIndexed;
								_indexed = this.state.indexedData;
							} else {
								initialIndexed = _underscore2['default'].indexBy(this.state.initialData.toJSON(), nextProps.idField);
								_indexed = _underscore2['default'].indexBy(this.state.data.toJSON(), nextProps.idField);
							}

							this.setState({
								indexedData: _indexed,
								initialIndexed: initialIndexed,
								idField: nextProps.idField,
								displayField: nextProps.displayField
							}, this.setDefaultSelection(selection));
						}
						return false;
					}
				}

				if (dataChanged) {
					var _preparedData = this.prepareData(_immutable2['default'].fromJS(nextProps.data), nextProps.idField);

					this.setState({
						data: _preparedData.data,
						initialData: _preparedData.data,
						rawData: _preparedData.rawdata,
						indexedData: _preparedData.indexed,
						initialIndexed: _preparedData.indexed
					}, this.setDefaultSelection(selection));

					return false;
				}

				if (selectionChanged) {
					// Default selection does nothing if the selection is null so in that case update the state to restart selection
					if (!_underscore2['default'].isNull(nextProps.defaultSelection)) {
						this.setDefaultSelection(nextProps.defaultSelection);
					} else {
						this.setState({
							selection: new Set(),
							allSelected: false
						});
					}

					return false;
				}
			}

			return somethingChanged;
		}

		/**
   * Before the components update set the updated selection data to the components state.
   *
   * @param {object}	nextProps	The props that will be set for the updated component
   * @param {object}	nextState	The state that will be set for the updated component
   */

	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate(nextProps, nextState) {
			var dataChangedProps = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props.data, nextProps.data);

			// Selection
			if (this.props.multiSelect) {
				if (nextState.selection.size !== this.state.selection.size) {
					this.updateSelectionData(nextState.selection, nextState.allSelected);
				}
			} else {
				var next = nextState.selection.values().next().value || null;
				var old = this.state.selection.values().next().value || null;
				var oldSize = !_underscore2['default'].isNull(this.state.selection) ? this.state.selection.size : 0;

				if (next !== old || oldSize > 1) {
					this.updateSelectionData(next);
				}
			}
		}

		/**
   * Method called before the components update to set the new selection to states component and update the data
   *
   * @param {array}	newSelection	The new selected rows (Set object)
   * @param {array}	newAllSelected	If the new state has all the rows selected
   */

	}, {
		key: 'updateSelectionData',
		value: function updateSelectionData(newSelection) {
			var _this2 = this;

			var newAllSelected = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			var newIndexed = _underscore2['default'].clone(this.state.indexedData);
			var oldSelection = this.state.selection;
			var rowid = null,
			    selected = null,
			    rdata = null,
			    curIndex = null,
			    newData = this.state.data,
			    rowIndex = null;
			var newSelectionSize = !_underscore2['default'].isNull(newSelection) ? newSelection.size : 0;

			// If oldSelection size is bigger than 1 that mean's the props has changed from multiselect to single select so if there is some list items with the selected class
			// if should be reset.
			if (!this.props.multiSelect && oldSelection.size <= 1) {
				// Single select
				var oldId = oldSelection.values().next().value || null;

				if (!_underscore2['default'].isNull(oldId)) {
					newIndexed[oldId]._selected = false; // Update indexed data
					rowIndex = newIndexed[oldId]._rowIndex; // Get data index
					if (newData.get(rowIndex)) {
						rdata = newData.get(rowIndex).set('_selected', false); // Change the row in that index
						newData = newData.set(rowIndex, rdata); // Set that row in the data object
					}
				}

				if (!_underscore2['default'].isNull(newSelection)) {
					newIndexed[newSelection]._selected = true; // Update indexed data
					rowIndex = newIndexed[newSelection]._rowIndex; // Get data index
					rdata = newData.get(rowIndex).set('_selected', true); // Change the row in that index
					newData = newData.set(rowIndex, rdata); // Set that row in the data object
				}
			} else if (!newAllSelected && this.isSingleChange(newSelectionSize)) {
					// Change one row data at a time
					var changedId = null,
					    _selected = null;

					// If the new selection has not one of the ids of the old selection that means an selected element has been unselected.
					oldSelection.forEach(function (id) {
						if (!newSelection.has(id)) {
							changedId = id;
							_selected = false;
							return false;
						}
					});

					// Otherwise a new row has been selected. Look through the new selection for the new element.
					if (!changedId) {
						_selected = true;
						newSelection.forEach(function (id) {
							if (!oldSelection.has(id)) {
								changedId = id;
								return false;
							}
						});
					}

					newIndexed[changedId]._selected = _selected; // Update indexed data
					rowIndex = newIndexed[changedId]._rowIndex; // Get data index
					rdata = newData.get(rowIndex).set('_selected', _selected); // Change the row in that index
					newData = newData.set(rowIndex, rdata); // Set that row in the data object
				} else {
						// Change all data
						if (_underscore2['default'].isNull(newSelection)) newSelection = new Set();else if (!_underscore2['default'].isObject(newSelection)) newSelection = new Set([newSelection]);

						newData = newData.map(function (row) {
							rowid = row.get(_this2.state.idField);
							selected = newSelection.has(rowid.toString());
							rdata = row.set('_selected', selected);
							curIndex = newIndexed[rowid];

							if (curIndex._selected != selected) {
								// update indexed data
								curIndex._selected = selected;
								newIndexed[rowid] = curIndex;
							}

							return rdata;
						});
					}

			this.setState({
				data: newData,
				indexed: newIndexed
			});
		}

		/**
   * Check if the selection has more than 1 change.
   *
   * @param {integer}	newSize		Size of the new selection
   */

	}, {
		key: 'isSingleChange',
		value: function isSingleChange(newSize) {
			var oldSize = this.state.selection.size;

			if (oldSize - 1 == newSize || oldSize + 1 == newSize) return true;else return false;
		}

		/**
   * In case that the new selection array be different than the selection array in the components state, then update
   * the components state with the new data.
   *
   * @param {array}	newSelection	The selected rows
   */

	}, {
		key: 'triggerSelection',
		value: function triggerSelection() {
			var newSelection = arguments.length <= 0 || arguments[0] === undefined ? new Set() : arguments[0];

			this.setState({
				selection: newSelection,
				allSelected: this.isAllSelected(this.state.data, newSelection)
			}, this.sendSelection);
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

			data.forEach(function (item, index) {
				if (!selection.has(item.get(_this3.state.idField, null))) {
					// Some data not in selection
					result = false;
					return false;
				}
			});

			return result;
		}

		/**
   * Set up the default selection if exist
   *
   * @param {array || string ... number} defSelection 	Default selection to be applied to the list
   */

	}, {
		key: 'setDefaultSelection',
		value: function setDefaultSelection(defSelection) {
			if (defSelection) {
				var selection = null;

				if (!_underscore2['default'].isArray(defSelection)) {
					selection = new Set([defSelection]);
				} else if (defSelection !== new Set()) {
					selection = new Set(defSelection);
				}

				this.triggerSelection(selection);
			}
		}

		/**
   * Prepare the data received by the component for the internal working.
   *
   * @param (object)	newData 	New data for rebuild. (filtering || props changed)
   * @param (string)	idField 	New idField if it has been changed. (props changed)
   *
   * @return (array)	-rawdata: 	The same data as the props.
   *					-indexed: 	Same as rawdata but indexed by the idField
   *					-data: 		Parsed data to add some fields necesary to internal working.
   */

	}, {
		key: 'prepareData',
		value: function prepareData() {
			var newData = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var idField = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			// The data will be inmutable inside the component
			var data = newData || _immutable2['default'].fromJS(this.props.data),
			    index = 0,
			    field = idField || this.state.idField;
			var indexed = [],
			    parsed = [];

			// Parsing data to add new fields (selected or not, field, rowIndex)
			parsed = data.map(function (row) {
				if (!row.get(field, false)) {
					row = row.set(field, _underscore2['default'].uniqueId());
				} else {
					row = row.set(field, row.get(field).toString());
				}

				if (!row.get('_selected', false)) {
					row = row.set('_selected', false);
				}

				row = row.set('_rowIndex', index++);

				return row;
			});

			// Prepare indexed data.
			indexed = _underscore2['default'].indexBy(parsed.toJSON(), field);

			return {
				rawdata: data,
				data: parsed,
				indexed: indexed
			};
		}

		/**
   * Function called each time the selection has changed. Apply an update in the components state selection then render again an update the child
   * list.
   *
   * @param (Set)	selection The selected values using the values of the selected data.
   */

	}, {
		key: 'handleSelectionChange',
		value: function handleSelectionChange(selection) {
			this.triggerSelection(selection);
		}

		/**
   * Function called each time the search field has changed. Filter the data by using the received search field value.
   *
   * @param (String)	value 	String written in the search field
   */

	}, {
		key: 'handleSearch',
		value: function handleSearch(value) {
			var _this4 = this;

			var lValue = value ? value : null,
			    filter = null;
			var data = this.state.initialData,
			    filteredData = data,
			    selection = this.state.selection;
			var displayField = this.state.displayField,
			    idField = this.state.idField;
			var hasFilter = typeof this.props.filter == 'function';

			// When the search field has been clear then the value will be null and the data will be the same as initialData, otherwise
			// the data will be filtered using the .filter() function of Inmutable lib. It return a Inmutable obj with the elements that
			// match the expresion in the parameter.
			if (value) {
				lValue = _normalize2['default'].normalize(lValue);

				// If the prop `filter´ has a function then use if to filter as an interator over the indexed data.
				if (hasFilter) {
					(function () {
						var filtered = null,
						    filteredIndexes = new Set();

						// Filter indexed data using the funtion
						_underscore2['default'].each(_this4.state.initialIndexed, function (element) {
							if (_this4.props.filter(element, lValue)) {
								filteredIndexes.add(element._rowIndex);
							}
						});

						// Then get the data that match with that indexed data
						filteredData = data.filter(function (element) {
							return filteredIndexes.has(element.get('_rowIndex'));
						});
					})();
				} else {
					filteredData = data.filter(function (element) {
						filter = element.get(_this4.props.filterField, null) || element.get(displayField);

						// When it's a function then use the field in filterField to search, if this field doesn't exist then use the field name or then idField.
						if (typeof filter == 'function') {
							filter = element.get('name', null) || element.get(idField);
						}

						filter = _normalize2['default'].normalize(filter);
						return filter.indexOf(lValue) >= 0;
					});
				}
			}

			// Apply selection
			filteredData = filteredData.map(function (element) {
				if (selection.has(element.get(idField, null))) {
					element = element.set('_selected', true);
				}

				return element;
			});

			this.setState({
				data: filteredData
			}, this.sendSearch(lValue));
		}

		/**
   * Get the data that match with the selection in params and send the data and the selection to a function whichs name is afterSelect
   * if this function was set up in the component props
   */

	}, {
		key: 'sendSelection',
		value: function sendSelection() {
			var _this5 = this;

			if (typeof this.props.afterSelect == 'function') {
				(function () {
					var selectionArray = [],
					    selectedData = [],
					    properId = null,
					    rowIndex = null,
					    filteredData = null;
					var _state = _this5.state;
					var indexedData = _state.indexedData;
					var initialData = _state.initialData;
					var rawData = _state.rawData;
					var data = _state.data;
					var selection = _state.selection;

					// Get the data (initialData) that match with the selection

					filteredData = initialData.filter(function (element) {
						return selection.has(element.get(_this5.state.idField, null));
					});

					// Then from the filtered data get the raw data that match with the selection
					selectedData = filteredData.map(function (row) {
						properId = row.get(_this5.state.idField, 0);
						rowIndex = _underscore2['default'].isUndefined(indexedData[properId]) ? _this5.state.initialIndexed[properId]._rowIndex : indexedData[properId]._rowIndex;

						return rawData.get(rowIndex);
					});

					// Parse the selection to return it as an array instead of a Set obj
					selection.forEach(function (item) {
						selectionArray.push(item);
					});

					_this5.props.afterSelect.call(_this5, selectedData.toJSON(), selectionArray);
				})();
			}
		}

		/**
   * Send the written string in the search field to the afterSearch function if it was set up in the components props
   *
   * @param (String)	searchValue 	String written in the search field
   */

	}, {
		key: 'sendSearch',
		value: function sendSearch(searchValue) {
			if (typeof this.props.afterSearch == 'function') {
				this.props.afterSearch.call(this, searchValue);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var messages = this.props.messages[this.props.lang],
			    content = null,
			    data = this.state.data,
			    selection = new Set(),
			    allSelected = this.state.allSelected,
			    className = "proper-search";

			if (this.props.className) {
				className += ' ' + this.props.className;
			}

			if (this.state.ready) {
				this.state.selection.forEach(function (element) {
					selection.add(element);
				});

				content = _react2['default'].createElement(
					'div',
					null,
					_react2['default'].createElement(_searchField2['default'], {
						onSearch: this.handleSearch.bind(this),
						onEnter: this.props.onEnter,
						className: this.props.fieldClass,
						placeholder: this.props.placeholder,
						defaultValue: this.props.defaultSearch,
						searchIcon: this.props.searchIcon,
						clearIcon: this.props.clearIcon,
						throttle: this.props.throttle,
						minLength: this.props.minLength,
						autoComplete: this.props.autoComplete
					}),
					_react2['default'].createElement(_searchList2['default'], {
						data: data,
						rawData: this.state.rawData,
						indexedData: this.state.initialIndexed,
						className: this.props.listClass,
						idField: this.state.idField,
						displayField: this.state.displayField,
						onSelectionChange: this.handleSelectionChange.bind(this),
						messages: messages,
						selection: selection,
						allSelected: allSelected,
						multiSelect: this.props.multiSelect,
						listHeight: this.props.listHeight,
						listWidth: this.props.listWidth,
						listRowHeight: this.props.listRowHeight,
						listElementClass: this.props.listElementClass,
						showIcon: this.props.listShowIcon
					})
				);
			} else {
				content = _react2['default'].createElement(
					'div',
					{ className: 'proper-search-loading' },
					messages.loading
				);
			}

			return _react2['default'].createElement(
				'div',
				{ className: "proper-search " + className },
				content
			);
		}
	}]);

	return Search;
}(_react2['default'].Component);

;

Search.defaultProps = getDefaultProps();

exports['default'] = Search;
module.exports = exports['default'];