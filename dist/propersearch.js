var ProperSearch =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _search = __webpack_require__(1);

	var _search2 = _interopRequireDefault(_search);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	__webpack_require__(98);

	exports["default"] = _search2["default"];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _underscore = __webpack_require__(4);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _searchList = __webpack_require__(5);

	var _searchList2 = _interopRequireDefault(_searchList);

	var _searchField = __webpack_require__(95);

	var _searchField2 = _interopRequireDefault(_searchField);

	var _messages2 = __webpack_require__(96);

	var _messages3 = _interopRequireDefault(_messages2);

	var _normalize = __webpack_require__(97);

	var _normalize2 = _interopRequireDefault(_normalize);

	var _reactImmutableRenderMixin = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Set = __webpack_require__(44);

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
					var selectionChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state.selection, nextProps.defaultSelection);
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
								var selection = null;

								if (selectionChanged) selection = nextProps.defaultSelection;

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
								});
							}
							return false;
						}
					}

					if (dataChanged) {
						var _preparedData = this.prepareData(_immutable2['default'].fromJS(nextProps.data), nextProps.idField);
						var _selection = null;

						if (selectionChanged) _selection = nextProps.defaultSelection;

						this.setState({
							data: _preparedData.data,
							initialData: _preparedData.data,
							rawData: _preparedData.rawdata,
							indexedData: _preparedData.indexed,
							initialIndexed: _preparedData.indexed
						}, this.setDefaultSelection(_selection));

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

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */

	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  global.Immutable = factory();
	}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;

	  function createClass(ctor, superClass) {
	    if (superClass) {
	      ctor.prototype = Object.create(superClass.prototype);
	    }
	    ctor.prototype.constructor = ctor;
	  }

	  function Iterable(value) {
	      return isIterable(value) ? value : Seq(value);
	    }


	  createClass(KeyedIterable, Iterable);
	    function KeyedIterable(value) {
	      return isKeyed(value) ? value : KeyedSeq(value);
	    }


	  createClass(IndexedIterable, Iterable);
	    function IndexedIterable(value) {
	      return isIndexed(value) ? value : IndexedSeq(value);
	    }


	  createClass(SetIterable, Iterable);
	    function SetIterable(value) {
	      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
	    }



	  function isIterable(maybeIterable) {
	    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
	  }

	  function isKeyed(maybeKeyed) {
	    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
	  }

	  function isIndexed(maybeIndexed) {
	    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
	  }

	  function isAssociative(maybeAssociative) {
	    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
	  }

	  function isOrdered(maybeOrdered) {
	    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
	  }

	  Iterable.isIterable = isIterable;
	  Iterable.isKeyed = isKeyed;
	  Iterable.isIndexed = isIndexed;
	  Iterable.isAssociative = isAssociative;
	  Iterable.isOrdered = isOrdered;

	  Iterable.Keyed = KeyedIterable;
	  Iterable.Indexed = IndexedIterable;
	  Iterable.Set = SetIterable;


	  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

	  // Used for setting prototype methods that IE8 chokes on.
	  var DELETE = 'delete';

	  // Constants describing the size of trie nodes.
	  var SHIFT = 5; // Resulted in best performance after ______?
	  var SIZE = 1 << SHIFT;
	  var MASK = SIZE - 1;

	  // A consistent shared value representing "not set" which equals nothing other
	  // than itself, and nothing that could be provided externally.
	  var NOT_SET = {};

	  // Boolean references, Rough equivalent of `bool &`.
	  var CHANGE_LENGTH = { value: false };
	  var DID_ALTER = { value: false };

	  function MakeRef(ref) {
	    ref.value = false;
	    return ref;
	  }

	  function SetRef(ref) {
	    ref && (ref.value = true);
	  }

	  // A function which returns a value representing an "owner" for transient writes
	  // to tries. The return value will only ever equal itself, and will not equal
	  // the return of any subsequent call of this function.
	  function OwnerID() {}

	  // http://jsperf.com/copy-array-inline
	  function arrCopy(arr, offset) {
	    offset = offset || 0;
	    var len = Math.max(0, arr.length - offset);
	    var newArr = new Array(len);
	    for (var ii = 0; ii < len; ii++) {
	      newArr[ii] = arr[ii + offset];
	    }
	    return newArr;
	  }

	  function ensureSize(iter) {
	    if (iter.size === undefined) {
	      iter.size = iter.__iterate(returnTrue);
	    }
	    return iter.size;
	  }

	  function wrapIndex(iter, index) {
	    // This implements "is array index" which the ECMAString spec defines as:
	    //
	    //     A String property name P is an array index if and only if
	    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
	    //     to 2^32−1.
	    //
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
	    if (typeof index !== 'number') {
	      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
	      if ('' + uint32Index !== index || uint32Index === 4294967295) {
	        return NaN;
	      }
	      index = uint32Index;
	    }
	    return index < 0 ? ensureSize(iter) + index : index;
	  }

	  function returnTrue() {
	    return true;
	  }

	  function wholeSlice(begin, end, size) {
	    return (begin === 0 || (size !== undefined && begin <= -size)) &&
	      (end === undefined || (size !== undefined && end >= size));
	  }

	  function resolveBegin(begin, size) {
	    return resolveIndex(begin, size, 0);
	  }

	  function resolveEnd(end, size) {
	    return resolveIndex(end, size, size);
	  }

	  function resolveIndex(index, size, defaultIndex) {
	    return index === undefined ?
	      defaultIndex :
	      index < 0 ?
	        Math.max(0, size + index) :
	        size === undefined ?
	          index :
	          Math.min(size, index);
	  }

	  /* global Symbol */

	  var ITERATE_KEYS = 0;
	  var ITERATE_VALUES = 1;
	  var ITERATE_ENTRIES = 2;

	  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator';

	  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


	  function Iterator(next) {
	      this.next = next;
	    }

	    Iterator.prototype.toString = function() {
	      return '[Iterator]';
	    };


	  Iterator.KEYS = ITERATE_KEYS;
	  Iterator.VALUES = ITERATE_VALUES;
	  Iterator.ENTRIES = ITERATE_ENTRIES;

	  Iterator.prototype.inspect =
	  Iterator.prototype.toSource = function () { return this.toString(); }
	  Iterator.prototype[ITERATOR_SYMBOL] = function () {
	    return this;
	  };


	  function iteratorValue(type, k, v, iteratorResult) {
	    var value = type === 0 ? k : type === 1 ? v : [k, v];
	    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
	      value: value, done: false
	    });
	    return iteratorResult;
	  }

	  function iteratorDone() {
	    return { value: undefined, done: true };
	  }

	  function hasIterator(maybeIterable) {
	    return !!getIteratorFn(maybeIterable);
	  }

	  function isIterator(maybeIterator) {
	    return maybeIterator && typeof maybeIterator.next === 'function';
	  }

	  function getIterator(iterable) {
	    var iteratorFn = getIteratorFn(iterable);
	    return iteratorFn && iteratorFn.call(iterable);
	  }

	  function getIteratorFn(iterable) {
	    var iteratorFn = iterable && (
	      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
	      iterable[FAUX_ITERATOR_SYMBOL]
	    );
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  function isArrayLike(value) {
	    return value && typeof value.length === 'number';
	  }

	  createClass(Seq, Iterable);
	    function Seq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        isIterable(value) ? value.toSeq() : seqFromValue(value);
	    }

	    Seq.of = function(/*...values*/) {
	      return Seq(arguments);
	    };

	    Seq.prototype.toSeq = function() {
	      return this;
	    };

	    Seq.prototype.toString = function() {
	      return this.__toString('Seq {', '}');
	    };

	    Seq.prototype.cacheResult = function() {
	      if (!this._cache && this.__iterateUncached) {
	        this._cache = this.entrySeq().toArray();
	        this.size = this._cache.length;
	      }
	      return this;
	    };

	    // abstract __iterateUncached(fn, reverse)

	    Seq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, true);
	    };

	    // abstract __iteratorUncached(type, reverse)

	    Seq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, true);
	    };



	  createClass(KeyedSeq, Seq);
	    function KeyedSeq(value) {
	      return value === null || value === undefined ?
	        emptySequence().toKeyedSeq() :
	        isIterable(value) ?
	          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
	          keyedSeqFromValue(value);
	    }

	    KeyedSeq.prototype.toKeyedSeq = function() {
	      return this;
	    };



	  createClass(IndexedSeq, Seq);
	    function IndexedSeq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
	    }

	    IndexedSeq.of = function(/*...values*/) {
	      return IndexedSeq(arguments);
	    };

	    IndexedSeq.prototype.toIndexedSeq = function() {
	      return this;
	    };

	    IndexedSeq.prototype.toString = function() {
	      return this.__toString('Seq [', ']');
	    };

	    IndexedSeq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, false);
	    };

	    IndexedSeq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, false);
	    };



	  createClass(SetSeq, Seq);
	    function SetSeq(value) {
	      return (
	        value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value
	      ).toSetSeq();
	    }

	    SetSeq.of = function(/*...values*/) {
	      return SetSeq(arguments);
	    };

	    SetSeq.prototype.toSetSeq = function() {
	      return this;
	    };



	  Seq.isSeq = isSeq;
	  Seq.Keyed = KeyedSeq;
	  Seq.Set = SetSeq;
	  Seq.Indexed = IndexedSeq;

	  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

	  Seq.prototype[IS_SEQ_SENTINEL] = true;



	  createClass(ArraySeq, IndexedSeq);
	    function ArraySeq(array) {
	      this._array = array;
	      this.size = array.length;
	    }

	    ArraySeq.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
	    };

	    ArraySeq.prototype.__iterate = function(fn, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };

	    ArraySeq.prototype.__iterator = function(type, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      var ii = 0;
	      return new Iterator(function() 
	        {return ii > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
	      );
	    };



	  createClass(ObjectSeq, KeyedSeq);
	    function ObjectSeq(object) {
	      var keys = Object.keys(object);
	      this._object = object;
	      this._keys = keys;
	      this.size = keys.length;
	    }

	    ObjectSeq.prototype.get = function(key, notSetValue) {
	      if (notSetValue !== undefined && !this.has(key)) {
	        return notSetValue;
	      }
	      return this._object[key];
	    };

	    ObjectSeq.prototype.has = function(key) {
	      return this._object.hasOwnProperty(key);
	    };

	    ObjectSeq.prototype.__iterate = function(fn, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        if (fn(object[key], key, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };

	    ObjectSeq.prototype.__iterator = function(type, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      var ii = 0;
	      return new Iterator(function()  {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, key, object[key]);
	      });
	    };

	  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


	  createClass(IterableSeq, IndexedSeq);
	    function IterableSeq(iterable) {
	      this._iterable = iterable;
	      this.size = iterable.length || iterable.size;
	    }

	    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      var iterations = 0;
	      if (isIterator(iterator)) {
	        var step;
	        while (!(step = iterator.next()).done) {
	          if (fn(step.value, iterations++, this) === false) {
	            break;
	          }
	        }
	      }
	      return iterations;
	    };

	    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      if (!isIterator(iterator)) {
	        return new Iterator(iteratorDone);
	      }
	      var iterations = 0;
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step : iteratorValue(type, iterations++, step.value);
	      });
	    };



	  createClass(IteratorSeq, IndexedSeq);
	    function IteratorSeq(iterator) {
	      this._iterator = iterator;
	      this._iteratorCache = [];
	    }

	    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      while (iterations < cache.length) {
	        if (fn(cache[iterations], iterations++, this) === false) {
	          return iterations;
	        }
	      }
	      var step;
	      while (!(step = iterator.next()).done) {
	        var val = step.value;
	        cache[iterations] = val;
	        if (fn(val, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };

	    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      return new Iterator(function()  {
	        if (iterations >= cache.length) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          cache[iterations] = step.value;
	        }
	        return iteratorValue(type, iterations, cache[iterations++]);
	      });
	    };




	  // # pragma Helper functions

	  function isSeq(maybeSeq) {
	    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
	  }

	  var EMPTY_SEQ;

	  function emptySequence() {
	    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
	  }

	  function keyedSeqFromValue(value) {
	    var seq =
	      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
	      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
	      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
	      typeof value === 'object' ? new ObjectSeq(value) :
	      undefined;
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of [k, v] entries, '+
	        'or keyed object: ' + value
	      );
	    }
	    return seq;
	  }

	  function indexedSeqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value);
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values: ' + value
	      );
	    }
	    return seq;
	  }

	  function seqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value) ||
	      (typeof value === 'object' && new ObjectSeq(value));
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values, or keyed object: ' + value
	      );
	    }
	    return seq;
	  }

	  function maybeIndexedSeqFromValue(value) {
	    return (
	      isArrayLike(value) ? new ArraySeq(value) :
	      isIterator(value) ? new IteratorSeq(value) :
	      hasIterator(value) ? new IterableSeq(value) :
	      undefined
	    );
	  }

	  function seqIterate(seq, fn, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    }
	    return seq.__iterateUncached(fn, reverse);
	  }

	  function seqIterator(seq, type, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      var ii = 0;
	      return new Iterator(function()  {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
	      });
	    }
	    return seq.__iteratorUncached(type, reverse);
	  }

	  function fromJS(json, converter) {
	    return converter ?
	      fromJSWith(converter, json, '', {'': json}) :
	      fromJSDefault(json);
	  }

	  function fromJSWith(converter, json, key, parentJSON) {
	    if (Array.isArray(json)) {
	      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    if (isPlainObj(json)) {
	      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    return json;
	  }

	  function fromJSDefault(json) {
	    if (Array.isArray(json)) {
	      return IndexedSeq(json).map(fromJSDefault).toList();
	    }
	    if (isPlainObj(json)) {
	      return KeyedSeq(json).map(fromJSDefault).toMap();
	    }
	    return json;
	  }

	  function isPlainObj(value) {
	    return value && (value.constructor === Object || value.constructor === undefined);
	  }

	  /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if the it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections implement `equals` and `hashCode`.
	   *
	   */
	  function is(valueA, valueB) {
	    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	      return true;
	    }
	    if (!valueA || !valueB) {
	      return false;
	    }
	    if (typeof valueA.valueOf === 'function' &&
	        typeof valueB.valueOf === 'function') {
	      valueA = valueA.valueOf();
	      valueB = valueB.valueOf();
	      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	        return true;
	      }
	      if (!valueA || !valueB) {
	        return false;
	      }
	    }
	    if (typeof valueA.equals === 'function' &&
	        typeof valueB.equals === 'function' &&
	        valueA.equals(valueB)) {
	      return true;
	    }
	    return false;
	  }

	  function deepEqual(a, b) {
	    if (a === b) {
	      return true;
	    }

	    if (
	      !isIterable(b) ||
	      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
	      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
	      isKeyed(a) !== isKeyed(b) ||
	      isIndexed(a) !== isIndexed(b) ||
	      isOrdered(a) !== isOrdered(b)
	    ) {
	      return false;
	    }

	    if (a.size === 0 && b.size === 0) {
	      return true;
	    }

	    var notAssociative = !isAssociative(a);

	    if (isOrdered(a)) {
	      var entries = a.entries();
	      return b.every(function(v, k)  {
	        var entry = entries.next().value;
	        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
	      }) && entries.next().done;
	    }

	    var flipped = false;

	    if (a.size === undefined) {
	      if (b.size === undefined) {
	        if (typeof a.cacheResult === 'function') {
	          a.cacheResult();
	        }
	      } else {
	        flipped = true;
	        var _ = a;
	        a = b;
	        b = _;
	      }
	    }

	    var allEqual = true;
	    var bSize = b.__iterate(function(v, k)  {
	      if (notAssociative ? !a.has(v) :
	          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
	        allEqual = false;
	        return false;
	      }
	    });

	    return allEqual && a.size === bSize;
	  }

	  createClass(Repeat, IndexedSeq);

	    function Repeat(value, times) {
	      if (!(this instanceof Repeat)) {
	        return new Repeat(value, times);
	      }
	      this._value = value;
	      this.size = times === undefined ? Infinity : Math.max(0, times);
	      if (this.size === 0) {
	        if (EMPTY_REPEAT) {
	          return EMPTY_REPEAT;
	        }
	        EMPTY_REPEAT = this;
	      }
	    }

	    Repeat.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Repeat []';
	      }
	      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
	    };

	    Repeat.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._value : notSetValue;
	    };

	    Repeat.prototype.includes = function(searchValue) {
	      return is(this._value, searchValue);
	    };

	    Repeat.prototype.slice = function(begin, end) {
	      var size = this.size;
	      return wholeSlice(begin, end, size) ? this :
	        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
	    };

	    Repeat.prototype.reverse = function() {
	      return this;
	    };

	    Repeat.prototype.indexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return 0;
	      }
	      return -1;
	    };

	    Repeat.prototype.lastIndexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return this.size;
	      }
	      return -1;
	    };

	    Repeat.prototype.__iterate = function(fn, reverse) {
	      for (var ii = 0; ii < this.size; ii++) {
	        if (fn(this._value, ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };

	    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      var ii = 0;
	      return new Iterator(function() 
	        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
	      );
	    };

	    Repeat.prototype.equals = function(other) {
	      return other instanceof Repeat ?
	        is(this._value, other._value) :
	        deepEqual(other);
	    };


	  var EMPTY_REPEAT;

	  function invariant(condition, error) {
	    if (!condition) throw new Error(error);
	  }

	  createClass(Range, IndexedSeq);

	    function Range(start, end, step) {
	      if (!(this instanceof Range)) {
	        return new Range(start, end, step);
	      }
	      invariant(step !== 0, 'Cannot step a Range by 0');
	      start = start || 0;
	      if (end === undefined) {
	        end = Infinity;
	      }
	      step = step === undefined ? 1 : Math.abs(step);
	      if (end < start) {
	        step = -step;
	      }
	      this._start = start;
	      this._end = end;
	      this._step = step;
	      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
	      if (this.size === 0) {
	        if (EMPTY_RANGE) {
	          return EMPTY_RANGE;
	        }
	        EMPTY_RANGE = this;
	      }
	    }

	    Range.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Range []';
	      }
	      return 'Range [ ' +
	        this._start + '...' + this._end +
	        (this._step > 1 ? ' by ' + this._step : '') +
	      ' ]';
	    };

	    Range.prototype.get = function(index, notSetValue) {
	      return this.has(index) ?
	        this._start + wrapIndex(this, index) * this._step :
	        notSetValue;
	    };

	    Range.prototype.includes = function(searchValue) {
	      var possibleIndex = (searchValue - this._start) / this._step;
	      return possibleIndex >= 0 &&
	        possibleIndex < this.size &&
	        possibleIndex === Math.floor(possibleIndex);
	    };

	    Range.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      begin = resolveBegin(begin, this.size);
	      end = resolveEnd(end, this.size);
	      if (end <= begin) {
	        return new Range(0, 0);
	      }
	      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
	    };

	    Range.prototype.indexOf = function(searchValue) {
	      var offsetValue = searchValue - this._start;
	      if (offsetValue % this._step === 0) {
	        var index = offsetValue / this._step;
	        if (index >= 0 && index < this.size) {
	          return index
	        }
	      }
	      return -1;
	    };

	    Range.prototype.lastIndexOf = function(searchValue) {
	      return this.indexOf(searchValue);
	    };

	    Range.prototype.__iterate = function(fn, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(value, ii, this) === false) {
	          return ii + 1;
	        }
	        value += reverse ? -step : step;
	      }
	      return ii;
	    };

	    Range.prototype.__iterator = function(type, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      var ii = 0;
	      return new Iterator(function()  {
	        var v = value;
	        value += reverse ? -step : step;
	        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
	      });
	    };

	    Range.prototype.equals = function(other) {
	      return other instanceof Range ?
	        this._start === other._start &&
	        this._end === other._end &&
	        this._step === other._step :
	        deepEqual(this, other);
	    };


	  var EMPTY_RANGE;

	  createClass(Collection, Iterable);
	    function Collection() {
	      throw TypeError('Abstract');
	    }


	  createClass(KeyedCollection, Collection);function KeyedCollection() {}

	  createClass(IndexedCollection, Collection);function IndexedCollection() {}

	  createClass(SetCollection, Collection);function SetCollection() {}


	  Collection.Keyed = KeyedCollection;
	  Collection.Indexed = IndexedCollection;
	  Collection.Set = SetCollection;

	  var imul =
	    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
	    Math.imul :
	    function imul(a, b) {
	      a = a | 0; // int
	      b = b | 0; // int
	      var c = a & 0xffff;
	      var d = b & 0xffff;
	      // Shift by 0 fixes the sign on the high part.
	      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
	    };

	  // v8 has an optimization for storing 31-bit signed numbers.
	  // Values which have either 00 or 11 as the high order bits qualify.
	  // This function drops the highest order bit in a signed number, maintaining
	  // the sign bit.
	  function smi(i32) {
	    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
	  }

	  function hash(o) {
	    if (o === false || o === null || o === undefined) {
	      return 0;
	    }
	    if (typeof o.valueOf === 'function') {
	      o = o.valueOf();
	      if (o === false || o === null || o === undefined) {
	        return 0;
	      }
	    }
	    if (o === true) {
	      return 1;
	    }
	    var type = typeof o;
	    if (type === 'number') {
	      var h = o | 0;
	      if (h !== o) {
	        h ^= o * 0xFFFFFFFF;
	      }
	      while (o > 0xFFFFFFFF) {
	        o /= 0xFFFFFFFF;
	        h ^= o;
	      }
	      return smi(h);
	    }
	    if (type === 'string') {
	      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
	    }
	    if (typeof o.hashCode === 'function') {
	      return o.hashCode();
	    }
	    if (type === 'object') {
	      return hashJSObj(o);
	    }
	    if (typeof o.toString === 'function') {
	      return hashString(o.toString());
	    }
	    throw new Error('Value type ' + type + ' cannot be hashed.');
	  }

	  function cachedHashString(string) {
	    var hash = stringHashCache[string];
	    if (hash === undefined) {
	      hash = hashString(string);
	      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
	        STRING_HASH_CACHE_SIZE = 0;
	        stringHashCache = {};
	      }
	      STRING_HASH_CACHE_SIZE++;
	      stringHashCache[string] = hash;
	    }
	    return hash;
	  }

	  // http://jsperf.com/hashing-strings
	  function hashString(string) {
	    // This is the hash from JVM
	    // The hash code for a string is computed as
	    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	    // where s[i] is the ith character of the string and n is the length of
	    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	    // (exclusive) by dropping high bits.
	    var hash = 0;
	    for (var ii = 0; ii < string.length; ii++) {
	      hash = 31 * hash + string.charCodeAt(ii) | 0;
	    }
	    return smi(hash);
	  }

	  function hashJSObj(obj) {
	    var hash;
	    if (usingWeakMap) {
	      hash = weakMap.get(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }

	    hash = obj[UID_HASH_KEY];
	    if (hash !== undefined) {
	      return hash;
	    }

	    if (!canDefineProperty) {
	      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
	      if (hash !== undefined) {
	        return hash;
	      }

	      hash = getIENodeHash(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }

	    hash = ++objHashUID;
	    if (objHashUID & 0x40000000) {
	      objHashUID = 0;
	    }

	    if (usingWeakMap) {
	      weakMap.set(obj, hash);
	    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
	      throw new Error('Non-extensible objects are not allowed as keys.');
	    } else if (canDefineProperty) {
	      Object.defineProperty(obj, UID_HASH_KEY, {
	        'enumerable': false,
	        'configurable': false,
	        'writable': false,
	        'value': hash
	      });
	    } else if (obj.propertyIsEnumerable !== undefined &&
	               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
	      // Since we can't define a non-enumerable property on the object
	      // we'll hijack one of the less-used non-enumerable properties to
	      // save our hash on it. Since this is a function it will not show up in
	      // `JSON.stringify` which is what we want.
	      obj.propertyIsEnumerable = function() {
	        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
	      };
	      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
	    } else if (obj.nodeType !== undefined) {
	      // At this point we couldn't get the IE `uniqueID` to use as a hash
	      // and we couldn't use a non-enumerable property to exploit the
	      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	      // itself.
	      obj[UID_HASH_KEY] = hash;
	    } else {
	      throw new Error('Unable to set a non-enumerable property on object.');
	    }

	    return hash;
	  }

	  // Get references to ES5 object methods.
	  var isExtensible = Object.isExtensible;

	  // True if Object.defineProperty works as expected. IE8 fails this test.
	  var canDefineProperty = (function() {
	    try {
	      Object.defineProperty({}, '@', {});
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }());

	  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	  // and avoid memory leaks from the IE cloneNode bug.
	  function getIENodeHash(node) {
	    if (node && node.nodeType > 0) {
	      switch (node.nodeType) {
	        case 1: // Element
	          return node.uniqueID;
	        case 9: // Document
	          return node.documentElement && node.documentElement.uniqueID;
	      }
	    }
	  }

	  // If possible, use a WeakMap.
	  var usingWeakMap = typeof WeakMap === 'function';
	  var weakMap;
	  if (usingWeakMap) {
	    weakMap = new WeakMap();
	  }

	  var objHashUID = 0;

	  var UID_HASH_KEY = '__immutablehash__';
	  if (typeof Symbol === 'function') {
	    UID_HASH_KEY = Symbol(UID_HASH_KEY);
	  }

	  var STRING_HASH_CACHE_MIN_STRLEN = 16;
	  var STRING_HASH_CACHE_MAX_SIZE = 255;
	  var STRING_HASH_CACHE_SIZE = 0;
	  var stringHashCache = {};

	  function assertNotInfinite(size) {
	    invariant(
	      size !== Infinity,
	      'Cannot perform this action with an infinite size.'
	    );
	  }

	  createClass(Map, KeyedCollection);

	    // @pragma Construction

	    function Map(value) {
	      return value === null || value === undefined ? emptyMap() :
	        isMap(value) && !isOrdered(value) ? value :
	        emptyMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }

	    Map.prototype.toString = function() {
	      return this.__toString('Map {', '}');
	    };

	    // @pragma Access

	    Map.prototype.get = function(k, notSetValue) {
	      return this._root ?
	        this._root.get(0, undefined, k, notSetValue) :
	        notSetValue;
	    };

	    // @pragma Modification

	    Map.prototype.set = function(k, v) {
	      return updateMap(this, k, v);
	    };

	    Map.prototype.setIn = function(keyPath, v) {
	      return this.updateIn(keyPath, NOT_SET, function()  {return v});
	    };

	    Map.prototype.remove = function(k) {
	      return updateMap(this, k, NOT_SET);
	    };

	    Map.prototype.deleteIn = function(keyPath) {
	      return this.updateIn(keyPath, function()  {return NOT_SET});
	    };

	    Map.prototype.update = function(k, notSetValue, updater) {
	      return arguments.length === 1 ?
	        k(this) :
	        this.updateIn([k], notSetValue, updater);
	    };

	    Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
	      if (!updater) {
	        updater = notSetValue;
	        notSetValue = undefined;
	      }
	      var updatedValue = updateInDeepMap(
	        this,
	        forceIterator(keyPath),
	        notSetValue,
	        updater
	      );
	      return updatedValue === NOT_SET ? undefined : updatedValue;
	    };

	    Map.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._root = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyMap();
	    };

	    // @pragma Composition

	    Map.prototype.merge = function(/*...iters*/) {
	      return mergeIntoMapWith(this, undefined, arguments);
	    };

	    Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, merger, iters);
	    };

	    Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.merge === 'function' ?
	          m.merge.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };

	    Map.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoMapWith(this, deepMerger, arguments);
	    };

	    Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, deepMergerWith(merger), iters);
	    };

	    Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.mergeDeep === 'function' ?
	          m.mergeDeep.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };

	    Map.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator));
	    };

	    Map.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator, mapper));
	    };

	    // @pragma Mutability

	    Map.prototype.withMutations = function(fn) {
	      var mutable = this.asMutable();
	      fn(mutable);
	      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
	    };

	    Map.prototype.asMutable = function() {
	      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
	    };

	    Map.prototype.asImmutable = function() {
	      return this.__ensureOwner();
	    };

	    Map.prototype.wasAltered = function() {
	      return this.__altered;
	    };

	    Map.prototype.__iterator = function(type, reverse) {
	      return new MapIterator(this, type, reverse);
	    };

	    Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      this._root && this._root.iterate(function(entry ) {
	        iterations++;
	        return fn(entry[1], entry[0], this$0);
	      }, reverse);
	      return iterations;
	    };

	    Map.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeMap(this.size, this._root, ownerID, this.__hash);
	    };


	  function isMap(maybeMap) {
	    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
	  }

	  Map.isMap = isMap;

	  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

	  var MapPrototype = Map.prototype;
	  MapPrototype[IS_MAP_SENTINEL] = true;
	  MapPrototype[DELETE] = MapPrototype.remove;
	  MapPrototype.removeIn = MapPrototype.deleteIn;


	  // #pragma Trie Nodes



	    function ArrayMapNode(ownerID, entries) {
	      this.ownerID = ownerID;
	      this.entries = entries;
	    }

	    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };

	    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;

	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;

	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }

	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);

	      if (removed && entries.length === 1) {
	        return; // undefined
	      }

	      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
	        return createNodes(ownerID, entries, key, value);
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);

	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }

	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }

	      return new ArrayMapNode(ownerID, newEntries);
	    };




	    function BitmapIndexedNode(ownerID, bitmap, nodes) {
	      this.ownerID = ownerID;
	      this.bitmap = bitmap;
	      this.nodes = nodes;
	    }

	    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
	      var bitmap = this.bitmap;
	      return (bitmap & bit) === 0 ? notSetValue :
	        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
	    };

	    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var bit = 1 << keyHashFrag;
	      var bitmap = this.bitmap;
	      var exists = (bitmap & bit) !== 0;

	      if (!exists && value === NOT_SET) {
	        return this;
	      }

	      var idx = popCount(bitmap & (bit - 1));
	      var nodes = this.nodes;
	      var node = exists ? nodes[idx] : undefined;
	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

	      if (newNode === node) {
	        return this;
	      }

	      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
	        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
	      }

	      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
	        return nodes[idx ^ 1];
	      }

	      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
	        return newNode;
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
	      var newNodes = exists ? newNode ?
	        setIn(nodes, idx, newNode, isEditable) :
	        spliceOut(nodes, idx, isEditable) :
	        spliceIn(nodes, idx, newNode, isEditable);

	      if (isEditable) {
	        this.bitmap = newBitmap;
	        this.nodes = newNodes;
	        return this;
	      }

	      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
	    };




	    function HashArrayMapNode(ownerID, count, nodes) {
	      this.ownerID = ownerID;
	      this.count = count;
	      this.nodes = nodes;
	    }

	    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var node = this.nodes[idx];
	      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
	    };

	    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var removed = value === NOT_SET;
	      var nodes = this.nodes;
	      var node = nodes[idx];

	      if (removed && !node) {
	        return this;
	      }

	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
	      if (newNode === node) {
	        return this;
	      }

	      var newCount = this.count;
	      if (!node) {
	        newCount++;
	      } else if (!newNode) {
	        newCount--;
	        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
	          return packNodes(ownerID, nodes, newCount, idx);
	        }
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newNodes = setIn(nodes, idx, newNode, isEditable);

	      if (isEditable) {
	        this.count = newCount;
	        this.nodes = newNodes;
	        return this;
	      }

	      return new HashArrayMapNode(ownerID, newCount, newNodes);
	    };




	    function HashCollisionNode(ownerID, keyHash, entries) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entries = entries;
	    }

	    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };

	    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }

	      var removed = value === NOT_SET;

	      if (keyHash !== this.keyHash) {
	        if (removed) {
	          return this;
	        }
	        SetRef(didAlter);
	        SetRef(didChangeSize);
	        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
	      }

	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;

	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }

	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);

	      if (removed && len === 2) {
	        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);

	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }

	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }

	      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
	    };




	    function ValueNode(ownerID, keyHash, entry) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entry = entry;
	    }

	    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
	    };

	    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;
	      var keyMatch = is(key, this.entry[0]);
	      if (keyMatch ? value === this.entry[1] : removed) {
	        return this;
	      }

	      SetRef(didAlter);

	      if (removed) {
	        SetRef(didChangeSize);
	        return; // undefined
	      }

	      if (keyMatch) {
	        if (ownerID && ownerID === this.ownerID) {
	          this.entry[1] = value;
	          return this;
	        }
	        return new ValueNode(ownerID, this.keyHash, [key, value]);
	      }

	      SetRef(didChangeSize);
	      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
	    };



	  // #pragma Iterators

	  ArrayMapNode.prototype.iterate =
	  HashCollisionNode.prototype.iterate = function (fn, reverse) {
	    var entries = this.entries;
	    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
	      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
	        return false;
	      }
	    }
	  }

	  BitmapIndexedNode.prototype.iterate =
	  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
	    var nodes = this.nodes;
	    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
	      var node = nodes[reverse ? maxIndex - ii : ii];
	      if (node && node.iterate(fn, reverse) === false) {
	        return false;
	      }
	    }
	  }

	  ValueNode.prototype.iterate = function (fn, reverse) {
	    return fn(this.entry);
	  }

	  createClass(MapIterator, Iterator);

	    function MapIterator(map, type, reverse) {
	      this._type = type;
	      this._reverse = reverse;
	      this._stack = map._root && mapIteratorFrame(map._root);
	    }

	    MapIterator.prototype.next = function() {
	      var type = this._type;
	      var stack = this._stack;
	      while (stack) {
	        var node = stack.node;
	        var index = stack.index++;
	        var maxIndex;
	        if (node.entry) {
	          if (index === 0) {
	            return mapIteratorValue(type, node.entry);
	          }
	        } else if (node.entries) {
	          maxIndex = node.entries.length - 1;
	          if (index <= maxIndex) {
	            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
	          }
	        } else {
	          maxIndex = node.nodes.length - 1;
	          if (index <= maxIndex) {
	            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
	            if (subNode) {
	              if (subNode.entry) {
	                return mapIteratorValue(type, subNode.entry);
	              }
	              stack = this._stack = mapIteratorFrame(subNode, stack);
	            }
	            continue;
	          }
	        }
	        stack = this._stack = this._stack.__prev;
	      }
	      return iteratorDone();
	    };


	  function mapIteratorValue(type, entry) {
	    return iteratorValue(type, entry[0], entry[1]);
	  }

	  function mapIteratorFrame(node, prev) {
	    return {
	      node: node,
	      index: 0,
	      __prev: prev
	    };
	  }

	  function makeMap(size, root, ownerID, hash) {
	    var map = Object.create(MapPrototype);
	    map.size = size;
	    map._root = root;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }

	  var EMPTY_MAP;
	  function emptyMap() {
	    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
	  }

	  function updateMap(map, k, v) {
	    var newRoot;
	    var newSize;
	    if (!map._root) {
	      if (v === NOT_SET) {
	        return map;
	      }
	      newSize = 1;
	      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
	    } else {
	      var didChangeSize = MakeRef(CHANGE_LENGTH);
	      var didAlter = MakeRef(DID_ALTER);
	      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
	      if (!didAlter.value) {
	        return map;
	      }
	      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
	    }
	    if (map.__ownerID) {
	      map.size = newSize;
	      map._root = newRoot;
	      map.__hash = undefined;
	      map.__altered = true;
	      return map;
	    }
	    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
	  }

	  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    if (!node) {
	      if (value === NOT_SET) {
	        return node;
	      }
	      SetRef(didAlter);
	      SetRef(didChangeSize);
	      return new ValueNode(ownerID, keyHash, [key, value]);
	    }
	    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
	  }

	  function isLeafNode(node) {
	    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
	  }

	  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
	    if (node.keyHash === keyHash) {
	      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
	    }

	    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
	    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

	    var newNode;
	    var nodes = idx1 === idx2 ?
	      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
	      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

	    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
	  }

	  function createNodes(ownerID, entries, key, value) {
	    if (!ownerID) {
	      ownerID = new OwnerID();
	    }
	    var node = new ValueNode(ownerID, hash(key), [key, value]);
	    for (var ii = 0; ii < entries.length; ii++) {
	      var entry = entries[ii];
	      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
	    }
	    return node;
	  }

	  function packNodes(ownerID, nodes, count, excluding) {
	    var bitmap = 0;
	    var packedII = 0;
	    var packedNodes = new Array(count);
	    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
	      var node = nodes[ii];
	      if (node !== undefined && ii !== excluding) {
	        bitmap |= bit;
	        packedNodes[packedII++] = node;
	      }
	    }
	    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
	  }

	  function expandNodes(ownerID, nodes, bitmap, including, node) {
	    var count = 0;
	    var expandedNodes = new Array(SIZE);
	    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
	      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
	    }
	    expandedNodes[including] = node;
	    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
	  }

	  function mergeIntoMapWith(map, merger, iterables) {
	    var iters = [];
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = KeyedIterable(value);
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    return mergeIntoCollectionWith(map, merger, iters);
	  }

	  function deepMerger(existing, value, key) {
	    return existing && existing.mergeDeep && isIterable(value) ?
	      existing.mergeDeep(value) :
	      is(existing, value) ? existing : value;
	  }

	  function deepMergerWith(merger) {
	    return function(existing, value, key)  {
	      if (existing && existing.mergeDeepWith && isIterable(value)) {
	        return existing.mergeDeepWith(merger, value);
	      }
	      var nextValue = merger(existing, value, key);
	      return is(existing, nextValue) ? existing : nextValue;
	    };
	  }

	  function mergeIntoCollectionWith(collection, merger, iters) {
	    iters = iters.filter(function(x ) {return x.size !== 0});
	    if (iters.length === 0) {
	      return collection;
	    }
	    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
	      return collection.constructor(iters[0]);
	    }
	    return collection.withMutations(function(collection ) {
	      var mergeIntoMap = merger ?
	        function(value, key)  {
	          collection.update(key, NOT_SET, function(existing )
	            {return existing === NOT_SET ? value : merger(existing, value, key)}
	          );
	        } :
	        function(value, key)  {
	          collection.set(key, value);
	        }
	      for (var ii = 0; ii < iters.length; ii++) {
	        iters[ii].forEach(mergeIntoMap);
	      }
	    });
	  }

	  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
	    var isNotSet = existing === NOT_SET;
	    var step = keyPathIter.next();
	    if (step.done) {
	      var existingValue = isNotSet ? notSetValue : existing;
	      var newValue = updater(existingValue);
	      return newValue === existingValue ? existing : newValue;
	    }
	    invariant(
	      isNotSet || (existing && existing.set),
	      'invalid keyPath'
	    );
	    var key = step.value;
	    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
	    var nextUpdated = updateInDeepMap(
	      nextExisting,
	      keyPathIter,
	      notSetValue,
	      updater
	    );
	    return nextUpdated === nextExisting ? existing :
	      nextUpdated === NOT_SET ? existing.remove(key) :
	      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
	  }

	  function popCount(x) {
	    x = x - ((x >> 1) & 0x55555555);
	    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
	    x = (x + (x >> 4)) & 0x0f0f0f0f;
	    x = x + (x >> 8);
	    x = x + (x >> 16);
	    return x & 0x7f;
	  }

	  function setIn(array, idx, val, canEdit) {
	    var newArray = canEdit ? array : arrCopy(array);
	    newArray[idx] = val;
	    return newArray;
	  }

	  function spliceIn(array, idx, val, canEdit) {
	    var newLen = array.length + 1;
	    if (canEdit && idx + 1 === newLen) {
	      array[idx] = val;
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        newArray[ii] = val;
	        after = -1;
	      } else {
	        newArray[ii] = array[ii + after];
	      }
	    }
	    return newArray;
	  }

	  function spliceOut(array, idx, canEdit) {
	    var newLen = array.length - 1;
	    if (canEdit && idx === newLen) {
	      array.pop();
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        after = 1;
	      }
	      newArray[ii] = array[ii + after];
	    }
	    return newArray;
	  }

	  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
	  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
	  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

	  createClass(List, IndexedCollection);

	    // @pragma Construction

	    function List(value) {
	      var empty = emptyList();
	      if (value === null || value === undefined) {
	        return empty;
	      }
	      if (isList(value)) {
	        return value;
	      }
	      var iter = IndexedIterable(value);
	      var size = iter.size;
	      if (size === 0) {
	        return empty;
	      }
	      assertNotInfinite(size);
	      if (size > 0 && size < SIZE) {
	        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
	      }
	      return empty.withMutations(function(list ) {
	        list.setSize(size);
	        iter.forEach(function(v, i)  {return list.set(i, v)});
	      });
	    }

	    List.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    List.prototype.toString = function() {
	      return this.__toString('List [', ']');
	    };

	    // @pragma Access

	    List.prototype.get = function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      if (index >= 0 && index < this.size) {
	        index += this._origin;
	        var node = listNodeFor(this, index);
	        return node && node.array[index & MASK];
	      }
	      return notSetValue;
	    };

	    // @pragma Modification

	    List.prototype.set = function(index, value) {
	      return updateList(this, index, value);
	    };

	    List.prototype.remove = function(index) {
	      return !this.has(index) ? this :
	        index === 0 ? this.shift() :
	        index === this.size - 1 ? this.pop() :
	        this.splice(index, 1);
	    };

	    List.prototype.insert = function(index, value) {
	      return this.splice(index, 0, value);
	    };

	    List.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = this._origin = this._capacity = 0;
	        this._level = SHIFT;
	        this._root = this._tail = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyList();
	    };

	    List.prototype.push = function(/*...values*/) {
	      var values = arguments;
	      var oldSize = this.size;
	      return this.withMutations(function(list ) {
	        setListBounds(list, 0, oldSize + values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(oldSize + ii, values[ii]);
	        }
	      });
	    };

	    List.prototype.pop = function() {
	      return setListBounds(this, 0, -1);
	    };

	    List.prototype.unshift = function(/*...values*/) {
	      var values = arguments;
	      return this.withMutations(function(list ) {
	        setListBounds(list, -values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(ii, values[ii]);
	        }
	      });
	    };

	    List.prototype.shift = function() {
	      return setListBounds(this, 1);
	    };

	    // @pragma Composition

	    List.prototype.merge = function(/*...iters*/) {
	      return mergeIntoListWith(this, undefined, arguments);
	    };

	    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, merger, iters);
	    };

	    List.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoListWith(this, deepMerger, arguments);
	    };

	    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, deepMergerWith(merger), iters);
	    };

	    List.prototype.setSize = function(size) {
	      return setListBounds(this, 0, size);
	    };

	    // @pragma Iteration

	    List.prototype.slice = function(begin, end) {
	      var size = this.size;
	      if (wholeSlice(begin, end, size)) {
	        return this;
	      }
	      return setListBounds(
	        this,
	        resolveBegin(begin, size),
	        resolveEnd(end, size)
	      );
	    };

	    List.prototype.__iterator = function(type, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      return new Iterator(function()  {
	        var value = values();
	        return value === DONE ?
	          iteratorDone() :
	          iteratorValue(type, index++, value);
	      });
	    };

	    List.prototype.__iterate = function(fn, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      var value;
	      while ((value = values()) !== DONE) {
	        if (fn(value, index++, this) === false) {
	          break;
	        }
	      }
	      return index;
	    };

	    List.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        return this;
	      }
	      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
	    };


	  function isList(maybeList) {
	    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
	  }

	  List.isList = isList;

	  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

	  var ListPrototype = List.prototype;
	  ListPrototype[IS_LIST_SENTINEL] = true;
	  ListPrototype[DELETE] = ListPrototype.remove;
	  ListPrototype.setIn = MapPrototype.setIn;
	  ListPrototype.deleteIn =
	  ListPrototype.removeIn = MapPrototype.removeIn;
	  ListPrototype.update = MapPrototype.update;
	  ListPrototype.updateIn = MapPrototype.updateIn;
	  ListPrototype.mergeIn = MapPrototype.mergeIn;
	  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  ListPrototype.withMutations = MapPrototype.withMutations;
	  ListPrototype.asMutable = MapPrototype.asMutable;
	  ListPrototype.asImmutable = MapPrototype.asImmutable;
	  ListPrototype.wasAltered = MapPrototype.wasAltered;



	    function VNode(array, ownerID) {
	      this.array = array;
	      this.ownerID = ownerID;
	    }

	    // TODO: seems like these methods are very similar

	    VNode.prototype.removeBefore = function(ownerID, level, index) {
	      if (index === level ? 1 << level : 0 || this.array.length === 0) {
	        return this;
	      }
	      var originIndex = (index >>> level) & MASK;
	      if (originIndex >= this.array.length) {
	        return new VNode([], ownerID);
	      }
	      var removingFirst = originIndex === 0;
	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[originIndex];
	        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && removingFirst) {
	          return this;
	        }
	      }
	      if (removingFirst && !newChild) {
	        return this;
	      }
	      var editable = editableVNode(this, ownerID);
	      if (!removingFirst) {
	        for (var ii = 0; ii < originIndex; ii++) {
	          editable.array[ii] = undefined;
	        }
	      }
	      if (newChild) {
	        editable.array[originIndex] = newChild;
	      }
	      return editable;
	    };

	    VNode.prototype.removeAfter = function(ownerID, level, index) {
	      if (index === (level ? 1 << level : 0) || this.array.length === 0) {
	        return this;
	      }
	      var sizeIndex = ((index - 1) >>> level) & MASK;
	      if (sizeIndex >= this.array.length) {
	        return this;
	      }

	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[sizeIndex];
	        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && sizeIndex === this.array.length - 1) {
	          return this;
	        }
	      }

	      var editable = editableVNode(this, ownerID);
	      editable.array.splice(sizeIndex + 1);
	      if (newChild) {
	        editable.array[sizeIndex] = newChild;
	      }
	      return editable;
	    };



	  var DONE = {};

	  function iterateList(list, reverse) {
	    var left = list._origin;
	    var right = list._capacity;
	    var tailPos = getTailOffset(right);
	    var tail = list._tail;

	    return iterateNodeOrLeaf(list._root, list._level, 0);

	    function iterateNodeOrLeaf(node, level, offset) {
	      return level === 0 ?
	        iterateLeaf(node, offset) :
	        iterateNode(node, level, offset);
	    }

	    function iterateLeaf(node, offset) {
	      var array = offset === tailPos ? tail && tail.array : node && node.array;
	      var from = offset > left ? 0 : left - offset;
	      var to = right - offset;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        if (from === to) {
	          return DONE;
	        }
	        var idx = reverse ? --to : from++;
	        return array && array[idx];
	      };
	    }

	    function iterateNode(node, level, offset) {
	      var values;
	      var array = node && node.array;
	      var from = offset > left ? 0 : (left - offset) >> level;
	      var to = ((right - offset) >> level) + 1;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        do {
	          if (values) {
	            var value = values();
	            if (value !== DONE) {
	              return value;
	            }
	            values = null;
	          }
	          if (from === to) {
	            return DONE;
	          }
	          var idx = reverse ? --to : from++;
	          values = iterateNodeOrLeaf(
	            array && array[idx], level - SHIFT, offset + (idx << level)
	          );
	        } while (true);
	      };
	    }
	  }

	  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
	    var list = Object.create(ListPrototype);
	    list.size = capacity - origin;
	    list._origin = origin;
	    list._capacity = capacity;
	    list._level = level;
	    list._root = root;
	    list._tail = tail;
	    list.__ownerID = ownerID;
	    list.__hash = hash;
	    list.__altered = false;
	    return list;
	  }

	  var EMPTY_LIST;
	  function emptyList() {
	    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
	  }

	  function updateList(list, index, value) {
	    index = wrapIndex(list, index);

	    if (index !== index) {
	      return list;
	    }

	    if (index >= list.size || index < 0) {
	      return list.withMutations(function(list ) {
	        index < 0 ?
	          setListBounds(list, index).set(0, value) :
	          setListBounds(list, 0, index + 1).set(index, value)
	      });
	    }

	    index += list._origin;

	    var newTail = list._tail;
	    var newRoot = list._root;
	    var didAlter = MakeRef(DID_ALTER);
	    if (index >= getTailOffset(list._capacity)) {
	      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
	    } else {
	      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
	    }

	    if (!didAlter.value) {
	      return list;
	    }

	    if (list.__ownerID) {
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
	  }

	  function updateVNode(node, ownerID, level, index, value, didAlter) {
	    var idx = (index >>> level) & MASK;
	    var nodeHas = node && idx < node.array.length;
	    if (!nodeHas && value === undefined) {
	      return node;
	    }

	    var newNode;

	    if (level > 0) {
	      var lowerNode = node && node.array[idx];
	      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
	      if (newLowerNode === lowerNode) {
	        return node;
	      }
	      newNode = editableVNode(node, ownerID);
	      newNode.array[idx] = newLowerNode;
	      return newNode;
	    }

	    if (nodeHas && node.array[idx] === value) {
	      return node;
	    }

	    SetRef(didAlter);

	    newNode = editableVNode(node, ownerID);
	    if (value === undefined && idx === newNode.array.length - 1) {
	      newNode.array.pop();
	    } else {
	      newNode.array[idx] = value;
	    }
	    return newNode;
	  }

	  function editableVNode(node, ownerID) {
	    if (ownerID && node && ownerID === node.ownerID) {
	      return node;
	    }
	    return new VNode(node ? node.array.slice() : [], ownerID);
	  }

	  function listNodeFor(list, rawIndex) {
	    if (rawIndex >= getTailOffset(list._capacity)) {
	      return list._tail;
	    }
	    if (rawIndex < 1 << (list._level + SHIFT)) {
	      var node = list._root;
	      var level = list._level;
	      while (node && level > 0) {
	        node = node.array[(rawIndex >>> level) & MASK];
	        level -= SHIFT;
	      }
	      return node;
	    }
	  }

	  function setListBounds(list, begin, end) {
	    // Sanitize begin & end using this shorthand for ToInt32(argument)
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	    if (begin !== undefined) {
	      begin = begin | 0;
	    }
	    if (end !== undefined) {
	      end = end | 0;
	    }
	    var owner = list.__ownerID || new OwnerID();
	    var oldOrigin = list._origin;
	    var oldCapacity = list._capacity;
	    var newOrigin = oldOrigin + begin;
	    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
	    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
	      return list;
	    }

	    // If it's going to end after it starts, it's empty.
	    if (newOrigin >= newCapacity) {
	      return list.clear();
	    }

	    var newLevel = list._level;
	    var newRoot = list._root;

	    // New origin might need creating a higher root.
	    var offsetShift = 0;
	    while (newOrigin + offsetShift < 0) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
	      newLevel += SHIFT;
	      offsetShift += 1 << newLevel;
	    }
	    if (offsetShift) {
	      newOrigin += offsetShift;
	      oldOrigin += offsetShift;
	      newCapacity += offsetShift;
	      oldCapacity += offsetShift;
	    }

	    var oldTailOffset = getTailOffset(oldCapacity);
	    var newTailOffset = getTailOffset(newCapacity);

	    // New size might need creating a higher root.
	    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
	      newLevel += SHIFT;
	    }

	    // Locate or create the new tail.
	    var oldTail = list._tail;
	    var newTail = newTailOffset < oldTailOffset ?
	      listNodeFor(list, newCapacity - 1) :
	      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

	    // Merge Tail into tree.
	    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
	      newRoot = editableVNode(newRoot, owner);
	      var node = newRoot;
	      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
	        var idx = (oldTailOffset >>> level) & MASK;
	        node = node.array[idx] = editableVNode(node.array[idx], owner);
	      }
	      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
	    }

	    // If the size has been reduced, there's a chance the tail needs to be trimmed.
	    if (newCapacity < oldCapacity) {
	      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
	    }

	    // If the new origin is within the tail, then we do not need a root.
	    if (newOrigin >= newTailOffset) {
	      newOrigin -= newTailOffset;
	      newCapacity -= newTailOffset;
	      newLevel = SHIFT;
	      newRoot = null;
	      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

	    // Otherwise, if the root has been trimmed, garbage collect.
	    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
	      offsetShift = 0;

	      // Identify the new top root node of the subtree of the old root.
	      while (newRoot) {
	        var beginIndex = (newOrigin >>> newLevel) & MASK;
	        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
	          break;
	        }
	        if (beginIndex) {
	          offsetShift += (1 << newLevel) * beginIndex;
	        }
	        newLevel -= SHIFT;
	        newRoot = newRoot.array[beginIndex];
	      }

	      // Trim the new sides of the new root.
	      if (newRoot && newOrigin > oldOrigin) {
	        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
	      }
	      if (newRoot && newTailOffset < oldTailOffset) {
	        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
	      }
	      if (offsetShift) {
	        newOrigin -= offsetShift;
	        newCapacity -= offsetShift;
	      }
	    }

	    if (list.__ownerID) {
	      list.size = newCapacity - newOrigin;
	      list._origin = newOrigin;
	      list._capacity = newCapacity;
	      list._level = newLevel;
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
	  }

	  function mergeIntoListWith(list, merger, iterables) {
	    var iters = [];
	    var maxSize = 0;
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = IndexedIterable(value);
	      if (iter.size > maxSize) {
	        maxSize = iter.size;
	      }
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    if (maxSize > list.size) {
	      list = list.setSize(maxSize);
	    }
	    return mergeIntoCollectionWith(list, merger, iters);
	  }

	  function getTailOffset(size) {
	    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
	  }

	  createClass(OrderedMap, Map);

	    // @pragma Construction

	    function OrderedMap(value) {
	      return value === null || value === undefined ? emptyOrderedMap() :
	        isOrderedMap(value) ? value :
	        emptyOrderedMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }

	    OrderedMap.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    OrderedMap.prototype.toString = function() {
	      return this.__toString('OrderedMap {', '}');
	    };

	    // @pragma Access

	    OrderedMap.prototype.get = function(k, notSetValue) {
	      var index = this._map.get(k);
	      return index !== undefined ? this._list.get(index)[1] : notSetValue;
	    };

	    // @pragma Modification

	    OrderedMap.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._map.clear();
	        this._list.clear();
	        return this;
	      }
	      return emptyOrderedMap();
	    };

	    OrderedMap.prototype.set = function(k, v) {
	      return updateOrderedMap(this, k, v);
	    };

	    OrderedMap.prototype.remove = function(k) {
	      return updateOrderedMap(this, k, NOT_SET);
	    };

	    OrderedMap.prototype.wasAltered = function() {
	      return this._map.wasAltered() || this._list.wasAltered();
	    };

	    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._list.__iterate(
	        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
	        reverse
	      );
	    };

	    OrderedMap.prototype.__iterator = function(type, reverse) {
	      return this._list.fromEntrySeq().__iterator(type, reverse);
	    };

	    OrderedMap.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      var newList = this._list.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        this._list = newList;
	        return this;
	      }
	      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
	    };


	  function isOrderedMap(maybeOrderedMap) {
	    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
	  }

	  OrderedMap.isOrderedMap = isOrderedMap;

	  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
	  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



	  function makeOrderedMap(map, list, ownerID, hash) {
	    var omap = Object.create(OrderedMap.prototype);
	    omap.size = map ? map.size : 0;
	    omap._map = map;
	    omap._list = list;
	    omap.__ownerID = ownerID;
	    omap.__hash = hash;
	    return omap;
	  }

	  var EMPTY_ORDERED_MAP;
	  function emptyOrderedMap() {
	    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
	  }

	  function updateOrderedMap(omap, k, v) {
	    var map = omap._map;
	    var list = omap._list;
	    var i = map.get(k);
	    var has = i !== undefined;
	    var newMap;
	    var newList;
	    if (v === NOT_SET) { // removed
	      if (!has) {
	        return omap;
	      }
	      if (list.size >= SIZE && list.size >= map.size * 2) {
	        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
	        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
	        if (omap.__ownerID) {
	          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
	        }
	      } else {
	        newMap = map.remove(k);
	        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
	      }
	    } else {
	      if (has) {
	        if (v === list.get(i)[1]) {
	          return omap;
	        }
	        newMap = map;
	        newList = list.set(i, [k, v]);
	      } else {
	        newMap = map.set(k, list.size);
	        newList = list.set(list.size, [k, v]);
	      }
	    }
	    if (omap.__ownerID) {
	      omap.size = newMap.size;
	      omap._map = newMap;
	      omap._list = newList;
	      omap.__hash = undefined;
	      return omap;
	    }
	    return makeOrderedMap(newMap, newList);
	  }

	  createClass(ToKeyedSequence, KeyedSeq);
	    function ToKeyedSequence(indexed, useKeys) {
	      this._iter = indexed;
	      this._useKeys = useKeys;
	      this.size = indexed.size;
	    }

	    ToKeyedSequence.prototype.get = function(key, notSetValue) {
	      return this._iter.get(key, notSetValue);
	    };

	    ToKeyedSequence.prototype.has = function(key) {
	      return this._iter.has(key);
	    };

	    ToKeyedSequence.prototype.valueSeq = function() {
	      return this._iter.valueSeq();
	    };

	    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
	      var reversedSequence = reverseFactory(this, true);
	      if (!this._useKeys) {
	        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
	      }
	      return reversedSequence;
	    };

	    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
	      var mappedSequence = mapFactory(this, mapper, context);
	      if (!this._useKeys) {
	        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
	      }
	      return mappedSequence;
	    };

	    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var ii;
	      return this._iter.__iterate(
	        this._useKeys ?
	          function(v, k)  {return fn(v, k, this$0)} :
	          ((ii = reverse ? resolveSize(this) : 0),
	            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
	        reverse
	      );
	    };

	    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
	      if (this._useKeys) {
	        return this._iter.__iterator(type, reverse);
	      }
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var ii = reverse ? resolveSize(this) : 0;
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
	      });
	    };

	  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


	  createClass(ToIndexedSequence, IndexedSeq);
	    function ToIndexedSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }

	    ToIndexedSequence.prototype.includes = function(value) {
	      return this._iter.includes(value);
	    };

	    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
	    };

	    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, iterations++, step.value, step)
	      });
	    };



	  createClass(ToSetSequence, SetSeq);
	    function ToSetSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }

	    ToSetSequence.prototype.has = function(key) {
	      return this._iter.includes(key);
	    };

	    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
	    };

	    ToSetSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, step.value, step.value, step);
	      });
	    };



	  createClass(FromEntriesSequence, KeyedSeq);
	    function FromEntriesSequence(entries) {
	      this._iter = entries;
	      this.size = entries.size;
	    }

	    FromEntriesSequence.prototype.entrySeq = function() {
	      return this._iter.toSeq();
	    };

	    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(entry ) {
	        // Check if entry exists first so array access doesn't throw for holes
	        // in the parent iteration.
	        if (entry) {
	          validateEntry(entry);
	          var indexedIterable = isIterable(entry);
	          return fn(
	            indexedIterable ? entry.get(1) : entry[1],
	            indexedIterable ? entry.get(0) : entry[0],
	            this$0
	          );
	        }
	      }, reverse);
	    };

	    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          // Check if entry exists first so array access doesn't throw for holes
	          // in the parent iteration.
	          if (entry) {
	            validateEntry(entry);
	            var indexedIterable = isIterable(entry);
	            return iteratorValue(
	              type,
	              indexedIterable ? entry.get(0) : entry[0],
	              indexedIterable ? entry.get(1) : entry[1],
	              step
	            );
	          }
	        }
	      });
	    };


	  ToIndexedSequence.prototype.cacheResult =
	  ToKeyedSequence.prototype.cacheResult =
	  ToSetSequence.prototype.cacheResult =
	  FromEntriesSequence.prototype.cacheResult =
	    cacheResultThrough;


	  function flipFactory(iterable) {
	    var flipSequence = makeSequence(iterable);
	    flipSequence._iter = iterable;
	    flipSequence.size = iterable.size;
	    flipSequence.flip = function()  {return iterable};
	    flipSequence.reverse = function () {
	      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
	      reversedSequence.flip = function()  {return iterable.reverse()};
	      return reversedSequence;
	    };
	    flipSequence.has = function(key ) {return iterable.includes(key)};
	    flipSequence.includes = function(key ) {return iterable.has(key)};
	    flipSequence.cacheResult = cacheResultThrough;
	    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
	    }
	    flipSequence.__iteratorUncached = function(type, reverse) {
	      if (type === ITERATE_ENTRIES) {
	        var iterator = iterable.__iterator(type, reverse);
	        return new Iterator(function()  {
	          var step = iterator.next();
	          if (!step.done) {
	            var k = step.value[0];
	            step.value[0] = step.value[1];
	            step.value[1] = k;
	          }
	          return step;
	        });
	      }
	      return iterable.__iterator(
	        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
	        reverse
	      );
	    }
	    return flipSequence;
	  }


	  function mapFactory(iterable, mapper, context) {
	    var mappedSequence = makeSequence(iterable);
	    mappedSequence.size = iterable.size;
	    mappedSequence.has = function(key ) {return iterable.has(key)};
	    mappedSequence.get = function(key, notSetValue)  {
	      var v = iterable.get(key, NOT_SET);
	      return v === NOT_SET ?
	        notSetValue :
	        mapper.call(context, v, key, iterable);
	    };
	    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(
	        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
	        reverse
	      );
	    }
	    mappedSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      return new Iterator(function()  {
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var key = entry[0];
	        return iteratorValue(
	          type,
	          key,
	          mapper.call(context, entry[1], key, iterable),
	          step
	        );
	      });
	    }
	    return mappedSequence;
	  }


	  function reverseFactory(iterable, useKeys) {
	    var reversedSequence = makeSequence(iterable);
	    reversedSequence._iter = iterable;
	    reversedSequence.size = iterable.size;
	    reversedSequence.reverse = function()  {return iterable};
	    if (iterable.flip) {
	      reversedSequence.flip = function () {
	        var flipSequence = flipFactory(iterable);
	        flipSequence.reverse = function()  {return iterable.flip()};
	        return flipSequence;
	      };
	    }
	    reversedSequence.get = function(key, notSetValue) 
	      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
	    reversedSequence.has = function(key )
	      {return iterable.has(useKeys ? key : -1 - key)};
	    reversedSequence.includes = function(value ) {return iterable.includes(value)};
	    reversedSequence.cacheResult = cacheResultThrough;
	    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
	    };
	    reversedSequence.__iterator =
	      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
	    return reversedSequence;
	  }


	  function filterFactory(iterable, predicate, context, useKeys) {
	    var filterSequence = makeSequence(iterable);
	    if (useKeys) {
	      filterSequence.has = function(key ) {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
	      };
	      filterSequence.get = function(key, notSetValue)  {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
	          v : notSetValue;
	      };
	    }
	    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      }, reverse);
	      return iterations;
	    };
	    filterSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterations = 0;
	      return new Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          var key = entry[0];
	          var value = entry[1];
	          if (predicate.call(context, value, key, iterable)) {
	            return iteratorValue(type, useKeys ? key : iterations++, value, step);
	          }
	        }
	      });
	    }
	    return filterSequence;
	  }


	  function countByFactory(iterable, grouper, context) {
	    var groups = Map().asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        0,
	        function(a ) {return a + 1}
	      );
	    });
	    return groups.asImmutable();
	  }


	  function groupByFactory(iterable, grouper, context) {
	    var isKeyedIter = isKeyed(iterable);
	    var groups = (isOrdered(iterable) ? OrderedMap() : Map()).asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
	      );
	    });
	    var coerce = iterableClass(iterable);
	    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
	  }


	  function sliceFactory(iterable, begin, end, useKeys) {
	    var originalSize = iterable.size;

	    // Sanitize begin & end using this shorthand for ToInt32(argument)
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	    if (begin !== undefined) {
	      begin = begin | 0;
	    }
	    if (end !== undefined) {
	      end = end | 0;
	    }

	    if (wholeSlice(begin, end, originalSize)) {
	      return iterable;
	    }

	    var resolvedBegin = resolveBegin(begin, originalSize);
	    var resolvedEnd = resolveEnd(end, originalSize);

	    // begin or end will be NaN if they were provided as negative numbers and
	    // this iterable's size is unknown. In that case, cache first so there is
	    // a known size and these do not resolve to NaN.
	    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
	      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
	    }

	    // Note: resolvedEnd is undefined when the original sequence's length is
	    // unknown and this slice did not supply an end and should contain all
	    // elements after resolvedBegin.
	    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	    var resolvedSize = resolvedEnd - resolvedBegin;
	    var sliceSize;
	    if (resolvedSize === resolvedSize) {
	      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
	    }

	    var sliceSeq = makeSequence(iterable);

	    // If iterable.size is undefined, the size of the realized sliceSeq is
	    // unknown at this point unless the number of items to slice is 0
	    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;

	    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
	      sliceSeq.get = function (index, notSetValue) {
	        index = wrapIndex(this, index);
	        return index >= 0 && index < sliceSize ?
	          iterable.get(index + resolvedBegin, notSetValue) :
	          notSetValue;
	      }
	    }

	    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (sliceSize === 0) {
	        return 0;
	      }
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var skipped = 0;
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k)  {
	        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
	                 iterations !== sliceSize;
	        }
	      });
	      return iterations;
	    };

	    sliceSeq.__iteratorUncached = function(type, reverse) {
	      if (sliceSize !== 0 && reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      // Don't bother instantiating parent iterator if taking 0.
	      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
	      var skipped = 0;
	      var iterations = 0;
	      return new Iterator(function()  {
	        while (skipped++ < resolvedBegin) {
	          iterator.next();
	        }
	        if (++iterations > sliceSize) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (useKeys || type === ITERATE_VALUES) {
	          return step;
	        } else if (type === ITERATE_KEYS) {
	          return iteratorValue(type, iterations - 1, undefined, step);
	        } else {
	          return iteratorValue(type, iterations - 1, step.value[1], step);
	        }
	      });
	    }

	    return sliceSeq;
	  }


	  function takeWhileFactory(iterable, predicate, context) {
	    var takeSequence = makeSequence(iterable);
	    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c) 
	        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
	      );
	      return iterations;
	    };
	    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterating = true;
	      return new Iterator(function()  {
	        if (!iterating) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var k = entry[0];
	        var v = entry[1];
	        if (!predicate.call(context, v, k, this$0)) {
	          iterating = false;
	          return iteratorDone();
	        }
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return takeSequence;
	  }


	  function skipWhileFactory(iterable, predicate, context, useKeys) {
	    var skipSequence = makeSequence(iterable);
	    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      });
	      return iterations;
	    };
	    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var skipping = true;
	      var iterations = 0;
	      return new Iterator(function()  {
	        var step, k, v;
	        do {
	          step = iterator.next();
	          if (step.done) {
	            if (useKeys || type === ITERATE_VALUES) {
	              return step;
	            } else if (type === ITERATE_KEYS) {
	              return iteratorValue(type, iterations++, undefined, step);
	            } else {
	              return iteratorValue(type, iterations++, step.value[1], step);
	            }
	          }
	          var entry = step.value;
	          k = entry[0];
	          v = entry[1];
	          skipping && (skipping = predicate.call(context, v, k, this$0));
	        } while (skipping);
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return skipSequence;
	  }


	  function concatFactory(iterable, values) {
	    var isKeyedIterable = isKeyed(iterable);
	    var iters = [iterable].concat(values).map(function(v ) {
	      if (!isIterable(v)) {
	        v = isKeyedIterable ?
	          keyedSeqFromValue(v) :
	          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
	      } else if (isKeyedIterable) {
	        v = KeyedIterable(v);
	      }
	      return v;
	    }).filter(function(v ) {return v.size !== 0});

	    if (iters.length === 0) {
	      return iterable;
	    }

	    if (iters.length === 1) {
	      var singleton = iters[0];
	      if (singleton === iterable ||
	          isKeyedIterable && isKeyed(singleton) ||
	          isIndexed(iterable) && isIndexed(singleton)) {
	        return singleton;
	      }
	    }

	    var concatSeq = new ArraySeq(iters);
	    if (isKeyedIterable) {
	      concatSeq = concatSeq.toKeyedSeq();
	    } else if (!isIndexed(iterable)) {
	      concatSeq = concatSeq.toSetSeq();
	    }
	    concatSeq = concatSeq.flatten(true);
	    concatSeq.size = iters.reduce(
	      function(sum, seq)  {
	        if (sum !== undefined) {
	          var size = seq.size;
	          if (size !== undefined) {
	            return sum + size;
	          }
	        }
	      },
	      0
	    );
	    return concatSeq;
	  }


	  function flattenFactory(iterable, depth, useKeys) {
	    var flatSequence = makeSequence(iterable);
	    flatSequence.__iterateUncached = function(fn, reverse) {
	      var iterations = 0;
	      var stopped = false;
	      function flatDeep(iter, currentDepth) {var this$0 = this;
	        iter.__iterate(function(v, k)  {
	          if ((!depth || currentDepth < depth) && isIterable(v)) {
	            flatDeep(v, currentDepth + 1);
	          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
	            stopped = true;
	          }
	          return !stopped;
	        }, reverse);
	      }
	      flatDeep(iterable, 0);
	      return iterations;
	    }
	    flatSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(type, reverse);
	      var stack = [];
	      var iterations = 0;
	      return new Iterator(function()  {
	        while (iterator) {
	          var step = iterator.next();
	          if (step.done !== false) {
	            iterator = stack.pop();
	            continue;
	          }
	          var v = step.value;
	          if (type === ITERATE_ENTRIES) {
	            v = v[1];
	          }
	          if ((!depth || stack.length < depth) && isIterable(v)) {
	            stack.push(iterator);
	            iterator = v.__iterator(type, reverse);
	          } else {
	            return useKeys ? step : iteratorValue(type, iterations++, v, step);
	          }
	        }
	        return iteratorDone();
	      });
	    }
	    return flatSequence;
	  }


	  function flatMapFactory(iterable, mapper, context) {
	    var coerce = iterableClass(iterable);
	    return iterable.toSeq().map(
	      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
	    ).flatten(true);
	  }


	  function interposeFactory(iterable, separator) {
	    var interposedSequence = makeSequence(iterable);
	    interposedSequence.size = iterable.size && iterable.size * 2 -1;
	    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k) 
	        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
	        fn(v, iterations++, this$0) !== false},
	        reverse
	      );
	      return iterations;
	    };
	    interposedSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      var step;
	      return new Iterator(function()  {
	        if (!step || iterations % 2) {
	          step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	        }
	        return iterations % 2 ?
	          iteratorValue(type, iterations++, separator) :
	          iteratorValue(type, iterations++, step.value, step);
	      });
	    };
	    return interposedSequence;
	  }


	  function sortFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    var isKeyedIterable = isKeyed(iterable);
	    var index = 0;
	    var entries = iterable.toSeq().map(
	      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
	    ).toArray();
	    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
	      isKeyedIterable ?
	      function(v, i)  { entries[i].length = 2; } :
	      function(v, i)  { entries[i] = v[1]; }
	    );
	    return isKeyedIterable ? KeyedSeq(entries) :
	      isIndexed(iterable) ? IndexedSeq(entries) :
	      SetSeq(entries);
	  }


	  function maxFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    if (mapper) {
	      var entry = iterable.toSeq()
	        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
	        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
	      return entry && entry[0];
	    } else {
	      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
	    }
	  }

	  function maxCompare(comparator, a, b) {
	    var comp = comparator(b, a);
	    // b is considered the new max if the comparator declares them equal, but
	    // they are not equal and b is in fact a nullish value.
	    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
	  }


	  function zipWithFactory(keyIter, zipper, iters) {
	    var zipSequence = makeSequence(keyIter);
	    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
	    // Note: this a generic base implementation of __iterate in terms of
	    // __iterator which may be more generically useful in the future.
	    zipSequence.__iterate = function(fn, reverse) {
	      /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */
	      // indexed:
	      var iterator = this.__iterator(ITERATE_VALUES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        if (fn(step.value, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };
	    zipSequence.__iteratorUncached = function(type, reverse) {
	      var iterators = iters.map(function(i )
	        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
	      );
	      var iterations = 0;
	      var isDone = false;
	      return new Iterator(function()  {
	        var steps;
	        if (!isDone) {
	          steps = iterators.map(function(i ) {return i.next()});
	          isDone = steps.some(function(s ) {return s.done});
	        }
	        if (isDone) {
	          return iteratorDone();
	        }
	        return iteratorValue(
	          type,
	          iterations++,
	          zipper.apply(null, steps.map(function(s ) {return s.value}))
	        );
	      });
	    };
	    return zipSequence
	  }


	  // #pragma Helper Functions

	  function reify(iter, seq) {
	    return isSeq(iter) ? seq : iter.constructor(seq);
	  }

	  function validateEntry(entry) {
	    if (entry !== Object(entry)) {
	      throw new TypeError('Expected [K, V] tuple: ' + entry);
	    }
	  }

	  function resolveSize(iter) {
	    assertNotInfinite(iter.size);
	    return ensureSize(iter);
	  }

	  function iterableClass(iterable) {
	    return isKeyed(iterable) ? KeyedIterable :
	      isIndexed(iterable) ? IndexedIterable :
	      SetIterable;
	  }

	  function makeSequence(iterable) {
	    return Object.create(
	      (
	        isKeyed(iterable) ? KeyedSeq :
	        isIndexed(iterable) ? IndexedSeq :
	        SetSeq
	      ).prototype
	    );
	  }

	  function cacheResultThrough() {
	    if (this._iter.cacheResult) {
	      this._iter.cacheResult();
	      this.size = this._iter.size;
	      return this;
	    } else {
	      return Seq.prototype.cacheResult.call(this);
	    }
	  }

	  function defaultComparator(a, b) {
	    return a > b ? 1 : a < b ? -1 : 0;
	  }

	  function forceIterator(keyPath) {
	    var iter = getIterator(keyPath);
	    if (!iter) {
	      // Array might not be iterable in this environment, so we need a fallback
	      // to our wrapped type.
	      if (!isArrayLike(keyPath)) {
	        throw new TypeError('Expected iterable or array-like: ' + keyPath);
	      }
	      iter = getIterator(Iterable(keyPath));
	    }
	    return iter;
	  }

	  createClass(Record, KeyedCollection);

	    function Record(defaultValues, name) {
	      var hasInitialized;

	      var RecordType = function Record(values) {
	        if (values instanceof RecordType) {
	          return values;
	        }
	        if (!(this instanceof RecordType)) {
	          return new RecordType(values);
	        }
	        if (!hasInitialized) {
	          hasInitialized = true;
	          var keys = Object.keys(defaultValues);
	          setProps(RecordTypePrototype, keys);
	          RecordTypePrototype.size = keys.length;
	          RecordTypePrototype._name = name;
	          RecordTypePrototype._keys = keys;
	          RecordTypePrototype._defaultValues = defaultValues;
	        }
	        this._map = Map(values);
	      };

	      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
	      RecordTypePrototype.constructor = RecordType;

	      return RecordType;
	    }

	    Record.prototype.toString = function() {
	      return this.__toString(recordName(this) + ' {', '}');
	    };

	    // @pragma Access

	    Record.prototype.has = function(k) {
	      return this._defaultValues.hasOwnProperty(k);
	    };

	    Record.prototype.get = function(k, notSetValue) {
	      if (!this.has(k)) {
	        return notSetValue;
	      }
	      var defaultVal = this._defaultValues[k];
	      return this._map ? this._map.get(k, defaultVal) : defaultVal;
	    };

	    // @pragma Modification

	    Record.prototype.clear = function() {
	      if (this.__ownerID) {
	        this._map && this._map.clear();
	        return this;
	      }
	      var RecordType = this.constructor;
	      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
	    };

	    Record.prototype.set = function(k, v) {
	      if (!this.has(k)) {
	        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
	      }
	      var newMap = this._map && this._map.set(k, v);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };

	    Record.prototype.remove = function(k) {
	      if (!this.has(k)) {
	        return this;
	      }
	      var newMap = this._map && this._map.remove(k);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };

	    Record.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };

	    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
	    };

	    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
	    };

	    Record.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map && this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return makeRecord(this, newMap, ownerID);
	    };


	  var RecordPrototype = Record.prototype;
	  RecordPrototype[DELETE] = RecordPrototype.remove;
	  RecordPrototype.deleteIn =
	  RecordPrototype.removeIn = MapPrototype.removeIn;
	  RecordPrototype.merge = MapPrototype.merge;
	  RecordPrototype.mergeWith = MapPrototype.mergeWith;
	  RecordPrototype.mergeIn = MapPrototype.mergeIn;
	  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
	  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
	  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  RecordPrototype.setIn = MapPrototype.setIn;
	  RecordPrototype.update = MapPrototype.update;
	  RecordPrototype.updateIn = MapPrototype.updateIn;
	  RecordPrototype.withMutations = MapPrototype.withMutations;
	  RecordPrototype.asMutable = MapPrototype.asMutable;
	  RecordPrototype.asImmutable = MapPrototype.asImmutable;


	  function makeRecord(likeRecord, map, ownerID) {
	    var record = Object.create(Object.getPrototypeOf(likeRecord));
	    record._map = map;
	    record.__ownerID = ownerID;
	    return record;
	  }

	  function recordName(record) {
	    return record._name || record.constructor.name || 'Record';
	  }

	  function setProps(prototype, names) {
	    try {
	      names.forEach(setProp.bind(undefined, prototype));
	    } catch (error) {
	      // Object.defineProperty failed. Probably IE8.
	    }
	  }

	  function setProp(prototype, name) {
	    Object.defineProperty(prototype, name, {
	      get: function() {
	        return this.get(name);
	      },
	      set: function(value) {
	        invariant(this.__ownerID, 'Cannot set on an immutable record.');
	        this.set(name, value);
	      }
	    });
	  }

	  createClass(Set, SetCollection);

	    // @pragma Construction

	    function Set(value) {
	      return value === null || value === undefined ? emptySet() :
	        isSet(value) && !isOrdered(value) ? value :
	        emptySet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }

	    Set.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    Set.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };

	    Set.prototype.toString = function() {
	      return this.__toString('Set {', '}');
	    };

	    // @pragma Access

	    Set.prototype.has = function(value) {
	      return this._map.has(value);
	    };

	    // @pragma Modification

	    Set.prototype.add = function(value) {
	      return updateSet(this, this._map.set(value, true));
	    };

	    Set.prototype.remove = function(value) {
	      return updateSet(this, this._map.remove(value));
	    };

	    Set.prototype.clear = function() {
	      return updateSet(this, this._map.clear());
	    };

	    // @pragma Composition

	    Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
	      iters = iters.filter(function(x ) {return x.size !== 0});
	      if (iters.length === 0) {
	        return this;
	      }
	      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
	        return this.constructor(iters[0]);
	      }
	      return this.withMutations(function(set ) {
	        for (var ii = 0; ii < iters.length; ii++) {
	          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
	        }
	      });
	    };

	    Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (!iters.every(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };

	    Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (iters.some(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };

	    Set.prototype.merge = function() {
	      return this.union.apply(this, arguments);
	    };

	    Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return this.union.apply(this, iters);
	    };

	    Set.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator));
	    };

	    Set.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator, mapper));
	    };

	    Set.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };

	    Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
	    };

	    Set.prototype.__iterator = function(type, reverse) {
	      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
	    };

	    Set.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return this.__make(newMap, ownerID);
	    };


	  function isSet(maybeSet) {
	    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
	  }

	  Set.isSet = isSet;

	  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

	  var SetPrototype = Set.prototype;
	  SetPrototype[IS_SET_SENTINEL] = true;
	  SetPrototype[DELETE] = SetPrototype.remove;
	  SetPrototype.mergeDeep = SetPrototype.merge;
	  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
	  SetPrototype.withMutations = MapPrototype.withMutations;
	  SetPrototype.asMutable = MapPrototype.asMutable;
	  SetPrototype.asImmutable = MapPrototype.asImmutable;

	  SetPrototype.__empty = emptySet;
	  SetPrototype.__make = makeSet;

	  function updateSet(set, newMap) {
	    if (set.__ownerID) {
	      set.size = newMap.size;
	      set._map = newMap;
	      return set;
	    }
	    return newMap === set._map ? set :
	      newMap.size === 0 ? set.__empty() :
	      set.__make(newMap);
	  }

	  function makeSet(map, ownerID) {
	    var set = Object.create(SetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }

	  var EMPTY_SET;
	  function emptySet() {
	    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
	  }

	  createClass(OrderedSet, Set);

	    // @pragma Construction

	    function OrderedSet(value) {
	      return value === null || value === undefined ? emptyOrderedSet() :
	        isOrderedSet(value) ? value :
	        emptyOrderedSet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }

	    OrderedSet.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    OrderedSet.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };

	    OrderedSet.prototype.toString = function() {
	      return this.__toString('OrderedSet {', '}');
	    };


	  function isOrderedSet(maybeOrderedSet) {
	    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
	  }

	  OrderedSet.isOrderedSet = isOrderedSet;

	  var OrderedSetPrototype = OrderedSet.prototype;
	  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

	  OrderedSetPrototype.__empty = emptyOrderedSet;
	  OrderedSetPrototype.__make = makeOrderedSet;

	  function makeOrderedSet(map, ownerID) {
	    var set = Object.create(OrderedSetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }

	  var EMPTY_ORDERED_SET;
	  function emptyOrderedSet() {
	    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
	  }

	  createClass(Stack, IndexedCollection);

	    // @pragma Construction

	    function Stack(value) {
	      return value === null || value === undefined ? emptyStack() :
	        isStack(value) ? value :
	        emptyStack().unshiftAll(value);
	    }

	    Stack.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    Stack.prototype.toString = function() {
	      return this.__toString('Stack [', ']');
	    };

	    // @pragma Access

	    Stack.prototype.get = function(index, notSetValue) {
	      var head = this._head;
	      index = wrapIndex(this, index);
	      while (head && index--) {
	        head = head.next;
	      }
	      return head ? head.value : notSetValue;
	    };

	    Stack.prototype.peek = function() {
	      return this._head && this._head.value;
	    };

	    // @pragma Modification

	    Stack.prototype.push = function(/*...values*/) {
	      if (arguments.length === 0) {
	        return this;
	      }
	      var newSize = this.size + arguments.length;
	      var head = this._head;
	      for (var ii = arguments.length - 1; ii >= 0; ii--) {
	        head = {
	          value: arguments[ii],
	          next: head
	        };
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    Stack.prototype.pushAll = function(iter) {
	      iter = IndexedIterable(iter);
	      if (iter.size === 0) {
	        return this;
	      }
	      assertNotInfinite(iter.size);
	      var newSize = this.size;
	      var head = this._head;
	      iter.reverse().forEach(function(value ) {
	        newSize++;
	        head = {
	          value: value,
	          next: head
	        };
	      });
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    Stack.prototype.pop = function() {
	      return this.slice(1);
	    };

	    Stack.prototype.unshift = function(/*...values*/) {
	      return this.push.apply(this, arguments);
	    };

	    Stack.prototype.unshiftAll = function(iter) {
	      return this.pushAll(iter);
	    };

	    Stack.prototype.shift = function() {
	      return this.pop.apply(this, arguments);
	    };

	    Stack.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._head = undefined;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyStack();
	    };

	    Stack.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      var resolvedBegin = resolveBegin(begin, this.size);
	      var resolvedEnd = resolveEnd(end, this.size);
	      if (resolvedEnd !== this.size) {
	        // super.slice(begin, end);
	        return IndexedCollection.prototype.slice.call(this, begin, end);
	      }
	      var newSize = this.size - resolvedBegin;
	      var head = this._head;
	      while (resolvedBegin--) {
	        head = head.next;
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    // @pragma Mutability

	    Stack.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeStack(this.size, this._head, ownerID, this.__hash);
	    };

	    // @pragma Iteration

	    Stack.prototype.__iterate = function(fn, reverse) {
	      if (reverse) {
	        return this.reverse().__iterate(fn);
	      }
	      var iterations = 0;
	      var node = this._head;
	      while (node) {
	        if (fn(node.value, iterations++, this) === false) {
	          break;
	        }
	        node = node.next;
	      }
	      return iterations;
	    };

	    Stack.prototype.__iterator = function(type, reverse) {
	      if (reverse) {
	        return this.reverse().__iterator(type);
	      }
	      var iterations = 0;
	      var node = this._head;
	      return new Iterator(function()  {
	        if (node) {
	          var value = node.value;
	          node = node.next;
	          return iteratorValue(type, iterations++, value);
	        }
	        return iteratorDone();
	      });
	    };


	  function isStack(maybeStack) {
	    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
	  }

	  Stack.isStack = isStack;

	  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

	  var StackPrototype = Stack.prototype;
	  StackPrototype[IS_STACK_SENTINEL] = true;
	  StackPrototype.withMutations = MapPrototype.withMutations;
	  StackPrototype.asMutable = MapPrototype.asMutable;
	  StackPrototype.asImmutable = MapPrototype.asImmutable;
	  StackPrototype.wasAltered = MapPrototype.wasAltered;


	  function makeStack(size, head, ownerID, hash) {
	    var map = Object.create(StackPrototype);
	    map.size = size;
	    map._head = head;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }

	  var EMPTY_STACK;
	  function emptyStack() {
	    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
	  }

	  /**
	   * Contributes additional methods to a constructor
	   */
	  function mixin(ctor, methods) {
	    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
	    Object.keys(methods).forEach(keyCopier);
	    Object.getOwnPropertySymbols &&
	      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
	    return ctor;
	  }

	  Iterable.Iterator = Iterator;

	  mixin(Iterable, {

	    // ### Conversion to other types

	    toArray: function() {
	      assertNotInfinite(this.size);
	      var array = new Array(this.size || 0);
	      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
	      return array;
	    },

	    toIndexedSeq: function() {
	      return new ToIndexedSequence(this);
	    },

	    toJS: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
	      ).__toJS();
	    },

	    toJSON: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
	      ).__toJS();
	    },

	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, true);
	    },

	    toMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Map(this.toKeyedSeq());
	    },

	    toObject: function() {
	      assertNotInfinite(this.size);
	      var object = {};
	      this.__iterate(function(v, k)  { object[k] = v; });
	      return object;
	    },

	    toOrderedMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedMap(this.toKeyedSeq());
	    },

	    toOrderedSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Set(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toSetSeq: function() {
	      return new ToSetSequence(this);
	    },

	    toSeq: function() {
	      return isIndexed(this) ? this.toIndexedSeq() :
	        isKeyed(this) ? this.toKeyedSeq() :
	        this.toSetSeq();
	    },

	    toStack: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Stack(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toList: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return List(isKeyed(this) ? this.valueSeq() : this);
	    },


	    // ### Common JavaScript methods and properties

	    toString: function() {
	      return '[Iterable]';
	    },

	    __toString: function(head, tail) {
	      if (this.size === 0) {
	        return head + tail;
	      }
	      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
	    },


	    // ### ES6 Collection methods (ES6 Array and Map)

	    concat: function() {var values = SLICE$0.call(arguments, 0);
	      return reify(this, concatFactory(this, values));
	    },

	    includes: function(searchValue) {
	      return this.some(function(value ) {return is(value, searchValue)});
	    },

	    entries: function() {
	      return this.__iterator(ITERATE_ENTRIES);
	    },

	    every: function(predicate, context) {
	      assertNotInfinite(this.size);
	      var returnValue = true;
	      this.__iterate(function(v, k, c)  {
	        if (!predicate.call(context, v, k, c)) {
	          returnValue = false;
	          return false;
	        }
	      });
	      return returnValue;
	    },

	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, true));
	    },

	    find: function(predicate, context, notSetValue) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[1] : notSetValue;
	    },

	    findEntry: function(predicate, context) {
	      var found;
	      this.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          found = [k, v];
	          return false;
	        }
	      });
	      return found;
	    },

	    findLastEntry: function(predicate, context) {
	      return this.toSeq().reverse().findEntry(predicate, context);
	    },

	    forEach: function(sideEffect, context) {
	      assertNotInfinite(this.size);
	      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
	    },

	    join: function(separator) {
	      assertNotInfinite(this.size);
	      separator = separator !== undefined ? '' + separator : ',';
	      var joined = '';
	      var isFirst = true;
	      this.__iterate(function(v ) {
	        isFirst ? (isFirst = false) : (joined += separator);
	        joined += v !== null && v !== undefined ? v.toString() : '';
	      });
	      return joined;
	    },

	    keys: function() {
	      return this.__iterator(ITERATE_KEYS);
	    },

	    map: function(mapper, context) {
	      return reify(this, mapFactory(this, mapper, context));
	    },

	    reduce: function(reducer, initialReduction, context) {
	      assertNotInfinite(this.size);
	      var reduction;
	      var useFirst;
	      if (arguments.length < 2) {
	        useFirst = true;
	      } else {
	        reduction = initialReduction;
	      }
	      this.__iterate(function(v, k, c)  {
	        if (useFirst) {
	          useFirst = false;
	          reduction = v;
	        } else {
	          reduction = reducer.call(context, reduction, v, k, c);
	        }
	      });
	      return reduction;
	    },

	    reduceRight: function(reducer, initialReduction, context) {
	      var reversed = this.toKeyedSeq().reverse();
	      return reversed.reduce.apply(reversed, arguments);
	    },

	    reverse: function() {
	      return reify(this, reverseFactory(this, true));
	    },

	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, true));
	    },

	    some: function(predicate, context) {
	      return !this.every(not(predicate), context);
	    },

	    sort: function(comparator) {
	      return reify(this, sortFactory(this, comparator));
	    },

	    values: function() {
	      return this.__iterator(ITERATE_VALUES);
	    },


	    // ### More sequential methods

	    butLast: function() {
	      return this.slice(0, -1);
	    },

	    isEmpty: function() {
	      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
	    },

	    count: function(predicate, context) {
	      return ensureSize(
	        predicate ? this.toSeq().filter(predicate, context) : this
	      );
	    },

	    countBy: function(grouper, context) {
	      return countByFactory(this, grouper, context);
	    },

	    equals: function(other) {
	      return deepEqual(this, other);
	    },

	    entrySeq: function() {
	      var iterable = this;
	      if (iterable._cache) {
	        // We cache as an entries array, so we can just return the cache!
	        return new ArraySeq(iterable._cache);
	      }
	      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
	      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
	      return entriesSequence;
	    },

	    filterNot: function(predicate, context) {
	      return this.filter(not(predicate), context);
	    },

	    findLast: function(predicate, context, notSetValue) {
	      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
	    },

	    first: function() {
	      return this.find(returnTrue);
	    },

	    flatMap: function(mapper, context) {
	      return reify(this, flatMapFactory(this, mapper, context));
	    },

	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, true));
	    },

	    fromEntrySeq: function() {
	      return new FromEntriesSequence(this);
	    },

	    get: function(searchKey, notSetValue) {
	      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
	    },

	    getIn: function(searchKeyPath, notSetValue) {
	      var nested = this;
	      // Note: in an ES6 environment, we would prefer:
	      // for (var key of searchKeyPath) {
	      var iter = forceIterator(searchKeyPath);
	      var step;
	      while (!(step = iter.next()).done) {
	        var key = step.value;
	        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
	        if (nested === NOT_SET) {
	          return notSetValue;
	        }
	      }
	      return nested;
	    },

	    groupBy: function(grouper, context) {
	      return groupByFactory(this, grouper, context);
	    },

	    has: function(searchKey) {
	      return this.get(searchKey, NOT_SET) !== NOT_SET;
	    },

	    hasIn: function(searchKeyPath) {
	      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
	    },

	    isSubset: function(iter) {
	      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
	      return this.every(function(value ) {return iter.includes(value)});
	    },

	    isSuperset: function(iter) {
	      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
	      return iter.isSubset(this);
	    },

	    keySeq: function() {
	      return this.toSeq().map(keyMapper).toIndexedSeq();
	    },

	    last: function() {
	      return this.toSeq().reverse().first();
	    },

	    max: function(comparator) {
	      return maxFactory(this, comparator);
	    },

	    maxBy: function(mapper, comparator) {
	      return maxFactory(this, comparator, mapper);
	    },

	    min: function(comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
	    },

	    minBy: function(mapper, comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
	    },

	    rest: function() {
	      return this.slice(1);
	    },

	    skip: function(amount) {
	      return this.slice(Math.max(0, amount));
	    },

	    skipLast: function(amount) {
	      return reify(this, this.toSeq().reverse().skip(amount).reverse());
	    },

	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, true));
	    },

	    skipUntil: function(predicate, context) {
	      return this.skipWhile(not(predicate), context);
	    },

	    sortBy: function(mapper, comparator) {
	      return reify(this, sortFactory(this, comparator, mapper));
	    },

	    take: function(amount) {
	      return this.slice(0, Math.max(0, amount));
	    },

	    takeLast: function(amount) {
	      return reify(this, this.toSeq().reverse().take(amount).reverse());
	    },

	    takeWhile: function(predicate, context) {
	      return reify(this, takeWhileFactory(this, predicate, context));
	    },

	    takeUntil: function(predicate, context) {
	      return this.takeWhile(not(predicate), context);
	    },

	    valueSeq: function() {
	      return this.toIndexedSeq();
	    },


	    // ### Hashable Object

	    hashCode: function() {
	      return this.__hash || (this.__hash = hashIterable(this));
	    }


	    // ### Internal

	    // abstract __iterate(fn, reverse)

	    // abstract __iterator(type, reverse)
	  });

	  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

	  var IterablePrototype = Iterable.prototype;
	  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
	  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
	  IterablePrototype.__toJS = IterablePrototype.toArray;
	  IterablePrototype.__toStringMapper = quoteString;
	  IterablePrototype.inspect =
	  IterablePrototype.toSource = function() { return this.toString(); };
	  IterablePrototype.chain = IterablePrototype.flatMap;
	  IterablePrototype.contains = IterablePrototype.includes;

	  // Temporary warning about using length
	  (function () {
	    try {
	      Object.defineProperty(IterablePrototype, 'length', {
	        get: function () {
	          if (!Iterable.noLengthWarning) {
	            var stack;
	            try {
	              throw new Error();
	            } catch (error) {
	              stack = error.stack;
	            }
	            if (stack.indexOf('_wrapObject') === -1) {
	              console && console.warn && console.warn(
	                'iterable.length has been deprecated, '+
	                'use iterable.size or iterable.count(). '+
	                'This warning will become a silent error in a future version. ' +
	                stack
	              );
	              return this.size;
	            }
	          }
	        }
	      });
	    } catch (e) {}
	  })();



	  mixin(KeyedIterable, {

	    // ### More sequential methods

	    flip: function() {
	      return reify(this, flipFactory(this));
	    },

	    findKey: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry && entry[0];
	    },

	    findLastKey: function(predicate, context) {
	      return this.toSeq().reverse().findKey(predicate, context);
	    },

	    keyOf: function(searchValue) {
	      return this.findKey(function(value ) {return is(value, searchValue)});
	    },

	    lastKeyOf: function(searchValue) {
	      return this.findLastKey(function(value ) {return is(value, searchValue)});
	    },

	    mapEntries: function(mapper, context) {var this$0 = this;
	      var iterations = 0;
	      return reify(this,
	        this.toSeq().map(
	          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
	        ).fromEntrySeq()
	      );
	    },

	    mapKeys: function(mapper, context) {var this$0 = this;
	      return reify(this,
	        this.toSeq().flip().map(
	          function(k, v)  {return mapper.call(context, k, v, this$0)}
	        ).flip()
	      );
	    }

	  });

	  var KeyedIterablePrototype = KeyedIterable.prototype;
	  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
	  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
	  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
	  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};



	  mixin(IndexedIterable, {

	    // ### Conversion to other types

	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, false);
	    },


	    // ### ES6 Collection methods (ES6 Array and Map)

	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, false));
	    },

	    findIndex: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[0] : -1;
	    },

	    indexOf: function(searchValue) {
	      var key = this.toKeyedSeq().keyOf(searchValue);
	      return key === undefined ? -1 : key;
	    },

	    lastIndexOf: function(searchValue) {
	      var key = this.toKeyedSeq().reverse().keyOf(searchValue);
	      return key === undefined ? -1 : key;

	      // var index =
	      // return this.toSeq().reverse().indexOf(searchValue);
	    },

	    reverse: function() {
	      return reify(this, reverseFactory(this, false));
	    },

	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, false));
	    },

	    splice: function(index, removeNum /*, ...values*/) {
	      var numArgs = arguments.length;
	      removeNum = Math.max(removeNum | 0, 0);
	      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
	        return this;
	      }
	      // If index is negative, it should resolve relative to the size of the
	      // collection. However size may be expensive to compute if not cached, so
	      // only call count() if the number is in fact negative.
	      index = resolveBegin(index, index < 0 ? this.count() : this.size);
	      var spliced = this.slice(0, index);
	      return reify(
	        this,
	        numArgs === 1 ?
	          spliced :
	          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
	      );
	    },


	    // ### More collection methods

	    findLastIndex: function(predicate, context) {
	      var key = this.toKeyedSeq().findLastKey(predicate, context);
	      return key === undefined ? -1 : key;
	    },

	    first: function() {
	      return this.get(0);
	    },

	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, false));
	    },

	    get: function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      return (index < 0 || (this.size === Infinity ||
	          (this.size !== undefined && index > this.size))) ?
	        notSetValue :
	        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
	    },

	    has: function(index) {
	      index = wrapIndex(this, index);
	      return index >= 0 && (this.size !== undefined ?
	        this.size === Infinity || index < this.size :
	        this.indexOf(index) !== -1
	      );
	    },

	    interpose: function(separator) {
	      return reify(this, interposeFactory(this, separator));
	    },

	    interleave: function(/*...iterables*/) {
	      var iterables = [this].concat(arrCopy(arguments));
	      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
	      var interleaved = zipped.flatten(true);
	      if (zipped.size) {
	        interleaved.size = zipped.size * iterables.length;
	      }
	      return reify(this, interleaved);
	    },

	    last: function() {
	      return this.get(-1);
	    },

	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, false));
	    },

	    zip: function(/*, ...iterables */) {
	      var iterables = [this].concat(arrCopy(arguments));
	      return reify(this, zipWithFactory(this, defaultZipper, iterables));
	    },

	    zipWith: function(zipper/*, ...iterables */) {
	      var iterables = arrCopy(arguments);
	      iterables[0] = this;
	      return reify(this, zipWithFactory(this, zipper, iterables));
	    }

	  });

	  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
	  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



	  mixin(SetIterable, {

	    // ### ES6 Collection methods (ES6 Array and Map)

	    get: function(value, notSetValue) {
	      return this.has(value) ? value : notSetValue;
	    },

	    includes: function(value) {
	      return this.has(value);
	    },


	    // ### More sequential methods

	    keySeq: function() {
	      return this.valueSeq();
	    }

	  });

	  SetIterable.prototype.has = IterablePrototype.includes;


	  // Mixin subclasses

	  mixin(KeyedSeq, KeyedIterable.prototype);
	  mixin(IndexedSeq, IndexedIterable.prototype);
	  mixin(SetSeq, SetIterable.prototype);

	  mixin(KeyedCollection, KeyedIterable.prototype);
	  mixin(IndexedCollection, IndexedIterable.prototype);
	  mixin(SetCollection, SetIterable.prototype);


	  // #pragma Helper functions

	  function keyMapper(v, k) {
	    return k;
	  }

	  function entryMapper(v, k) {
	    return [k, v];
	  }

	  function not(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    }
	  }

	  function neg(predicate) {
	    return function() {
	      return -predicate.apply(this, arguments);
	    }
	  }

	  function quoteString(value) {
	    return typeof value === 'string' ? JSON.stringify(value) : value;
	  }

	  function defaultZipper() {
	    return arrCopy(arguments);
	  }

	  function defaultNegComparator(a, b) {
	    return a < b ? 1 : a > b ? -1 : 0;
	  }

	  function hashIterable(iterable) {
	    if (iterable.size === Infinity) {
	      return 0;
	    }
	    var ordered = isOrdered(iterable);
	    var keyed = isKeyed(iterable);
	    var h = ordered ? 1 : 0;
	    var size = iterable.__iterate(
	      keyed ?
	        ordered ?
	          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
	          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
	        ordered ?
	          function(v ) { h = 31 * h + hash(v) | 0; } :
	          function(v ) { h = h + hash(v) | 0; }
	    );
	    return murmurHashOfSize(size, h);
	  }

	  function murmurHashOfSize(size, h) {
	    h = imul(h, 0xCC9E2D51);
	    h = imul(h << 15 | h >>> -15, 0x1B873593);
	    h = imul(h << 13 | h >>> -13, 5);
	    h = (h + 0xE6546B64 | 0) ^ size;
	    h = imul(h ^ h >>> 16, 0x85EBCA6B);
	    h = imul(h ^ h >>> 13, 0xC2B2AE35);
	    h = smi(h ^ h >>> 16);
	    return h;
	  }

	  function hashMerge(a, b) {
	    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
	  }

	  var Immutable = {

	    Iterable: Iterable,

	    Seq: Seq,
	    Collection: Collection,
	    Map: Map,
	    OrderedMap: OrderedMap,
	    List: List,
	    Stack: Stack,
	    Set: Set,
	    OrderedSet: OrderedSet,

	    Record: Record,
	    Range: Range,
	    Repeat: Repeat,

	    is: is,
	    fromJS: fromJS

	  };

	  return Immutable;

	}));

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = _;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _underscore = __webpack_require__(4);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _reactImmutableRenderMixin = __webpack_require__(6);

	var _reactVirtualized = __webpack_require__(11);

	var _reactDimensions = __webpack_require__(43);

	var _reactDimensions2 = _interopRequireDefault(_reactDimensions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Set = __webpack_require__(44);

	// For more info about this read ReadMe.md
	function getDefaultProps() {
		return {
			data: null,
			indexedData: null, // Just when you use a function as a display field. (array) (Full indexed data not filted)
			onSelectionChange: null,
			multiSelect: false,
			messages: null,
			selection: new Set(),
			allSelected: false,
			listRowHeight: 26,
			listHeight: 200,
			listWidth: null, // Container width by default
			idField: 'value',
			displayField: 'label',
			showIcon: true,
			listElementClass: null
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
							{ id: 'proper-search-list-bar-check', className: 'btn', role: 'button', onClick: this.handleSelectAll.bind(this, true) },
							_react2['default'].createElement(
								'label',
								null,
								this.props.messages.all
							)
						),
						' ',
						_react2['default'].createElement(
							'a',
							{ id: 'proper-search-list-bar-unCheck', className: 'btn', role: 'button', onClick: this.handleSelectAll.bind(this, false) },
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
	   */

		}, {
			key: 'getContent',
			value: function getContent() {
				var _this4 = this;

				var icon = null,
				    result = [],
				    selectedClass = null,
				    className = null,
				    element = null,
				    content = null;
				var data = this.props.data,
				    selection = this.props.selection,
				    field = this.props.idField;
				var displayField = this.props.displayField,
				    showIcon = this.props.showIcon;
				var listElementClass = this.props.listElementClass;

				data.forEach(function (item, index) {
					element = item.get(displayField);
					className = "proper-search-list-element";

					if (_this4.props.multiSelect) {
						if (showIcon) {
							if (item.get('_selected', false)) {
								icon = _react2['default'].createElement('i', { className: 'fa fa-check-square-o' });
								selectedClass = ' proper-search-selected';
							} else {
								icon = _react2['default'].createElement('i', { className: 'fa fa-square-o' });
								selectedClass = null;
							}
						}
					} else {
						if (item.get('_selected')) selectedClass = ' proper-search-single-selected';else selectedClass = null;
					}

					if (listElementClass) {
						className += ' ' + listElementClass;
					}

					if (selectedClass) {
						className += ' ' + selectedClass;
					}

					if (typeof element == 'function') {
						var id = item.get(field);
						element = element(_this4.props.indexedData[id]);
					}

					content = _react2['default'].createElement(
						'div',
						{ key: 'element-' + index, className: className, onClick: _this4.handleElementClick.bind(_this4, item.get(field)) },
						icon,
						element
					);

					result.push(content);
				});

				return result;
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
					{ className: "proper-search-list search-list-no-data" },
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
			value: function rowRenderer(list, index) {
				return list[index];
			}
		}, {
			key: 'render',
			value: function render() {
				var toolbar = null,
				    rowsCount = 0,
				    list = this.getContent(),
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
						className: "proper-search-list-virtual",
						width: this.props.listWidth || this.props.containerWidth,
						height: this.props.listHeight,
						rowRenderer: this.rowRenderer.bind(this, list),
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
	exports['default'] = (0, _reactDimensions2['default'])()(SearchList);
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.shallowEqualImmutable = exports.shouldComponentUpdate = exports.immutableRenderDecorator = exports.default = undefined;

	var _shouldComponentUpdate = __webpack_require__(7);

	var _shouldComponentUpdate2 = _interopRequireDefault(_shouldComponentUpdate);

	var _shallowEqualImmutable = __webpack_require__(8);

	var _shallowEqualImmutable2 = _interopRequireDefault(_shallowEqualImmutable);

	var _immutableRenderMixin = __webpack_require__(9);

	var _immutableRenderMixin2 = _interopRequireDefault(_immutableRenderMixin);

	var _immutableRenderDecorator = __webpack_require__(10);

	var _immutableRenderDecorator2 = _interopRequireDefault(_immutableRenderDecorator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _immutableRenderMixin2.default;
	exports.immutableRenderDecorator = _immutableRenderDecorator2.default;
	exports.shouldComponentUpdate = _shouldComponentUpdate2.default;
	exports.shallowEqualImmutable = _shallowEqualImmutable2.default;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = shouldComponentUpdate;

	var _shallowEqualImmutable = __webpack_require__(8);

	var _shallowEqualImmutable2 = _interopRequireDefault(_shallowEqualImmutable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function shouldComponentUpdate(nextProps, nextState) {
	  return !(0, _shallowEqualImmutable2.default)(this.props, nextProps) || !(0, _shallowEqualImmutable2.default)(this.state, nextState);
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = shallowEqualImmutable;

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var is = _immutable2.default.is.bind(_immutable2.default);

	function shallowEqualImmutable(objA, objB) {
	  if (objA === objB || is(objA, objB)) {
	    return true;
	  }

	  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
	  for (var i = 0; i < keysA.length; i++) {
	    if (!bHasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
	      return false;
	    }
	  }

	  return true;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _shouldComponentUpdate = __webpack_require__(7);

	var _shouldComponentUpdate2 = _interopRequireDefault(_shouldComponentUpdate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  shouldComponentUpdate: _shouldComponentUpdate2.default
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = immutableRenderDecorator;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _shouldComponentUpdate = __webpack_require__(7);

	var _shouldComponentUpdate2 = _interopRequireDefault(_shouldComponentUpdate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Makes the given component "pure".
	 *
	 * @param object Target Component.
	 */
	function immutableRenderDecorator(Target) {
	  var Wrapper = function (_Component) {
	    _inherits(Wrapper, _Component);

	    function Wrapper() {
	      _classCallCheck(this, Wrapper);

	      return _possibleConstructorReturn(this, Object.getPrototypeOf(Wrapper).apply(this, arguments));
	    }

	    _createClass(Wrapper, [{
	      key: 'render',
	      value: function render() {
	        return _react2.default.createElement(Target, this.props, this.props.children);
	      }
	    }]);

	    return Wrapper;
	  }(_react.Component);

	  Wrapper.prototype.shouldComponentUpdate = _shouldComponentUpdate2.default;

	  return Wrapper;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ArrowKeyStepper = __webpack_require__(12);

	Object.defineProperty(exports, 'ArrowKeyStepper', {
	  enumerable: true,
	  get: function get() {
	    return _ArrowKeyStepper.ArrowKeyStepper;
	  }
	});

	var _AutoSizer = __webpack_require__(17);

	Object.defineProperty(exports, 'AutoSizer', {
	  enumerable: true,
	  get: function get() {
	    return _AutoSizer.AutoSizer;
	  }
	});

	var _ColumnSizer = __webpack_require__(20);

	Object.defineProperty(exports, 'ColumnSizer', {
	  enumerable: true,
	  get: function get() {
	    return _ColumnSizer.ColumnSizer;
	  }
	});

	var _FlexTable = __webpack_require__(31);

	Object.defineProperty(exports, 'FlexTable', {
	  enumerable: true,
	  get: function get() {
	    return _FlexTable.FlexTable;
	  }
	});
	Object.defineProperty(exports, 'FlexColumn', {
	  enumerable: true,
	  get: function get() {
	    return _FlexTable.FlexColumn;
	  }
	});
	Object.defineProperty(exports, 'SortDirection', {
	  enumerable: true,
	  get: function get() {
	    return _FlexTable.SortDirection;
	  }
	});
	Object.defineProperty(exports, 'SortIndicator', {
	  enumerable: true,
	  get: function get() {
	    return _FlexTable.SortIndicator;
	  }
	});

	var _Grid = __webpack_require__(22);

	Object.defineProperty(exports, 'Grid', {
	  enumerable: true,
	  get: function get() {
	    return _Grid.Grid;
	  }
	});

	var _InfiniteLoader = __webpack_require__(37);

	Object.defineProperty(exports, 'InfiniteLoader', {
	  enumerable: true,
	  get: function get() {
	    return _InfiniteLoader.InfiniteLoader;
	  }
	});

	var _ScrollSync = __webpack_require__(39);

	Object.defineProperty(exports, 'ScrollSync', {
	  enumerable: true,
	  get: function get() {
	    return _ScrollSync.ScrollSync;
	  }
	});

	var _VirtualScroll = __webpack_require__(41);

	Object.defineProperty(exports, 'VirtualScroll', {
	  enumerable: true,
	  get: function get() {
	    return _VirtualScroll.VirtualScroll;
	  }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ArrowKeyStepper = exports.default = undefined;

	var _ArrowKeyStepper2 = __webpack_require__(13);

	var _ArrowKeyStepper3 = _interopRequireDefault(_ArrowKeyStepper2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _ArrowKeyStepper3.default;
	exports.ArrowKeyStepper = _ArrowKeyStepper3.default;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
	 */

	var ArrowKeyStepper = function (_Component) {
	  _inherits(ArrowKeyStepper, _Component);

	  function ArrowKeyStepper(props, context) {
	    _classCallCheck(this, ArrowKeyStepper);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrowKeyStepper).call(this, props, context));

	    _this.state = {
	      scrollToColumn: 0,
	      scrollToRow: 0
	    };

	    _this._columnStartIndex = 0;
	    _this._columnStopIndex = 0;
	    _this._rowStartIndex = 0;
	    _this._rowStopIndex = 0;

	    _this._onKeyDown = _this._onKeyDown.bind(_this);
	    _this._onSectionRendered = _this._onSectionRendered.bind(_this);
	    return _this;
	  }

	  _createClass(ArrowKeyStepper, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var className = _props.className;
	      var children = _props.children;
	      var _state = this.state;
	      var scrollToColumn = _state.scrollToColumn;
	      var scrollToRow = _state.scrollToRow;


	      return _react2.default.createElement(
	        'div',
	        {
	          className: className,
	          onKeyDown: this._onKeyDown
	        },
	        children({
	          onSectionRendered: this._onSectionRendered,
	          scrollToColumn: scrollToColumn,
	          scrollToRow: scrollToRow
	        })
	      );
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }
	  }, {
	    key: '_onKeyDown',
	    value: function _onKeyDown(event) {
	      var _props2 = this.props;
	      var columnsCount = _props2.columnsCount;
	      var rowsCount = _props2.rowsCount;

	      // The above cases all prevent default event event behavior.
	      // This is to keep the grid from scrolling after the snap-to update.

	      switch (event.key) {
	        case 'ArrowDown':
	          event.preventDefault();
	          this.setState({
	            scrollToRow: Math.min(this._rowStopIndex + 1, rowsCount - 1)
	          });
	          break;
	        case 'ArrowLeft':
	          event.preventDefault();
	          this.setState({
	            scrollToColumn: Math.max(this._columnStartIndex - 1, 0)
	          });
	          break;
	        case 'ArrowRight':
	          event.preventDefault();
	          this.setState({
	            scrollToColumn: Math.min(this._columnStopIndex + 1, columnsCount - 1)
	          });
	          break;
	        case 'ArrowUp':
	          event.preventDefault();
	          this.setState({
	            scrollToRow: Math.max(this._rowStartIndex - 1, 0)
	          });
	          break;
	      }
	    }
	  }, {
	    key: '_onSectionRendered',
	    value: function _onSectionRendered(_ref) {
	      var columnStartIndex = _ref.columnStartIndex;
	      var columnStopIndex = _ref.columnStopIndex;
	      var rowStartIndex = _ref.rowStartIndex;
	      var rowStopIndex = _ref.rowStopIndex;

	      this._columnStartIndex = columnStartIndex;
	      this._columnStopIndex = columnStopIndex;
	      this._rowStartIndex = rowStartIndex;
	      this._rowStopIndex = rowStopIndex;
	    }
	  }]);

	  return ArrowKeyStepper;
	}(_react.Component);

	ArrowKeyStepper.propTypes = {
	  children: _react.PropTypes.func.isRequired,
	  className: _react.PropTypes.string,
	  columnsCount: _react.PropTypes.number.isRequired,
	  rowsCount: _react.PropTypes.number.isRequired
	};
	exports.default = ArrowKeyStepper;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	* @providesModule shallowCompare
	*/

	'use strict';

	var shallowEqual = __webpack_require__(16);

	/**
	 * Does a shallow comparison for props and state.
	 * See ReactComponentWithPureRenderMixin
	 */
	function shallowCompare(instance, nextProps, nextState) {
	  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
	}

	module.exports = shallowCompare;

/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule shallowEqual
	 * @typechecks
	 * 
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Performs equality by iterating through keys on an object and returning false
	 * when any key has values which are not strictly equal between the arguments.
	 * Returns true when the values of all keys are strictly equal.
	 */
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }

	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  var bHasOwnProperty = hasOwnProperty.bind(objB);
	  for (var i = 0; i < keysA.length; i++) {
	    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = shallowEqual;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AutoSizer = exports.default = undefined;

	var _AutoSizer2 = __webpack_require__(18);

	var _AutoSizer3 = _interopRequireDefault(_AutoSizer2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _AutoSizer3.default;
	exports.AutoSizer = _AutoSizer3.default;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Decorator component that automatically adjusts the width and height of a single child.
	 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
	 * All other properties will be passed through to the child component.
	 */

	var AutoSizer = function (_Component) {
	  _inherits(AutoSizer, _Component);

	  function AutoSizer(props) {
	    _classCallCheck(this, AutoSizer);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AutoSizer).call(this, props));

	    _this.state = {
	      height: 0,
	      width: 0
	    };

	    _this._onResize = _this._onResize.bind(_this);
	    _this._onScroll = _this._onScroll.bind(_this);
	    _this._setRef = _this._setRef.bind(_this);
	    return _this;
	  }

	  _createClass(AutoSizer, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      // Defer requiring resize handler in order to support server-side rendering.
	      // See issue #41
	      this._detectElementResize = __webpack_require__(19);
	      this._detectElementResize.addResizeListener(this._parentNode, this._onResize);

	      this._onResize();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var children = _props.children;
	      var disableHeight = _props.disableHeight;
	      var disableWidth = _props.disableWidth;
	      var _state = this.state;
	      var height = _state.height;
	      var width = _state.width;

	      // Outer div should not force width/height since that may prevent containers from shrinking.
	      // Inner component should overflow and use calculated width/height.
	      // See issue #68 for more information.

	      var outerStyle = { overflow: 'visible' };

	      if (!disableHeight) {
	        outerStyle.height = 0;
	      }

	      if (!disableWidth) {
	        outerStyle.width = 0;
	      }

	      return _react2.default.createElement(
	        'div',
	        {
	          ref: this._setRef,
	          onScroll: this._onScroll,
	          style: outerStyle
	        },
	        children({ height: height, width: width })
	      );
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }
	  }, {
	    key: '_onResize',
	    value: function _onResize() {
	      var onResize = this.props.onResize;

	      var _parentNode$getBoundi = this._parentNode.getBoundingClientRect();

	      var height = _parentNode$getBoundi.height;
	      var width = _parentNode$getBoundi.width;


	      var style = getComputedStyle(this._parentNode);
	      var paddingLeft = parseInt(style.paddingLeft, 10);
	      var paddingRight = parseInt(style.paddingRight, 10);
	      var paddingTop = parseInt(style.paddingTop, 10);
	      var paddingBottom = parseInt(style.paddingBottom, 10);

	      this.setState({
	        height: height - paddingTop - paddingBottom,
	        width: width - paddingLeft - paddingRight
	      });

	      onResize({ height: height, width: width });
	    }
	  }, {
	    key: '_onScroll',
	    value: function _onScroll(event) {
	      // Prevent detectElementResize library from being triggered by this scroll event.
	      event.stopPropagation();
	    }
	  }, {
	    key: '_setRef',
	    value: function _setRef(autoSizer) {
	      // In case the component has been unmounted
	      this._parentNode = autoSizer && autoSizer.parentNode;
	    }
	  }]);

	  return AutoSizer;
	}(_react.Component);

	AutoSizer.propTypes = {
	  /**
	   * Function respondible for rendering children.
	   * This function should implement the following signature:
	   * ({ height, width }) => PropTypes.element
	   */
	  children: _react.PropTypes.func.isRequired,

	  /** Disable dynamic :height property */
	  disableHeight: _react.PropTypes.bool,

	  /** Disable dynamic :width property */
	  disableWidth: _react.PropTypes.bool,

	  /** Callback to be invoked on-resize: ({ height, width }) */
	  onResize: _react.PropTypes.func.isRequired
	};
	AutoSizer.defaultProps = {
	  onResize: function onResize() {}
	};
	exports.default = AutoSizer;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	/**
	* Detect Element Resize.
	* Forked in order to guard against unsafe 'window' and 'document' references.
	*
	* https://github.com/sdecima/javascript-detect-element-resize
	* Sebastian Decima
	*
	* version: 0.5.3
	**/

	// Check `document` and `window` in case of server-side rendering
	var _window;
	if (typeof window !== 'undefined') {
	  _window = window;
	} else if (typeof self !== 'undefined') {
	  _window = self;
	} else {
	  _window = undefined;
	}

	var attachEvent = typeof document !== 'undefined' && document.attachEvent;
	var stylesCreated = false;

	if (!attachEvent) {
	  var requestFrame = function () {
	    var raf = _window.requestAnimationFrame || _window.mozRequestAnimationFrame || _window.webkitRequestAnimationFrame || function (fn) {
	      return _window.setTimeout(fn, 20);
	    };
	    return function (fn) {
	      return raf(fn);
	    };
	  }();

	  var cancelFrame = function () {
	    var cancel = _window.cancelAnimationFrame || _window.mozCancelAnimationFrame || _window.webkitCancelAnimationFrame || _window.clearTimeout;
	    return function (id) {
	      return cancel(id);
	    };
	  }();

	  var resetTriggers = function resetTriggers(element) {
	    var triggers = element.__resizeTriggers__,
	        expand = triggers.firstElementChild,
	        contract = triggers.lastElementChild,
	        expandChild = expand.firstElementChild;
	    contract.scrollLeft = contract.scrollWidth;
	    contract.scrollTop = contract.scrollHeight;
	    expandChild.style.width = expand.offsetWidth + 1 + 'px';
	    expandChild.style.height = expand.offsetHeight + 1 + 'px';
	    expand.scrollLeft = expand.scrollWidth;
	    expand.scrollTop = expand.scrollHeight;
	  };

	  var checkTriggers = function checkTriggers(element) {
	    return element.offsetWidth != element.__resizeLast__.width || element.offsetHeight != element.__resizeLast__.height;
	  };

	  var scrollListener = function scrollListener(e) {
	    var element = this;
	    resetTriggers(this);
	    if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
	    this.__resizeRAF__ = requestFrame(function () {
	      if (checkTriggers(element)) {
	        element.__resizeLast__.width = element.offsetWidth;
	        element.__resizeLast__.height = element.offsetHeight;
	        element.__resizeListeners__.forEach(function (fn) {
	          fn.call(element, e);
	        });
	      }
	    });
	  };

	  /* Detect CSS Animations support to detect element display/re-attach */
	  var animation = false,
	      animationstring = 'animation',
	      keyframeprefix = '',
	      animationstartevent = 'animationstart',
	      domPrefixes = 'Webkit Moz O ms'.split(' '),
	      startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
	      pfx = '';
	  {
	    var elm = document.createElement('fakeelement');
	    if (elm.style.animationName !== undefined) {
	      animation = true;
	    }

	    if (animation === false) {
	      for (var i = 0; i < domPrefixes.length; i++) {
	        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
	          pfx = domPrefixes[i];
	          animationstring = pfx + 'Animation';
	          keyframeprefix = '-' + pfx.toLowerCase() + '-';
	          animationstartevent = startEvents[i];
	          animation = true;
	          break;
	        }
	      }
	    }
	  }

	  var animationName = 'resizeanim';
	  var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
	  var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}

	var createStyles = function createStyles() {
	  if (!stylesCreated) {
	    //opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
	    var css = (animationKeyframes ? animationKeyframes : '') + '.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' + '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
	        head = document.head || document.getElementsByTagName('head')[0],
	        style = document.createElement('style');

	    style.type = 'text/css';
	    if (style.styleSheet) {
	      style.styleSheet.cssText = css;
	    } else {
	      style.appendChild(document.createTextNode(css));
	    }

	    head.appendChild(style);
	    stylesCreated = true;
	  }
	};

	var addResizeListener = function addResizeListener(element, fn) {
	  if (attachEvent) element.attachEvent('onresize', fn);else {
	    if (!element.__resizeTriggers__) {
	      if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
	      createStyles();
	      element.__resizeLast__ = {};
	      element.__resizeListeners__ = [];
	      (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
	      element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' + '<div class="contract-trigger"></div>';
	      element.appendChild(element.__resizeTriggers__);
	      resetTriggers(element);
	      element.addEventListener('scroll', scrollListener, true);

	      /* Listen for a css animation to detect element display/re-attach */
	      animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function (e) {
	        if (e.animationName == animationName) resetTriggers(element);
	      });
	    }
	    element.__resizeListeners__.push(fn);
	  }
	};

	var removeResizeListener = function removeResizeListener(element, fn) {
	  if (attachEvent) element.detachEvent('onresize', fn);else {
	    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
	    if (!element.__resizeListeners__.length) {
	      element.removeEventListener('scroll', scrollListener);
	      element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
	    }
	  }
	};

	module.exports = {
	  addResizeListener: addResizeListener,
	  removeResizeListener: removeResizeListener
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ColumnSizer = exports.default = undefined;

	var _ColumnSizer2 = __webpack_require__(21);

	var _ColumnSizer3 = _interopRequireDefault(_ColumnSizer2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _ColumnSizer3.default;
	exports.ColumnSizer = _ColumnSizer3.default;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	var _Grid = __webpack_require__(22);

	var _Grid2 = _interopRequireDefault(_Grid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * High-order component that auto-calculates column-widths for `Grid` cells.
	 */

	var ColumnSizer = function (_Component) {
	  _inherits(ColumnSizer, _Component);

	  function ColumnSizer(props, context) {
	    _classCallCheck(this, ColumnSizer);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ColumnSizer).call(this, props, context));

	    _this._registerChild = _this._registerChild.bind(_this);
	    return _this;
	  }

	  _createClass(ColumnSizer, [{
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      var _props = this.props;
	      var columnMaxWidth = _props.columnMaxWidth;
	      var columnMinWidth = _props.columnMinWidth;
	      var columnsCount = _props.columnsCount;
	      var width = _props.width;


	      if (columnMaxWidth !== prevProps.columnMaxWidth || columnMinWidth !== prevProps.columnMinWidth || columnsCount !== prevProps.columnsCount || width !== prevProps.width) {
	        if (this._registeredChild) {
	          this._registeredChild.recomputeGridSize();
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props;
	      var children = _props2.children;
	      var columnMaxWidth = _props2.columnMaxWidth;
	      var columnMinWidth = _props2.columnMinWidth;
	      var columnsCount = _props2.columnsCount;
	      var width = _props2.width;


	      var safeColumnMinWidth = columnMinWidth || 1;

	      var safeColumnMaxWidth = columnMaxWidth ? Math.min(columnMaxWidth, width) : width;

	      var columnWidth = width / columnsCount;
	      columnWidth = Math.max(safeColumnMinWidth, columnWidth);
	      columnWidth = Math.min(safeColumnMaxWidth, columnWidth);
	      columnWidth = Math.floor(columnWidth);

	      var adjustedWidth = Math.min(width, columnWidth * columnsCount);

	      return children({
	        adjustedWidth: adjustedWidth,
	        getColumnWidth: function getColumnWidth() {
	          return columnWidth;
	        },
	        registerChild: this._registerChild
	      });
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }
	  }, {
	    key: '_registerChild',
	    value: function _registerChild(child) {
	      if (child !== null && !(child instanceof _Grid2.default)) {
	        throw Error('Unexpected child type registered; only Grid children are supported.');
	      }

	      this._registeredChild = child;

	      if (this._registeredChild) {
	        this._registeredChild.recomputeGridSize();
	      }
	    }
	  }]);

	  return ColumnSizer;
	}(_react.Component);

	ColumnSizer.propTypes = {
	  /**
	   * Function respondible for rendering a virtualized Grid.
	   * This function should implement the following signature:
	   * ({ adjustedWidth, getColumnWidth, registerChild }) => PropTypes.element
	   *
	   * The specified :getColumnWidth function should be passed to the Grid's :columnWidth property.
	   * The :registerChild should be passed to the Grid's :ref property.
	   * The :adjustedWidth property is optional; it reflects the lesser of the overall width or the width of all columns.
	   */
	  children: _react.PropTypes.func.isRequired,

	  /** Optional maximum allowed column width */
	  columnMaxWidth: _react.PropTypes.number,

	  /** Optional minimum allowed column width */
	  columnMinWidth: _react.PropTypes.number,

	  /** Number of columns in Grid or FlexTable child */
	  columnsCount: _react.PropTypes.number.isRequired,

	  /** Width of Grid or FlexTable child */
	  width: _react.PropTypes.number.isRequired
	};
	exports.default = ColumnSizer;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Grid = exports.default = undefined;

	var _Grid2 = __webpack_require__(23);

	var _Grid3 = _interopRequireDefault(_Grid2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Grid3.default;
	exports.Grid = _Grid3.default;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _GridUtils = __webpack_require__(24);

	var _classnames = __webpack_require__(25);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _raf = __webpack_require__(26);

	var _raf2 = _interopRequireDefault(_raf);

	var _scrollbarSize = __webpack_require__(29);

	var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
	 * This improves performance and makes scrolling smoother.
	 */
	var IS_SCROLLING_TIMEOUT = 150;

	/**
	 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
	 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
	 */
	var SCROLL_POSITION_CHANGE_REASONS = {
	  OBSERVED: 'observed',
	  REQUESTED: 'requested'
	};

	/**
	 * Renders tabular data with virtualization along the vertical and horizontal axes.
	 * Row heights and column widths must be known ahead of time and specified as properties.
	 */

	var Grid = function (_Component) {
	  _inherits(Grid, _Component);

	  function Grid(props, context) {
	    _classCallCheck(this, Grid);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Grid).call(this, props, context));

	    _this.state = {
	      computeGridMetadataOnNextUpdate: false,
	      isScrolling: false,
	      scrollLeft: 0,
	      scrollTop: 0
	    };

	    // Invokes onSectionRendered callback only when start/stop row or column indices change
	    _this._onGridRenderedMemoizer = (0, _GridUtils.createCallbackMemoizer)();
	    _this._onScrollMemoizer = (0, _GridUtils.createCallbackMemoizer)(false);

	    // Bind functions to instance so they don't lose context when passed around
	    _this._computeColumnMetadata = _this._computeColumnMetadata.bind(_this);
	    _this._computeRowMetadata = _this._computeRowMetadata.bind(_this);
	    _this._invokeOnGridRenderedHelper = _this._invokeOnGridRenderedHelper.bind(_this);
	    _this._onScroll = _this._onScroll.bind(_this);
	    _this._updateScrollLeftForScrollToColumn = _this._updateScrollLeftForScrollToColumn.bind(_this);
	    _this._updateScrollTopForScrollToRow = _this._updateScrollTopForScrollToRow.bind(_this);
	    return _this;
	  }

	  /**
	   * Forced recompute of row heights and column widths.
	   * This function should be called if dynamic column or row sizes have changed but nothing else has.
	   * Since Grid only receives :columnsCount and :rowsCount it has no way of detecting when the underlying data changes.
	   */


	  _createClass(Grid, [{
	    key: 'recomputeGridSize',
	    value: function recomputeGridSize() {
	      this.setState({
	        computeGridMetadataOnNextUpdate: true
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _props = this.props;
	      var scrollLeft = _props.scrollLeft;
	      var scrollToColumn = _props.scrollToColumn;
	      var scrollTop = _props.scrollTop;
	      var scrollToRow = _props.scrollToRow;


	      this._scrollbarSize = (0, _scrollbarSize2.default)();

	      if (scrollLeft >= 0 || scrollTop >= 0) {
	        this._setScrollPosition({ scrollLeft: scrollLeft, scrollTop: scrollTop });
	      }

	      if (scrollToColumn >= 0 || scrollToRow >= 0) {
	        this._updateScrollLeftForScrollToColumn();
	        this._updateScrollTopForScrollToRow();
	      }

	      // Update onRowsRendered callback
	      this._invokeOnGridRenderedHelper();

	      // Initialize onScroll callback
	      this._invokeOnScrollMemoizer({
	        scrollLeft: scrollLeft || 0,
	        scrollTop: scrollTop || 0,
	        totalColumnsWidth: this._getTotalColumnsWidth(),
	        totalRowsHeight: this._getTotalRowsHeight()
	      });
	    }

	    /**
	     * @private
	     * This method updates scrollLeft/scrollTop in state for the following conditions:
	     * 1) New scroll-to-cell props have been set
	     */

	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      var _props2 = this.props;
	      var columnsCount = _props2.columnsCount;
	      var columnWidth = _props2.columnWidth;
	      var height = _props2.height;
	      var rowHeight = _props2.rowHeight;
	      var rowsCount = _props2.rowsCount;
	      var scrollToColumn = _props2.scrollToColumn;
	      var scrollToRow = _props2.scrollToRow;
	      var width = _props2.width;
	      var _state = this.state;
	      var scrollLeft = _state.scrollLeft;
	      var scrollPositionChangeReason = _state.scrollPositionChangeReason;
	      var scrollTop = _state.scrollTop;

	      // Make sure requested changes to :scrollLeft or :scrollTop get applied.
	      // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
	      // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
	      // So we only set these when we require an adjustment of the scroll position.
	      // See issue #2 for more information.

	      if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
	        if (scrollLeft >= 0 && scrollLeft !== prevState.scrollLeft && scrollLeft !== this.refs.scrollingContainer.scrollLeft) {
	          this.refs.scrollingContainer.scrollLeft = scrollLeft;
	        }
	        if (scrollTop >= 0 && scrollTop !== prevState.scrollTop && scrollTop !== this.refs.scrollingContainer.scrollTop) {
	          this.refs.scrollingContainer.scrollTop = scrollTop;
	        }
	      }

	      // Update scroll offsets if the current :scrollToColumn or :scrollToRow values requires it
	      (0, _GridUtils.updateScrollIndexHelper)({
	        cellsCount: columnsCount,
	        cellMetadata: this._columnMetadata,
	        cellSize: columnWidth,
	        previousCellsCount: prevProps.columnsCount,
	        previousCellSize: prevProps.columnWidth,
	        previousScrollToIndex: prevProps.scrollToColumn,
	        previousSize: prevProps.width,
	        scrollOffset: scrollLeft,
	        scrollToIndex: scrollToColumn,
	        size: width,
	        updateScrollIndexCallback: this._updateScrollLeftForScrollToColumn
	      });
	      (0, _GridUtils.updateScrollIndexHelper)({
	        cellsCount: rowsCount,
	        cellMetadata: this._rowMetadata,
	        cellSize: rowHeight,
	        previousCellsCount: prevProps.rowsCount,
	        previousCellSize: prevProps.rowHeight,
	        previousScrollToIndex: prevProps.scrollToRow,
	        previousSize: prevProps.height,
	        scrollOffset: scrollTop,
	        scrollToIndex: scrollToRow,
	        size: height,
	        updateScrollIndexCallback: this._updateScrollTopForScrollToRow
	      });

	      // Update onRowsRendered callback if start/stop indices have changed
	      this._invokeOnGridRenderedHelper();
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this._computeColumnMetadata(this.props);
	      this._computeRowMetadata(this.props);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      if (this._disablePointerEventsTimeoutId) {
	        clearTimeout(this._disablePointerEventsTimeoutId);
	      }

	      if (this._setNextStateAnimationFrameId) {
	        _raf2.default.cancel(this._setNextStateAnimationFrameId);
	      }
	    }

	    /**
	     * @private
	     * This method updates scrollLeft/scrollTop in state for the following conditions:
	     * 1) Empty content (0 rows or columns)
	     * 2) New scroll props overriding the current state
	     * 3) Cells-count or cells-size has changed, making previous scroll offsets invalid
	     */

	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      if (nextProps.columnsCount === 0 && nextState.scrollLeft !== 0 || nextProps.rowsCount === 0 && nextState.scrollTop !== 0) {
	        this._setScrollPosition({
	          scrollLeft: 0,
	          scrollTop: 0
	        });
	      } else if (nextProps.scrollLeft !== this.props.scrollLeft || nextProps.scrollTop !== this.props.scrollTop) {
	        this._setScrollPosition({
	          scrollLeft: nextProps.scrollLeft,
	          scrollTop: nextProps.scrollTop
	        });
	      }

	      // Update scroll offsets if the size or number of cells have changed, invalidating the previous value
	      (0, _GridUtils.computeCellMetadataAndUpdateScrollOffsetHelper)({
	        cellsCount: this.props.columnsCount,
	        cellSize: this.props.columnWidth,
	        computeMetadataCallback: this._computeColumnMetadata,
	        computeMetadataCallbackProps: nextProps,
	        computeMetadataOnNextUpdate: nextState.computeGridMetadataOnNextUpdate,
	        nextCellsCount: nextProps.columnsCount,
	        nextCellSize: nextProps.columnWidth,
	        nextScrollToIndex: nextProps.scrollToColumn,
	        scrollToIndex: this.props.scrollToColumn,
	        updateScrollOffsetForScrollToIndex: this._updateScrollLeftForScrollToColumn
	      });
	      (0, _GridUtils.computeCellMetadataAndUpdateScrollOffsetHelper)({
	        cellsCount: this.props.rowsCount,
	        cellSize: this.props.rowHeight,
	        computeMetadataCallback: this._computeRowMetadata,
	        computeMetadataCallbackProps: nextProps,
	        computeMetadataOnNextUpdate: nextState.computeGridMetadataOnNextUpdate,
	        nextCellsCount: nextProps.rowsCount,
	        nextCellSize: nextProps.rowHeight,
	        nextScrollToIndex: nextProps.scrollToRow,
	        scrollToIndex: this.props.scrollToRow,
	        updateScrollOffsetForScrollToIndex: this._updateScrollTopForScrollToRow
	      });

	      this.setState({
	        computeGridMetadataOnNextUpdate: false
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props3 = this.props;
	      var className = _props3.className;
	      var columnsCount = _props3.columnsCount;
	      var height = _props3.height;
	      var noContentRenderer = _props3.noContentRenderer;
	      var overscanColumnsCount = _props3.overscanColumnsCount;
	      var overscanRowsCount = _props3.overscanRowsCount;
	      var renderCell = _props3.renderCell;
	      var rowsCount = _props3.rowsCount;
	      var width = _props3.width;
	      var _state2 = this.state;
	      var isScrolling = _state2.isScrolling;
	      var scrollLeft = _state2.scrollLeft;
	      var scrollTop = _state2.scrollTop;


	      var childrenToDisplay = [];

	      // Render only enough columns and rows to cover the visible area of the grid.
	      if (height > 0 && width > 0) {
	        var visibleColumnIndices = (0, _GridUtils.getVisibleCellIndices)({
	          cellsCount: columnsCount,
	          cellMetadata: this._columnMetadata,
	          containerSize: width,
	          currentOffset: scrollLeft
	        });

	        var visibleRowIndices = (0, _GridUtils.getVisibleCellIndices)({
	          cellsCount: rowsCount,
	          cellMetadata: this._rowMetadata,
	          containerSize: height,
	          currentOffset: scrollTop
	        });

	        // Store for _invokeOnGridRenderedHelper()
	        this._renderedColumnStartIndex = visibleColumnIndices.start;
	        this._renderedColumnStopIndex = visibleColumnIndices.stop;
	        this._renderedRowStartIndex = visibleRowIndices.start;
	        this._renderedRowStopIndex = visibleRowIndices.stop;

	        var overscanColumnIndices = (0, _GridUtils.getOverscanIndices)({
	          cellsCount: columnsCount,
	          overscanCellsCount: overscanColumnsCount,
	          startIndex: this._renderedColumnStartIndex,
	          stopIndex: this._renderedColumnStopIndex
	        });

	        var overscanRowIndices = (0, _GridUtils.getOverscanIndices)({
	          cellsCount: rowsCount,
	          overscanCellsCount: overscanRowsCount,
	          startIndex: this._renderedRowStartIndex,
	          stopIndex: this._renderedRowStopIndex
	        });

	        // Store for _invokeOnGridRenderedHelper()
	        this._columnStartIndex = overscanColumnIndices.overscanStartIndex;
	        this._columnStopIndex = overscanColumnIndices.overscanStopIndex;
	        this._rowStartIndex = overscanRowIndices.overscanStartIndex;
	        this._rowStopIndex = overscanRowIndices.overscanStopIndex;

	        for (var rowIndex = this._rowStartIndex; rowIndex <= this._rowStopIndex; rowIndex++) {
	          var rowDatum = this._rowMetadata[rowIndex];

	          for (var columnIndex = this._columnStartIndex; columnIndex <= this._columnStopIndex; columnIndex++) {
	            var columnDatum = this._columnMetadata[columnIndex];
	            var renderedCell = renderCell({ columnIndex: columnIndex, rowIndex: rowIndex });
	            var key = rowIndex + '-' + columnIndex;

	            // any other falsey value will be rendered
	            // as a text node by React
	            if (renderedCell == null || renderedCell === false) {
	              continue;
	            }

	            var child = _react2.default.createElement(
	              'div',
	              {
	                key: key,
	                className: 'Grid__cell',
	                style: {
	                  height: rowDatum.size,
	                  left: columnDatum.offset,
	                  top: rowDatum.offset,
	                  width: columnDatum.size
	                }
	              },
	              renderedCell
	            );

	            childrenToDisplay.push(child);
	          }
	        }
	      }

	      var gridStyle = {
	        height: height,
	        width: width
	      };

	      var totalColumnsWidth = this._getTotalColumnsWidth();
	      var totalRowsHeight = this._getTotalRowsHeight();

	      // Force browser to hide scrollbars when we know they aren't necessary.
	      // Otherwise once scrollbars appear they may not disappear again.
	      // For more info see issue #116
	      if (totalColumnsWidth <= width) {
	        gridStyle.overflowX = 'hidden';
	      }

	      if (totalRowsHeight <= height) {
	        gridStyle.overflowY = 'hidden';
	      }

	      return _react2.default.createElement(
	        'div',
	        {
	          ref: 'scrollingContainer',
	          className: (0, _classnames2.default)('Grid', className),
	          onScroll: this._onScroll,
	          tabIndex: 0,
	          style: gridStyle
	        },
	        childrenToDisplay.length > 0 && _react2.default.createElement(
	          'div',
	          {
	            className: 'Grid__innerScrollContainer',
	            style: {
	              width: totalColumnsWidth,
	              height: totalRowsHeight,
	              maxWidth: totalColumnsWidth,
	              maxHeight: totalRowsHeight,
	              pointerEvents: isScrolling ? 'none' : 'auto'
	            }
	          },
	          childrenToDisplay
	        ),
	        childrenToDisplay.length === 0 && noContentRenderer()
	      );
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }

	    /* ---------------------------- Helper methods ---------------------------- */

	  }, {
	    key: '_computeColumnMetadata',
	    value: function _computeColumnMetadata(props) {
	      var columnsCount = props.columnsCount;
	      var columnWidth = props.columnWidth;


	      this._columnMetadata = (0, _GridUtils.initCellMetadata)({
	        cellsCount: columnsCount,
	        size: columnWidth
	      });
	    }
	  }, {
	    key: '_computeRowMetadata',
	    value: function _computeRowMetadata(props) {
	      var rowHeight = props.rowHeight;
	      var rowsCount = props.rowsCount;


	      this._rowMetadata = (0, _GridUtils.initCellMetadata)({
	        cellsCount: rowsCount,
	        size: rowHeight
	      });
	    }

	    /**
	     * Sets an :isScrolling flag for a small window of time.
	     * This flag is used to disable pointer events on the scrollable portion of the Grid.
	     * This prevents jerky/stuttery mouse-wheel scrolling.
	     */

	  }, {
	    key: '_enablePointerEventsAfterDelay',
	    value: function _enablePointerEventsAfterDelay() {
	      var _this2 = this;

	      if (this._disablePointerEventsTimeoutId) {
	        clearTimeout(this._disablePointerEventsTimeoutId);
	      }

	      this._disablePointerEventsTimeoutId = setTimeout(function () {
	        _this2._disablePointerEventsTimeoutId = null;
	        _this2.setState({
	          isScrolling: false
	        });
	      }, IS_SCROLLING_TIMEOUT);
	    }
	  }, {
	    key: '_getTotalColumnsWidth',
	    value: function _getTotalColumnsWidth() {
	      if (this._columnMetadata.length === 0) {
	        return 0;
	      }

	      var datum = this._columnMetadata[this._columnMetadata.length - 1];
	      return datum.offset + datum.size;
	    }
	  }, {
	    key: '_getTotalRowsHeight',
	    value: function _getTotalRowsHeight() {
	      if (this._rowMetadata.length === 0) {
	        return 0;
	      }

	      var datum = this._rowMetadata[this._rowMetadata.length - 1];
	      return datum.offset + datum.size;
	    }
	  }, {
	    key: '_invokeOnGridRenderedHelper',
	    value: function _invokeOnGridRenderedHelper() {
	      var onSectionRendered = this.props.onSectionRendered;


	      this._onGridRenderedMemoizer({
	        callback: onSectionRendered,
	        indices: {
	          columnOverscanStartIndex: this._columnStartIndex,
	          columnOverscanStopIndex: this._columnStopIndex,
	          columnStartIndex: this._renderedColumnStartIndex,
	          columnStopIndex: this._renderedColumnStopIndex,
	          rowOverscanStartIndex: this._rowStartIndex,
	          rowOverscanStopIndex: this._rowStopIndex,
	          rowStartIndex: this._renderedRowStartIndex,
	          rowStopIndex: this._renderedRowStopIndex
	        }
	      });
	    }
	  }, {
	    key: '_invokeOnScrollMemoizer',
	    value: function _invokeOnScrollMemoizer(_ref) {
	      var scrollLeft = _ref.scrollLeft;
	      var scrollTop = _ref.scrollTop;
	      var totalColumnsWidth = _ref.totalColumnsWidth;
	      var totalRowsHeight = _ref.totalRowsHeight;
	      var _props4 = this.props;
	      var height = _props4.height;
	      var onScroll = _props4.onScroll;
	      var width = _props4.width;


	      this._onScrollMemoizer({
	        callback: function callback(_ref2) {
	          var scrollLeft = _ref2.scrollLeft;
	          var scrollTop = _ref2.scrollTop;

	          onScroll({
	            clientHeight: height,
	            clientWidth: width,
	            scrollHeight: totalRowsHeight,
	            scrollLeft: scrollLeft,
	            scrollTop: scrollTop,
	            scrollWidth: totalColumnsWidth
	          });
	        },
	        indices: {
	          scrollLeft: scrollLeft,
	          scrollTop: scrollTop
	        }
	      });
	    }

	    /**
	     * Updates the state during the next animation frame.
	     * Use this method to avoid multiple renders in a small span of time.
	     * This helps performance for bursty events (like onScroll).
	     */

	  }, {
	    key: '_setNextState',
	    value: function _setNextState(state) {
	      var _this3 = this;

	      if (this._setNextStateAnimationFrameId) {
	        _raf2.default.cancel(this._setNextStateAnimationFrameId);
	      }

	      this._setNextStateAnimationFrameId = (0, _raf2.default)(function () {
	        _this3._setNextStateAnimationFrameId = null;
	        _this3.setState(state);
	      });
	    }
	  }, {
	    key: '_setScrollPosition',
	    value: function _setScrollPosition(_ref3) {
	      var scrollLeft = _ref3.scrollLeft;
	      var scrollTop = _ref3.scrollTop;

	      var newState = {
	        scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
	      };

	      if (scrollLeft >= 0) {
	        newState.scrollLeft = scrollLeft;
	      }

	      if (scrollTop >= 0) {
	        newState.scrollTop = scrollTop;
	      }

	      if (scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft || scrollTop >= 0 && scrollTop !== this.state.scrollTop) {
	        this.setState(newState);
	      }
	    }
	  }, {
	    key: '_updateScrollLeftForScrollToColumn',
	    value: function _updateScrollLeftForScrollToColumn(scrollToColumnOverride) {
	      var scrollToColumn = scrollToColumnOverride != null ? scrollToColumnOverride : this.props.scrollToColumn;

	      var width = this.props.width;
	      var scrollLeft = this.state.scrollLeft;


	      if (scrollToColumn >= 0) {
	        var calculatedScrollLeft = (0, _GridUtils.getUpdatedOffsetForIndex)({
	          cellMetadata: this._columnMetadata,
	          containerSize: width,
	          currentOffset: scrollLeft,
	          targetIndex: scrollToColumn
	        });

	        if (scrollLeft !== calculatedScrollLeft) {
	          this._setScrollPosition({
	            scrollLeft: calculatedScrollLeft
	          });
	        }
	      }
	    }
	  }, {
	    key: '_updateScrollTopForScrollToRow',
	    value: function _updateScrollTopForScrollToRow(scrollToRowOverride) {
	      var scrollToRow = scrollToRowOverride != null ? scrollToRowOverride : this.props.scrollToRow;

	      var height = this.props.height;
	      var scrollTop = this.state.scrollTop;


	      if (scrollToRow >= 0) {
	        var calculatedScrollTop = (0, _GridUtils.getUpdatedOffsetForIndex)({
	          cellMetadata: this._rowMetadata,
	          containerSize: height,
	          currentOffset: scrollTop,
	          targetIndex: scrollToRow
	        });

	        if (scrollTop !== calculatedScrollTop) {
	          this._setScrollPosition({
	            scrollTop: calculatedScrollTop
	          });
	        }
	      }
	    }
	  }, {
	    key: '_onScroll',
	    value: function _onScroll(event) {
	      // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
	      // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
	      // See issue #404 for more information.
	      if (event.target !== this.refs.scrollingContainer) {
	        return;
	      }

	      // Prevent pointer events from interrupting a smooth scroll
	      this._enablePointerEventsAfterDelay();

	      // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
	      // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
	      // This causes a series of rapid renders that is slow for long lists.
	      // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
	      var _props5 = this.props;
	      var height = _props5.height;
	      var width = _props5.width;

	      var scrollbarSize = this._scrollbarSize;
	      var totalRowsHeight = this._getTotalRowsHeight();
	      var totalColumnsWidth = this._getTotalColumnsWidth();
	      var scrollLeft = Math.min(totalColumnsWidth - width + scrollbarSize, event.target.scrollLeft);
	      var scrollTop = Math.min(totalRowsHeight - height + scrollbarSize, event.target.scrollTop);

	      // Certain devices (like Apple touchpad) rapid-fire duplicate events.
	      // Don't force a re-render if this is the case.
	      // The mouse may move faster then the animation frame does.
	      // Use requestAnimationFrame to avoid over-updating.
	      if (this.state.scrollLeft !== scrollLeft || this.state.scrollTop !== scrollTop) {
	        // Browsers with cancelable scroll events (eg. Firefox) interrupt scrolling animations if scrollTop/scrollLeft is set.
	        // Other browsers (eg. Safari) don't scroll as well without the help under certain conditions (DOM or style changes during scrolling).
	        // All things considered, this seems to be the best current work around that I'm aware of.
	        // For more information see https://github.com/bvaughn/react-virtualized/pull/124
	        var scrollPositionChangeReason = event.cancelable ? SCROLL_POSITION_CHANGE_REASONS.OBSERVED : SCROLL_POSITION_CHANGE_REASONS.REQUESTED;

	        if (!this.state.isScrolling) {
	          this.setState({
	            isScrolling: true
	          });
	        }

	        this._setNextState({
	          isScrolling: true,
	          scrollLeft: scrollLeft,
	          scrollPositionChangeReason: scrollPositionChangeReason,
	          scrollTop: scrollTop
	        });
	      }

	      this._invokeOnScrollMemoizer({ scrollLeft: scrollLeft, scrollTop: scrollTop, totalColumnsWidth: totalColumnsWidth, totalRowsHeight: totalRowsHeight });
	    }
	  }]);

	  return Grid;
	}(_react.Component);

	Grid.propTypes = {
	  /**
	   * Optional custom CSS class name to attach to root Grid element.
	   */
	  className: _react.PropTypes.string,

	  /**
	   * Number of columns in grid.
	   */
	  columnsCount: _react.PropTypes.number.isRequired,

	  /**
	   * Either a fixed column width (number) or a function that returns the width of a column given its index.
	   * Should implement the following interface: (index: number): number
	   */
	  columnWidth: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]).isRequired,

	  /**
	   * Height of Grid; this property determines the number of visible (vs virtualized) rows.
	   */
	  height: _react.PropTypes.number.isRequired,

	  /**
	   * Optional renderer to be used in place of rows when either :rowsCount or :columnsCount is 0.
	   */
	  noContentRenderer: _react.PropTypes.func.isRequired,

	  /**
	   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
	   * This callback can be used to sync scrolling between lists, tables, or grids.
	   * ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void
	   */
	  onScroll: _react.PropTypes.func.isRequired,

	  /**
	   * Callback invoked with information about the section of the Grid that was just rendered.
	   * ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }): void
	   */
	  onSectionRendered: _react.PropTypes.func.isRequired,

	  /**
	   * Number of columns to render before/after the visible section of the grid.
	   * These columns can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
	   */
	  overscanColumnsCount: _react.PropTypes.number.isRequired,

	  /**
	   * Number of rows to render above/below the visible section of the grid.
	   * These rows can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
	   */
	  overscanRowsCount: _react.PropTypes.number.isRequired,

	  /**
	   * Responsible for rendering a cell given an row and column index.
	   * Should implement the following interface: ({ columnIndex: number, rowIndex: number }): PropTypes.node
	   */
	  renderCell: _react.PropTypes.func.isRequired,

	  /**
	   * Either a fixed row height (number) or a function that returns the height of a row given its index.
	   * Should implement the following interface: (index: number): number
	   */
	  rowHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]).isRequired,

	  /**
	   * Number of rows in grid.
	   */
	  rowsCount: _react.PropTypes.number.isRequired,

	  /** Horizontal offset. */
	  scrollLeft: _react.PropTypes.number,

	  /**
	   * Column index to ensure visible (by forcefully scrolling if necessary)
	   */
	  scrollToColumn: _react.PropTypes.number,

	  /** Vertical offset. */
	  scrollTop: _react.PropTypes.number,

	  /**
	   * Row index to ensure visible (by forcefully scrolling if necessary)
	   */
	  scrollToRow: _react.PropTypes.number,

	  /**
	   * Width of Grid; this property determines the number of visible (vs virtualized) columns.
	   */
	  width: _react.PropTypes.number.isRequired
	};
	Grid.defaultProps = {
	  noContentRenderer: function noContentRenderer() {
	    return null;
	  },
	  onScroll: function onScroll() {
	    return null;
	  },
	  onSectionRendered: function onSectionRendered() {
	    return null;
	  },
	  overscanColumnsCount: 0,
	  overscanRowsCount: 10
	};
	exports.default = Grid;

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.computeCellMetadataAndUpdateScrollOffsetHelper = computeCellMetadataAndUpdateScrollOffsetHelper;
	exports.createCallbackMemoizer = createCallbackMemoizer;
	exports.findNearestCell = findNearestCell;
	exports.getOverscanIndices = getOverscanIndices;
	exports.getUpdatedOffsetForIndex = getUpdatedOffsetForIndex;
	exports.getVisibleCellIndices = getVisibleCellIndices;
	exports.initCellMetadata = initCellMetadata;
	exports.updateScrollIndexHelper = updateScrollIndexHelper;
	/**
	 * Helper method that determines when to recalculate row or column metadata.
	 *
	 * @param cellsCount Number of rows or columns in the current axis
	 * @param cellsSize Width or height of cells for the current axis
	 * @param computeMetadataCallback Method to invoke if cell metadata should be recalculated
	 * @param computeMetadataCallbackProps Parameters to pass to :computeMetadataCallback
	 * @param computeMetadataOnNextUpdate Flag specifying that metadata should be recalculated
	 * @param nextCellsCount Newly updated number of rows or columns in the current axis
	 * @param nextCellsSize Newly updated width or height of cells for the current axis
	 * @param nextScrollToIndex Newly updated scroll-to-index
	 * @param scrollToIndex Scroll-to-index
	 * @param updateScrollOffsetForScrollToIndex Callback to invoke if the scroll position should be recalculated
	 */
	function computeCellMetadataAndUpdateScrollOffsetHelper(_ref) {
	  var cellsCount = _ref.cellsCount;
	  var cellSize = _ref.cellSize;
	  var computeMetadataCallback = _ref.computeMetadataCallback;
	  var computeMetadataCallbackProps = _ref.computeMetadataCallbackProps;
	  var computeMetadataOnNextUpdate = _ref.computeMetadataOnNextUpdate;
	  var nextCellsCount = _ref.nextCellsCount;
	  var nextCellSize = _ref.nextCellSize;
	  var nextScrollToIndex = _ref.nextScrollToIndex;
	  var scrollToIndex = _ref.scrollToIndex;
	  var updateScrollOffsetForScrollToIndex = _ref.updateScrollOffsetForScrollToIndex;

	  // Don't compare cell sizes if they are functions because inline functions would cause infinite loops.
	  // In that event users should use the manual recompute methods to inform of changes.
	  if (computeMetadataOnNextUpdate || cellsCount !== nextCellsCount || (typeof cellSize === 'number' || typeof nextCellSize === 'number') && cellSize !== nextCellSize) {
	    computeMetadataCallback(computeMetadataCallbackProps);

	    // Updated cell metadata may have hidden the previous scrolled-to item.
	    // In this case we should also update the scrollTop to ensure it stays visible.
	    if (scrollToIndex >= 0 && scrollToIndex === nextScrollToIndex) {
	      updateScrollOffsetForScrollToIndex();
	    }
	  }
	}

	/**
	 * Helper utility that updates the specified callback whenever any of the specified indices have changed.
	 */
	function createCallbackMemoizer() {
	  var requireAllKeys = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	  var cachedIndices = {};

	  return function (_ref2) {
	    var callback = _ref2.callback;
	    var indices = _ref2.indices;

	    var keys = Object.keys(indices);
	    var allInitialized = !requireAllKeys || keys.every(function (key) {
	      return indices[key] >= 0;
	    });
	    var indexChanged = keys.some(function (key) {
	      return cachedIndices[key] !== indices[key];
	    });

	    cachedIndices = indices;

	    if (allInitialized && indexChanged) {
	      callback(indices);
	    }
	  };
	}

	/**
	 * Binary search function inspired by react-infinite.
	 */
	function findNearestCell(_ref3) {
	  var cellMetadata = _ref3.cellMetadata;
	  var mode = _ref3.mode;
	  var offset = _ref3.offset;

	  var high = cellMetadata.length - 1;
	  var low = 0;
	  var middle = undefined;
	  var currentOffset = undefined;

	  // TODO Add better guards here against NaN offset

	  while (low <= high) {
	    middle = low + Math.floor((high - low) / 2);
	    currentOffset = cellMetadata[middle].offset;

	    if (currentOffset === offset) {
	      return middle;
	    } else if (currentOffset < offset) {
	      low = middle + 1;
	    } else if (currentOffset > offset) {
	      high = middle - 1;
	    }
	  }

	  if (mode === findNearestCell.EQUAL_OR_LOWER && low > 0) {
	    return low - 1;
	  } else if (mode === findNearestCell.EQUAL_OR_HIGHER && high < cellMetadata.length - 1) {
	    return high + 1;
	  }
	}

	findNearestCell.EQUAL_OR_LOWER = 1;
	findNearestCell.EQUAL_OR_HIGHER = 2;

	function getOverscanIndices(_ref4) {
	  var cellsCount = _ref4.cellsCount;
	  var overscanCellsCount = _ref4.overscanCellsCount;
	  var startIndex = _ref4.startIndex;
	  var stopIndex = _ref4.stopIndex;

	  return {
	    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
	    overscanStopIndex: Math.min(cellsCount - 1, stopIndex + overscanCellsCount)
	  };
	}

	/**
	 * Determines a new offset that ensures a certain cell is visible, given the current offset.
	 * If the cell is already visible then the current offset will be returned.
	 * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
	 *
	 * @param cellMetadata Metadata initially computed by initCellMetadata()
	 * @param containerSize Total size (width or height) of the container
	 * @param currentOffset Container's current (x or y) offset
	 * @param targetIndex Index of target cell
	 * @return Offset to use to ensure the specified cell is visible
	 */
	function getUpdatedOffsetForIndex(_ref5) {
	  var cellMetadata = _ref5.cellMetadata;
	  var containerSize = _ref5.containerSize;
	  var currentOffset = _ref5.currentOffset;
	  var targetIndex = _ref5.targetIndex;

	  if (cellMetadata.length === 0) {
	    return 0;
	  }

	  targetIndex = Math.max(0, Math.min(cellMetadata.length - 1, targetIndex));

	  var datum = cellMetadata[targetIndex];
	  var maxOffset = datum.offset;
	  var minOffset = maxOffset - containerSize + datum.size;
	  var newOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));

	  return newOffset;
	}

	/**
	 * Determines the range of cells to display for a given offset in order to fill the specified container.
	 *
	 * @param cellsCount Total number of cells.
	 * @param cellMetadata Metadata initially computed by initCellMetadata()
	 * @param containerSize Total size (width or height) of the container
	 * @param currentOffset Container's current (x or y) offset
	 * @return An object containing :start and :stop attributes, each specifying a cell index
	 */
	function getVisibleCellIndices(_ref6) {
	  var cellsCount = _ref6.cellsCount;
	  var cellMetadata = _ref6.cellMetadata;
	  var containerSize = _ref6.containerSize;
	  var currentOffset = _ref6.currentOffset;

	  if (cellsCount === 0) {
	    return {};
	  }

	  // TODO Add better guards here against NaN offset

	  var lastDatum = cellMetadata[cellMetadata.length - 1];
	  var totalCellSize = lastDatum.offset + lastDatum.size;

	  // Ensure offset is within reasonable bounds
	  currentOffset = Math.max(0, Math.min(totalCellSize - containerSize, currentOffset));

	  var maxOffset = Math.min(totalCellSize, currentOffset + containerSize);

	  var start = findNearestCell({
	    cellMetadata: cellMetadata,
	    mode: findNearestCell.EQUAL_OR_LOWER,
	    offset: currentOffset
	  });

	  var datum = cellMetadata[start];
	  currentOffset = datum.offset + datum.size;

	  var stop = start;

	  while (currentOffset < maxOffset && stop < cellsCount - 1) {
	    stop++;

	    currentOffset += cellMetadata[stop].size;
	  }

	  return {
	    start: start,
	    stop: stop
	  };
	}

	/**
	 * Initializes metadata for an axis and its cells.
	 * This data is used to determine which cells are visible given a container size and scroll position.
	 *
	 * @param cellsCount Total number of cells.
	 * @param size Either a fixed size or a function that returns the size for a given given an index.
	 * @return Object mapping cell index to cell metadata (size, offset)
	 */
	function initCellMetadata(_ref7) {
	  var cellsCount = _ref7.cellsCount;
	  var size = _ref7.size;

	  var sizeGetter = size instanceof Function ? size : function (index) {
	    return size;
	  };

	  var cellMetadata = [];
	  var offset = 0;

	  for (var i = 0; i < cellsCount; i++) {
	    var _size = sizeGetter(i);

	    if (_size == null || isNaN(_size)) {
	      throw Error('Invalid size returned for cell ' + i + ' of value ' + _size);
	    }

	    cellMetadata[i] = {
	      size: _size,
	      offset: offset
	    };

	    offset += _size;
	  }

	  return cellMetadata;
	}

	/**
	 * Helper function that determines when to update scroll offsets to ensure that a scroll-to-index remains visible.
	 *
	 * @param cellMetadata Metadata initially computed by initCellMetadata()
	 * @param cellsCount Number of rows or columns in the current axis
	 * @param cellsSize Width or height of cells for the current axis
	 * @param previousCellsCount Previous number of rows or columns
	 * @param previousCellsSize Previous width or height of cells
	 * @param previousScrollToIndex Previous scroll-to-index
	 * @param previousSize Previous width or height of the virtualized container
	 * @param scrollOffset Current scrollLeft or scrollTop
	 * @param scrollToIndex Scroll-to-index
	 * @param size Width or height of the virtualized container
	 * @param updateScrollIndexCallback Callback to invoke with an optional scroll-to-index override
	 */
	function updateScrollIndexHelper(_ref8) {
	  var cellMetadata = _ref8.cellMetadata;
	  var cellsCount = _ref8.cellsCount;
	  var cellSize = _ref8.cellSize;
	  var previousCellsCount = _ref8.previousCellsCount;
	  var previousCellSize = _ref8.previousCellSize;
	  var previousScrollToIndex = _ref8.previousScrollToIndex;
	  var previousSize = _ref8.previousSize;
	  var scrollOffset = _ref8.scrollOffset;
	  var scrollToIndex = _ref8.scrollToIndex;
	  var size = _ref8.size;
	  var updateScrollIndexCallback = _ref8.updateScrollIndexCallback;

	  var hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < cellsCount;
	  var sizeHasChanged = size !== previousSize || !previousCellSize || typeof cellSize === 'number' && cellSize !== previousCellSize;

	  // If we have a new scroll target OR if height/row-height has changed,
	  // We should ensure that the scroll target is visible.
	  if (hasScrollToIndex && (sizeHasChanged || scrollToIndex !== previousScrollToIndex)) {
	    updateScrollIndexCallback();

	    // If we don't have a selected item but list size or number of children have decreased,
	    // Make sure we aren't scrolled too far past the current content.
	  } else if (!hasScrollToIndex && (size < previousSize || cellsCount < previousCellsCount)) {
	      var calculatedScrollOffset = getUpdatedOffsetForIndex({
	        cellMetadata: cellMetadata,
	        containerSize: size,
	        currentOffset: scrollOffset,
	        targetIndex: cellsCount - 1
	      });

	      // Only adjust the scroll position if we've scrolled below the last set of rows.
	      if (calculatedScrollOffset < scrollOffset) {
	        updateScrollIndexCallback(cellsCount - 1);
	      }
	    }
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(27)
	  , root = typeof window === 'undefined' ? global : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = root['request' + suffix]
	  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

	for(var i = 0; !raf && i < vendors.length; i++) {
	  raf = root[vendors[i] + 'Request' + suffix]
	  caf = root[vendors[i] + 'Cancel' + suffix]
	      || root[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(root, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(root, arguments)
	}
	module.exports.polyfill = function() {
	  root.requestAnimationFrame = raf
	  root.cancelAnimationFrame = caf
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28)))

/***/ },
/* 28 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var canUseDOM = __webpack_require__(30);

	var size;

	module.exports = function (recalc) {
	  if (!size || recalc) {
	    if (canUseDOM) {
	      var scrollDiv = document.createElement('div');

	      scrollDiv.style.position = 'absolute';
	      scrollDiv.style.top = '-9999px';
	      scrollDiv.style.width = '50px';
	      scrollDiv.style.height = '50px';
	      scrollDiv.style.overflow = 'scroll';

	      document.body.appendChild(scrollDiv);
	      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	      document.body.removeChild(scrollDiv);
	    }
	  }

	  return size;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SortIndicator = exports.SortDirection = exports.FlexColumn = exports.FlexTable = exports.default = undefined;

	var _FlexTable2 = __webpack_require__(32);

	var _FlexTable3 = _interopRequireDefault(_FlexTable2);

	var _FlexColumn2 = __webpack_require__(33);

	var _FlexColumn3 = _interopRequireDefault(_FlexColumn2);

	var _SortDirection2 = __webpack_require__(35);

	var _SortDirection3 = _interopRequireDefault(_SortDirection2);

	var _SortIndicator2 = __webpack_require__(34);

	var _SortIndicator3 = _interopRequireDefault(_SortIndicator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _FlexTable3.default;
	exports.FlexTable = _FlexTable3.default;
	exports.FlexColumn = _FlexColumn3.default;
	exports.SortDirection = _SortDirection3.default;
	exports.SortIndicator = _SortIndicator3.default;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _classnames = __webpack_require__(25);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _FlexColumn = __webpack_require__(33);

	var _FlexColumn2 = _interopRequireDefault(_FlexColumn);

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(36);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	var _Grid = __webpack_require__(22);

	var _Grid2 = _interopRequireDefault(_Grid);

	var _SortDirection = __webpack_require__(35);

	var _SortDirection2 = _interopRequireDefault(_SortDirection);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
	 * This component expects explicit width, height, and padding parameters.
	 */

	var FlexTable = function (_Component) {
	  _inherits(FlexTable, _Component);

	  function FlexTable(props) {
	    _classCallCheck(this, FlexTable);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlexTable).call(this, props));

	    _this.state = {
	      scrollbarWidth: 0
	    };

	    _this._createRow = _this._createRow.bind(_this);
	    return _this;
	  }

	  /**
	   * See Grid#recomputeGridSize
	   */


	  _createClass(FlexTable, [{
	    key: 'recomputeRowHeights',
	    value: function recomputeRowHeights() {
	      this.refs.Grid.recomputeGridSize();
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._setScrollbarWidth();
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      this._setScrollbarWidth();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _props = this.props;
	      var className = _props.className;
	      var disableHeader = _props.disableHeader;
	      var headerHeight = _props.headerHeight;
	      var height = _props.height;
	      var noRowsRenderer = _props.noRowsRenderer;
	      var onRowsRendered = _props.onRowsRendered;
	      var _onScroll = _props.onScroll;
	      var overscanRowsCount = _props.overscanRowsCount;
	      var rowClassName = _props.rowClassName;
	      var rowHeight = _props.rowHeight;
	      var rowsCount = _props.rowsCount;
	      var scrollToIndex = _props.scrollToIndex;
	      var scrollTop = _props.scrollTop;
	      var width = _props.width;
	      var scrollbarWidth = this.state.scrollbarWidth;


	      var availableRowsHeight = height - headerHeight;

	      // This row-renderer wrapper function is necessary in order to trigger re-render when the
	      // sort-by or sort-direction have changed (else Grid will not see any props changes)
	      var rowRenderer = function rowRenderer(index) {
	        return _this2._createRow(index);
	      };

	      var rowClass = rowClassName instanceof Function ? rowClassName(-1) : rowClassName;

	      return _react2.default.createElement(
	        'div',
	        {
	          className: (0, _classnames2.default)('FlexTable', className)
	        },
	        !disableHeader && _react2.default.createElement(
	          'div',
	          {
	            className: (0, _classnames2.default)('FlexTable__headerRow', rowClass),
	            style: {
	              height: headerHeight,
	              paddingRight: scrollbarWidth,
	              width: width
	            }
	          },
	          this._getRenderedHeaderRow()
	        ),
	        _react2.default.createElement(_Grid2.default, {
	          ref: 'Grid',
	          className: 'FlexTable__Grid',
	          columnWidth: width,
	          columnsCount: 1,
	          height: availableRowsHeight,
	          noContentRenderer: noRowsRenderer,
	          onScroll: function onScroll(_ref) {
	            var clientHeight = _ref.clientHeight;
	            var scrollHeight = _ref.scrollHeight;
	            var scrollTop = _ref.scrollTop;
	            return _onScroll({ clientHeight: clientHeight, scrollHeight: scrollHeight, scrollTop: scrollTop });
	          },
	          onSectionRendered: function onSectionRendered(_ref2) {
	            var rowOverscanStartIndex = _ref2.rowOverscanStartIndex;
	            var rowOverscanStopIndex = _ref2.rowOverscanStopIndex;
	            var rowStartIndex = _ref2.rowStartIndex;
	            var rowStopIndex = _ref2.rowStopIndex;
	            return onRowsRendered({
	              overscanStartIndex: rowOverscanStartIndex,
	              overscanStopIndex: rowOverscanStopIndex,
	              startIndex: rowStartIndex,
	              stopIndex: rowStopIndex
	            });
	          },
	          overscanRowsCount: overscanRowsCount,
	          renderCell: function renderCell(_ref3) {
	            var columnIndex = _ref3.columnIndex;
	            var rowIndex = _ref3.rowIndex;
	            return rowRenderer(rowIndex);
	          },
	          rowHeight: rowHeight,
	          rowsCount: rowsCount,
	          scrollToRow: scrollToIndex,
	          scrollTop: scrollTop,
	          width: width
	        })
	      );
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }
	  }, {
	    key: '_createColumn',
	    value: function _createColumn(column, columnIndex, rowData, rowIndex) {
	      var _column$props = column.props;
	      var cellClassName = _column$props.cellClassName;
	      var cellDataGetter = _column$props.cellDataGetter;
	      var columnData = _column$props.columnData;
	      var dataKey = _column$props.dataKey;
	      var cellRenderer = _column$props.cellRenderer;

	      var cellData = cellDataGetter(dataKey, rowData, columnData);
	      var renderedCell = cellRenderer(cellData, dataKey, rowData, rowIndex, columnData);

	      var style = this._getFlexStyleForColumn(column);

	      var title = typeof renderedCell === 'string' ? renderedCell : null;

	      return _react2.default.createElement(
	        'div',
	        {
	          key: 'Row' + rowIndex + '-Col' + columnIndex,
	          className: (0, _classnames2.default)('FlexTable__rowColumn', cellClassName),
	          style: style
	        },
	        _react2.default.createElement(
	          'div',
	          {
	            className: 'FlexTable__truncatedColumnText',
	            title: title
	          },
	          renderedCell
	        )
	      );
	    }
	  }, {
	    key: '_createHeader',
	    value: function _createHeader(column, columnIndex) {
	      var _props2 = this.props;
	      var headerClassName = _props2.headerClassName;
	      var onHeaderClick = _props2.onHeaderClick;
	      var sort = _props2.sort;
	      var sortBy = _props2.sortBy;
	      var sortDirection = _props2.sortDirection;
	      var _column$props2 = column.props;
	      var dataKey = _column$props2.dataKey;
	      var disableSort = _column$props2.disableSort;
	      var headerRenderer = _column$props2.headerRenderer;
	      var label = _column$props2.label;
	      var columnData = _column$props2.columnData;

	      var sortEnabled = !disableSort && sort;

	      var classNames = (0, _classnames2.default)('FlexTable__headerColumn', headerClassName, column.props.headerClassName, {
	        'FlexTable__sortableHeaderColumn': sortEnabled
	      });
	      var style = this._getFlexStyleForColumn(column);

	      // If this is a sortable header, clicking it should update the table data's sorting.
	      var newSortDirection = sortBy !== dataKey || sortDirection === _SortDirection2.default.DESC ? _SortDirection2.default.ASC : _SortDirection2.default.DESC;
	      var onClick = function onClick() {
	        sortEnabled && sort(dataKey, newSortDirection);
	        onHeaderClick(dataKey, columnData);
	      };

	      var renderedHeader = headerRenderer({
	        columnData: columnData,
	        dataKey: dataKey,
	        disableSort: disableSort,
	        label: label,
	        sortBy: sortBy,
	        sortDirection: sortDirection
	      });

	      return _react2.default.createElement(
	        'div',
	        {
	          key: 'Header-Col' + columnIndex,
	          className: classNames,
	          style: style,
	          onClick: onClick
	        },
	        renderedHeader
	      );
	    }
	  }, {
	    key: '_createRow',
	    value: function _createRow(rowIndex) {
	      var _this3 = this;

	      var _props3 = this.props;
	      var children = _props3.children;
	      var onRowClick = _props3.onRowClick;
	      var rowClassName = _props3.rowClassName;
	      var rowGetter = _props3.rowGetter;
	      var scrollbarWidth = this.state.scrollbarWidth;


	      var rowClass = rowClassName instanceof Function ? rowClassName(rowIndex) : rowClassName;
	      var rowData = rowGetter(rowIndex);

	      var renderedRow = _react2.default.Children.map(children, function (column, columnIndex) {
	        return _this3._createColumn(column, columnIndex, rowData, rowIndex);
	      });

	      return _react2.default.createElement(
	        'div',
	        {
	          key: rowIndex,
	          className: (0, _classnames2.default)('FlexTable__row', rowClass),
	          onClick: function onClick() {
	            return onRowClick(rowIndex);
	          },
	          style: {
	            height: this._getRowHeight(rowIndex),
	            paddingRight: scrollbarWidth
	          }
	        },
	        renderedRow
	      );
	    }

	    /**
	     * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
	     */

	  }, {
	    key: '_getFlexStyleForColumn',
	    value: function _getFlexStyleForColumn(column) {
	      var flexValue = column.props.flexGrow + ' ' + column.props.flexShrink + ' ' + column.props.width + 'px';

	      var style = {
	        flex: flexValue,
	        msFlex: flexValue,
	        WebkitFlex: flexValue
	      };

	      if (column.props.maxWidth) {
	        style.maxWidth = column.props.maxWidth;
	      }

	      if (column.props.minWidth) {
	        style.minWidth = column.props.minWidth;
	      }

	      return style;
	    }
	  }, {
	    key: '_getRenderedHeaderRow',
	    value: function _getRenderedHeaderRow() {
	      var _this4 = this;

	      var _props4 = this.props;
	      var children = _props4.children;
	      var disableHeader = _props4.disableHeader;

	      var items = disableHeader ? [] : children;

	      return _react2.default.Children.map(items, function (column, index) {
	        return _this4._createHeader(column, index);
	      });
	    }
	  }, {
	    key: '_getRowHeight',
	    value: function _getRowHeight(rowIndex) {
	      var rowHeight = this.props.rowHeight;


	      return rowHeight instanceof Function ? rowHeight(rowIndex) : rowHeight;
	    }
	  }, {
	    key: '_setScrollbarWidth',
	    value: function _setScrollbarWidth() {
	      var Grid = (0, _reactDom.findDOMNode)(this.refs.Grid);
	      var clientWidth = Grid.clientWidth || 0;
	      var offsetWidth = Grid.offsetWidth || 0;
	      var scrollbarWidth = offsetWidth - clientWidth;

	      this.setState({ scrollbarWidth: scrollbarWidth });
	    }
	  }]);

	  return FlexTable;
	}(_react.Component);

	FlexTable.propTypes = {
	  /** One or more FlexColumns describing the data displayed in this row */
	  children: function children(props, propName, componentName) {
	    var children = _react2.default.Children.toArray(props.children);
	    for (var i = 0; i < children.length; i++) {
	      if (children[i].type !== _FlexColumn2.default) {
	        return new Error('FlexTable only accepts children of type FlexColumn');
	      }
	    }
	  },

	  /** Optional CSS class name */
	  className: _react.PropTypes.string,

	  /** Disable rendering the header at all */
	  disableHeader: _react.PropTypes.bool,

	  /** Optional CSS class to apply to all column headers */
	  headerClassName: _react.PropTypes.string,

	  /** Fixed height of header row */
	  headerHeight: _react.PropTypes.number.isRequired,

	  /** Fixed/available height for out DOM element */
	  height: _react.PropTypes.number.isRequired,

	  /** Optional renderer to be used in place of table body rows when rowsCount is 0 */
	  noRowsRenderer: _react.PropTypes.func,

	  /**
	  * Optional callback when a column's header is clicked.
	  * (dataKey: string): void
	  */
	  onHeaderClick: _react.PropTypes.func,

	  /**
	   * Callback invoked when a user clicks on a table row.
	   * (rowIndex: number): void
	   */
	  onRowClick: _react.PropTypes.func,

	  /**
	   * Callback invoked with information about the slice of rows that were just rendered.
	   * ({ startIndex, stopIndex }): void
	   */
	  onRowsRendered: _react.PropTypes.func,

	  /**
	   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
	   * This callback can be used to sync scrolling between lists, tables, or grids.
	   * ({ clientHeight, scrollHeight, scrollTop }): void
	   */
	  onScroll: _react.PropTypes.func.isRequired,

	  /**
	   * Number of rows to render above/below the visible bounds of the list.
	   * These rows can help for smoother scrolling on touch devices.
	   */
	  overscanRowsCount: _react.PropTypes.number.isRequired,

	  /**
	   * Optional CSS class to apply to all table rows (including the header row).
	   * This property can be a CSS class name (string) or a function that returns a class name.
	   * If a function is provided its signature should be: (rowIndex: number): string
	   */
	  rowClassName: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

	  /**
	   * Callback responsible for returning a data row given an index.
	   * (index: number): any
	   */
	  rowGetter: _react.PropTypes.func.isRequired,

	  /**
	   * Either a fixed row height (number) or a function that returns the height of a row given its index.
	   * (index: number): number
	   */
	  rowHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]).isRequired,

	  /** Number of rows in table. */
	  rowsCount: _react.PropTypes.number.isRequired,

	  /** Row index to ensure visible (by forcefully scrolling if necessary) */
	  scrollToIndex: _react.PropTypes.number,

	  /** Vertical offset. */
	  scrollTop: _react.PropTypes.number,

	  /**
	   * Sort function to be called if a sortable header is clicked.
	   * (dataKey: string, sortDirection: SortDirection): void
	   */
	  sort: _react.PropTypes.func,

	  /** FlexTable data is currently sorted by this :dataKey (if it is sorted at all) */
	  sortBy: _react.PropTypes.string,

	  /** FlexTable data is currently sorted in this direction (if it is sorted at all) */
	  sortDirection: _react.PropTypes.oneOf([_SortDirection2.default.ASC, _SortDirection2.default.DESC]),

	  /** Width of list */
	  width: _react.PropTypes.number.isRequired
	};
	FlexTable.defaultProps = {
	  disableHeader: false,
	  headerHeight: 0,
	  noRowsRenderer: function noRowsRenderer() {
	    return null;
	  },
	  onHeaderClick: function onHeaderClick() {
	    return null;
	  },
	  onRowClick: function onRowClick() {
	    return null;
	  },
	  onRowsRendered: function onRowsRendered() {
	    return null;
	  },
	  onScroll: function onScroll() {
	    return null;
	  },
	  overscanRowsCount: 10
	};
	exports.default = FlexTable;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.defaultCellRenderer = defaultCellRenderer;
	exports.defaultCellDataGetter = defaultCellDataGetter;
	exports.defaultHeaderRenderer = defaultHeaderRenderer;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _SortIndicator = __webpack_require__(34);

	var _SortIndicator2 = _interopRequireDefault(_SortIndicator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Default cell renderer that displays an attribute as a simple string
	 * You should override the column's cellRenderer if your data is some other type of object.
	 */
	function defaultCellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData) {
	  if (cellData === null || cellData === undefined) {
	    return '';
	  } else {
	    return String(cellData);
	  }
	}

	/**
	 * Default accessor for returning a cell value for a given attribute.
	 * This function expects to operate on either a vanilla Object or an Immutable Map.
	 * You should override the column's cellDataGetter if your data is some other type of object.
	 */
	function defaultCellDataGetter(dataKey, rowData, columnData) {
	  if (rowData.get instanceof Function) {
	    return rowData.get(dataKey);
	  } else {
	    return rowData[dataKey];
	  }
	}

	/**
	 * Default table header renderer.
	 */
	function defaultHeaderRenderer(_ref) {
	  var columnData = _ref.columnData;
	  var dataKey = _ref.dataKey;
	  var disableSort = _ref.disableSort;
	  var label = _ref.label;
	  var sortBy = _ref.sortBy;
	  var sortDirection = _ref.sortDirection;

	  var showSortIndicator = sortBy === dataKey;
	  var children = [_react2.default.createElement(
	    'div',
	    {
	      className: 'FlexTable__headerTruncatedText',
	      key: 'label',
	      title: label
	    },
	    label
	  )];

	  if (showSortIndicator) {
	    children.push(_react2.default.createElement(_SortIndicator2.default, {
	      key: 'SortIndicator',
	      sortDirection: sortDirection
	    }));
	  }

	  return children;
	}

	/**
	 * Describes the header and cell contents of a table column.
	 */

	var Column = function (_Component) {
	  _inherits(Column, _Component);

	  function Column() {
	    _classCallCheck(this, Column);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Column).apply(this, arguments));
	  }

	  return Column;
	}(_react.Component);

	Column.defaultProps = {
	  cellDataGetter: defaultCellDataGetter,
	  cellRenderer: defaultCellRenderer,
	  flexGrow: 0,
	  flexShrink: 1,
	  headerRenderer: defaultHeaderRenderer
	};
	Column.propTypes = {
	  /** Optional CSS class to apply to cell */
	  cellClassName: _react.PropTypes.string,

	  /**
	   * Callback responsible for returning a cell's data, given its :dataKey
	   * (dataKey: string, rowData: any): any
	   */
	  cellDataGetter: _react.PropTypes.func,

	  /**
	   * Callback responsible for rendering a cell's contents.
	   * (cellData: any, cellDataKey: string, rowData: any, rowIndex: number, columnData: any): element
	   */
	  cellRenderer: _react.PropTypes.func,

	  /** Optional additional data passed to this column's :cellDataGetter */
	  columnData: _react.PropTypes.object,

	  /** Uniquely identifies the row-data attribute correspnding to this cell */
	  dataKey: _react.PropTypes.any.isRequired,

	  /** If sort is enabled for the table at large, disable it for this column */
	  disableSort: _react.PropTypes.bool,

	  /** Flex grow style; defaults to 0 */
	  flexGrow: _react.PropTypes.number,

	  /** Flex shrink style; defaults to 1 */
	  flexShrink: _react.PropTypes.number,

	  /** Optional CSS class to apply to this column's header */
	  headerClassName: _react.PropTypes.string,

	  /**
	   * Optional callback responsible for rendering a column header contents.
	   * ({ columnData: object, dataKey: string, disableSort: boolean, label: string, sortBy: string, sortDirection: string }): PropTypes.node
	   */
	  headerRenderer: _react.PropTypes.func.isRequired,

	  /** Header label for this column */
	  label: _react.PropTypes.string,

	  /** Maximum width of column; this property will only be used if :flexGrow is > 0. */
	  maxWidth: _react.PropTypes.number,

	  /** Minimum width of column. */
	  minWidth: _react.PropTypes.number,

	  /** Flex basis (width) for this column; This value can grow or shrink based on :flexGrow and :flexShrink properties. */
	  width: _react.PropTypes.number.isRequired
	};
	exports.default = Column;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = SortIndicator;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(25);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _SortDirection = __webpack_require__(35);

	var _SortDirection2 = _interopRequireDefault(_SortDirection);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Displayed beside a header to indicate that a FlexTable is currently sorted by this column.
	 */
	function SortIndicator(_ref) {
	  var sortDirection = _ref.sortDirection;

	  var classNames = (0, _classnames2.default)('FlexTable__sortableHeaderIcon', {
	    'FlexTable__sortableHeaderIcon--ASC': sortDirection === _SortDirection2.default.ASC,
	    'FlexTable__sortableHeaderIcon--DESC': sortDirection === _SortDirection2.default.DESC
	  });

	  return _react2.default.createElement(
	    'svg',
	    {
	      className: classNames,
	      width: 18,
	      height: 18,
	      viewBox: '0 0 24 24',
	      xmlns: 'http://www.w3.org/2000/svg'
	    },
	    sortDirection === _SortDirection2.default.ASC ? _react2.default.createElement('path', { d: 'M7 14l5-5 5 5z' }) : _react2.default.createElement('path', { d: 'M7 10l5 5 5-5z' }),
	    _react2.default.createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' })
	  );
	}
	SortIndicator.propTypes = {
	  sortDirection: _react.PropTypes.oneOf([_SortDirection2.default.ASC, _SortDirection2.default.DESC])
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SortDirection = {
	  /**
	   * Sort items in ascending order.
	   * This means arranging from the lowest value to the highest (e.g. a-z, 0-9).
	   */
	  ASC: 'ASC',

	  /**
	   * Sort items in descending order.
	   * This means arranging from the highest value to the lowest (e.g. z-a, 9-0).
	   */
	  DESC: 'DESC'
	};

	exports.default = SortDirection;

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.InfiniteLoader = exports.default = undefined;

	var _InfiniteLoader2 = __webpack_require__(38);

	var _InfiniteLoader3 = _interopRequireDefault(_InfiniteLoader2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _InfiniteLoader3.default;
	exports.InfiniteLoader = _InfiniteLoader3.default;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.isRangeVisible = isRangeVisible;
	exports.scanForUnloadedRanges = scanForUnloadedRanges;

	var _react = __webpack_require__(2);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Higher-order component that manages lazy-loading for "infinite" data.
	 * This component decorates a virtual component and just-in-time prefetches rows as a user scrolls.
	 * It is intended as a convenience component; fork it if you'd like finer-grained control over data-loading.
	 */

	var InfiniteLoader = function (_Component) {
	  _inherits(InfiniteLoader, _Component);

	  function InfiniteLoader(props, context) {
	    _classCallCheck(this, InfiniteLoader);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InfiniteLoader).call(this, props, context));

	    _this._onRowsRendered = _this._onRowsRendered.bind(_this);
	    _this._registerChild = _this._registerChild.bind(_this);
	    return _this;
	  }

	  _createClass(InfiniteLoader, [{
	    key: 'render',
	    value: function render() {
	      var children = this.props.children;


	      return children({
	        onRowsRendered: this._onRowsRendered,
	        registerChild: this._registerChild
	      });
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }
	  }, {
	    key: '_onRowsRendered',
	    value: function _onRowsRendered(_ref) {
	      var _this2 = this;

	      var startIndex = _ref.startIndex;
	      var stopIndex = _ref.stopIndex;
	      var _props = this.props;
	      var isRowLoaded = _props.isRowLoaded;
	      var loadMoreRows = _props.loadMoreRows;
	      var rowsCount = _props.rowsCount;
	      var threshold = _props.threshold;


	      this._lastRenderedStartIndex = startIndex;
	      this._lastRenderedStopIndex = stopIndex;

	      var unloadedRanges = scanForUnloadedRanges({
	        isRowLoaded: isRowLoaded,
	        startIndex: Math.max(0, startIndex - threshold),
	        stopIndex: Math.min(rowsCount, stopIndex + threshold)
	      });

	      unloadedRanges.forEach(function (unloadedRange) {
	        var promise = loadMoreRows(unloadedRange);
	        if (promise) {
	          promise.then(function () {
	            // Refresh the visible rows if any of them have just been loaded.
	            // Otherwise they will remain in their unloaded visual state.
	            if (isRangeVisible({
	              lastRenderedStartIndex: _this2._lastRenderedStartIndex,
	              lastRenderedStopIndex: _this2._lastRenderedStopIndex,
	              startIndex: unloadedRange.startIndex,
	              stopIndex: unloadedRange.stopIndex
	            })) {
	              if (_this2._registeredChild) {
	                _this2._registeredChild.forceUpdate();
	              }
	            }
	          });
	        }
	      });
	    }
	  }, {
	    key: '_registerChild',
	    value: function _registerChild(registeredChild) {
	      this._registeredChild = registeredChild;
	    }
	  }]);

	  return InfiniteLoader;
	}(_react.Component);

	/**
	 * Determines if the specified start/stop range is visible based on the most recently rendered range.
	 */


	InfiniteLoader.propTypes = {
	  /**
	   * Function respondible for rendering a virtualized component.
	   * This function should implement the following signature:
	   * ({ onRowsRendered, registerChild }) => PropTypes.element
	   *
	   * The specified :onRowsRendered function should be passed through to the child's :onRowsRendered property.
	   * The :registerChild callback should be set as the virtualized component's :ref.
	   */
	  children: _react.PropTypes.func.isRequired,

	  /**
	   * Function responsible for tracking the loaded state of each row.
	   * It should implement the following signature: (index: number): boolean
	   */
	  isRowLoaded: _react.PropTypes.func.isRequired,

	  /**
	   * Callback to be invoked when more rows must be loaded.
	   * It should implement the following signature: ({ startIndex, stopIndex }): Promise
	   * The returned Promise should be resolved once row data has finished loading.
	   * It will be used to determine when to refresh the list with the newly-loaded data.
	   * This callback may be called multiple times in reaction to a single scroll event.
	   */
	  loadMoreRows: _react.PropTypes.func.isRequired,

	  /**
	   * Number of rows in list; can be arbitrary high number if actual number is unknown.
	   */
	  rowsCount: _react.PropTypes.number.isRequired,

	  /**
	   * Threshold at which to pre-fetch data.
	   * A threshold X means that data will start loading when a user scrolls within X rows.
	   * This value defaults to 15.
	   */
	  threshold: _react.PropTypes.number.isRequired
	};
	InfiniteLoader.defaultProps = {
	  rowsCount: 0,
	  threshold: 15
	};
	exports.default = InfiniteLoader;
	function isRangeVisible(_ref2) {
	  var lastRenderedStartIndex = _ref2.lastRenderedStartIndex;
	  var lastRenderedStopIndex = _ref2.lastRenderedStopIndex;
	  var startIndex = _ref2.startIndex;
	  var stopIndex = _ref2.stopIndex;

	  return !(startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex);
	}

	/**
	 * Returns all of the ranges within a larger range that contain unloaded rows.
	 */
	function scanForUnloadedRanges(_ref3) {
	  var isRowLoaded = _ref3.isRowLoaded;
	  var startIndex = _ref3.startIndex;
	  var stopIndex = _ref3.stopIndex;

	  var unloadedRanges = [];
	  var rangeStartIndex = null;
	  var rangeStopIndex = null;

	  for (var i = startIndex; i <= stopIndex; i++) {
	    var loaded = isRowLoaded(i);

	    if (!loaded) {
	      rangeStopIndex = i;
	      if (rangeStartIndex === null) {
	        rangeStartIndex = i;
	      }
	    } else if (rangeStopIndex !== null) {
	      unloadedRanges.push({
	        startIndex: rangeStartIndex,
	        stopIndex: rangeStopIndex
	      });

	      rangeStartIndex = rangeStopIndex = null;
	    }
	  }

	  if (rangeStopIndex !== null) {
	    unloadedRanges.push({
	      startIndex: rangeStartIndex,
	      stopIndex: rangeStopIndex
	    });
	  }

	  return unloadedRanges;
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ScrollSync = exports.default = undefined;

	var _ScrollSync2 = __webpack_require__(40);

	var _ScrollSync3 = _interopRequireDefault(_ScrollSync2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _ScrollSync3.default;
	exports.ScrollSync = _ScrollSync3.default;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
	 */

	var ScrollSync = function (_Component) {
	  _inherits(ScrollSync, _Component);

	  function ScrollSync(props, context) {
	    _classCallCheck(this, ScrollSync);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScrollSync).call(this, props, context));

	    _this.state = {
	      clientHeight: 0,
	      clientWidth: 0,
	      scrollHeight: 0,
	      scrollLeft: 0,
	      scrollTop: 0,
	      scrollWidth: 0
	    };

	    _this._onScroll = _this._onScroll.bind(_this);
	    return _this;
	  }

	  _createClass(ScrollSync, [{
	    key: 'render',
	    value: function render() {
	      var children = this.props.children;
	      var _state = this.state;
	      var clientHeight = _state.clientHeight;
	      var clientWidth = _state.clientWidth;
	      var scrollHeight = _state.scrollHeight;
	      var scrollLeft = _state.scrollLeft;
	      var scrollTop = _state.scrollTop;
	      var scrollWidth = _state.scrollWidth;


	      return children({
	        clientHeight: clientHeight,
	        clientWidth: clientWidth,
	        onScroll: this._onScroll,
	        scrollHeight: scrollHeight,
	        scrollLeft: scrollLeft,
	        scrollTop: scrollTop,
	        scrollWidth: scrollWidth
	      });
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }
	  }, {
	    key: '_onScroll',
	    value: function _onScroll(_ref) {
	      var clientHeight = _ref.clientHeight;
	      var clientWidth = _ref.clientWidth;
	      var scrollHeight = _ref.scrollHeight;
	      var scrollLeft = _ref.scrollLeft;
	      var scrollTop = _ref.scrollTop;
	      var scrollWidth = _ref.scrollWidth;

	      this.setState({ clientHeight: clientHeight, clientWidth: clientWidth, scrollHeight: scrollHeight, scrollLeft: scrollLeft, scrollTop: scrollTop, scrollWidth: scrollWidth });
	    }
	  }]);

	  return ScrollSync;
	}(_react.Component);

	ScrollSync.propTypes = {
	  /**
	   * Function respondible for rendering 2 or more virtualized components.
	   * This function should implement the following signature:
	   * ({ onScroll, scrollLeft, scrollTop }) => PropTypes.element
	   */
	  children: _react.PropTypes.func.isRequired
	};
	exports.default = ScrollSync;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.VirtualScroll = exports.default = undefined;

	var _VirtualScroll2 = __webpack_require__(42);

	var _VirtualScroll3 = _interopRequireDefault(_VirtualScroll2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _VirtualScroll3.default;
	exports.VirtualScroll = _VirtualScroll3.default;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Grid = __webpack_require__(22);

	var _Grid2 = _interopRequireDefault(_Grid);

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(25);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _reactAddonsShallowCompare = __webpack_require__(14);

	var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
	 * if only a few of those elements are visible. The primary purpose of this component is to improve
	 * performance by only rendering the DOM nodes that a user is able to see based on their current
	 * scroll position.
	 *
	 * This component renders a virtualized list of elements with either fixed or dynamic heights.
	 */

	var VirtualScroll = function (_Component) {
	  _inherits(VirtualScroll, _Component);

	  function VirtualScroll() {
	    _classCallCheck(this, VirtualScroll);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(VirtualScroll).apply(this, arguments));
	  }

	  _createClass(VirtualScroll, [{
	    key: 'recomputeRowHeights',


	    /**
	     * See Grid#recomputeGridSize
	     */
	    value: function recomputeRowHeights() {
	      this.refs.Grid.recomputeGridSize();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var className = _props.className;
	      var height = _props.height;
	      var noRowsRenderer = _props.noRowsRenderer;
	      var onRowsRendered = _props.onRowsRendered;
	      var _onScroll = _props.onScroll;
	      var rowHeight = _props.rowHeight;
	      var rowRenderer = _props.rowRenderer;
	      var overscanRowsCount = _props.overscanRowsCount;
	      var rowsCount = _props.rowsCount;
	      var scrollToIndex = _props.scrollToIndex;
	      var scrollTop = _props.scrollTop;
	      var width = _props.width;


	      var classNames = (0, _classnames2.default)('VirtualScroll', className);

	      return _react2.default.createElement(_Grid2.default, {
	        ref: 'Grid',
	        className: classNames,
	        columnWidth: width,
	        columnsCount: 1,
	        height: height,
	        noContentRenderer: noRowsRenderer,
	        onScroll: function onScroll(_ref) {
	          var clientHeight = _ref.clientHeight;
	          var scrollHeight = _ref.scrollHeight;
	          var scrollTop = _ref.scrollTop;
	          return _onScroll({ clientHeight: clientHeight, scrollHeight: scrollHeight, scrollTop: scrollTop });
	        },
	        onSectionRendered: function onSectionRendered(_ref2) {
	          var rowOverscanStartIndex = _ref2.rowOverscanStartIndex;
	          var rowOverscanStopIndex = _ref2.rowOverscanStopIndex;
	          var rowStartIndex = _ref2.rowStartIndex;
	          var rowStopIndex = _ref2.rowStopIndex;
	          return onRowsRendered({
	            overscanStartIndex: rowOverscanStartIndex,
	            overscanStopIndex: rowOverscanStopIndex,
	            startIndex: rowStartIndex,
	            stopIndex: rowStopIndex
	          });
	        },
	        overscanRowsCount: overscanRowsCount,
	        renderCell: function renderCell(_ref3) {
	          var columnIndex = _ref3.columnIndex;
	          var rowIndex = _ref3.rowIndex;
	          return rowRenderer(rowIndex);
	        },
	        rowHeight: rowHeight,
	        rowsCount: rowsCount,
	        scrollToRow: scrollToIndex,
	        scrollTop: scrollTop,
	        width: width
	      });
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
	    }
	  }]);

	  return VirtualScroll;
	}(_react.Component);

	VirtualScroll.propTypes = {
	  /** Optional CSS class name */
	  className: _react.PropTypes.string,

	  /** Height constraint for list (determines how many actual rows are rendered) */
	  height: _react.PropTypes.number.isRequired,

	  /** Optional renderer to be used in place of rows when rowsCount is 0 */
	  noRowsRenderer: _react.PropTypes.func.isRequired,

	  /**
	   * Callback invoked with information about the slice of rows that were just rendered.
	   * ({ startIndex, stopIndex }): void
	   */
	  onRowsRendered: _react.PropTypes.func.isRequired,

	  /**
	   * Number of rows to render above/below the visible bounds of the list.
	   * These rows can help for smoother scrolling on touch devices.
	   */
	  overscanRowsCount: _react.PropTypes.number.isRequired,

	  /**
	   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
	   * This callback can be used to sync scrolling between lists, tables, or grids.
	   * ({ clientHeight, scrollHeight, scrollTop }): void
	   */
	  onScroll: _react.PropTypes.func.isRequired,

	  /**
	   * Either a fixed row height (number) or a function that returns the height of a row given its index.
	   * (index: number): number
	   */
	  rowHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]).isRequired,

	  /** Responsbile for rendering a row given an index */
	  rowRenderer: _react.PropTypes.func.isRequired,

	  /** Number of rows in list. */
	  rowsCount: _react.PropTypes.number.isRequired,

	  /** Row index to ensure visible (by forcefully scrolling if necessary) */
	  scrollToIndex: _react.PropTypes.number,

	  /** Vertical offset. */
	  scrollTop: _react.PropTypes.number,

	  /** Width of list */
	  width: _react.PropTypes.number.isRequired
	};
	VirtualScroll.defaultProps = {
	  noRowsRenderer: function noRowsRenderer() {
	    return null;
	  },
	  onRowsRendered: function onRowsRendered() {
	    return null;
	  },
	  onScroll: function onScroll() {
	    return null;
	  },
	  overscanRowsCount: 10
	};
	exports.default = VirtualScroll;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = Dimensions;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var style = {
	  width: '100%',
	  height: '100%',
	  padding: 0,
	  border: 0
	};

	function defaultGetWidth(element) {
	  return element.clientWidth;
	}

	function defaultGetHeight(element) {
	  return element.clientHeight;
	}

	/**
	 * Wraps a react component and adds properties `containerHeight` and
	 * `containerWidth`. Useful for responsive design. Properties update on
	 * window resize. **Note** that the parent element must have either a
	 * height or a width, or nothing will be rendered
	 *
	 * Can be used as a
	 * [higher-order component](http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#property-initializers)
	 * or as an [ES7 class decorator](https://github.com/wycats/javascript-decorators)
	 * (see examples)
	 *
	 * v1.0.0 is for React v0.14 only. Use ^0.1.0 for React v0.13
	 *
	 * @param {object} [options] Options
	 * @param {function} [options.getHeight] `getHeight(element)` should return element
	 * height, where element is the wrapper div. Defaults to `element.clientHeight`
	 * @param {function} [options.getWidth]  `getWidth(element)` should return element
	 * width, where element is the wrapper div. Defaults to `element.clientWidth`
	 * @return {function}                   Returns a higher-order component that can be
	 * used to enhance a react component `Dimensions()(MyComponent)`
	 *
	 * ### Live Example
	 *
	 * Will open a browser window for localhost:9966
	 *
	 * `npm i && npm i react react-dom && npm start`
	 *
	 * @example
	 * // ES2015
	 * import React from 'react'
	 * import Dimensions from 'react-dimensions'
	 *
	 * class MyComponent extends React.Component {
	 *   render() (
	 *     <div
	 *       containerWidth={this.props.containerWidth}
	 *       containerHeight={this.props.containerHeight}
	 *     >
	 *     </div>
	 *   )
	 * }
	 *
	 * export default Dimensions()(MyComponent) // Enhanced component
	 *
	 * @example
	 * // ES5
	 * var React = require('react')
	 * var Dimensions = require('react-dimensions')
	 *
	 * var MyComponent = React.createClass({
	 *   render: function() {(
	 *     <div
	 *       containerWidth={this.props.containerWidth}
	 *       containerHeight={this.props.containerHeight}
	 *     >
	 *     </div>
	 *   )}
	 * }
	 *
	 * module.exports = Dimensions()(MyComponent) // Enhanced component
	 *
	 */

	function Dimensions() {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var _ref$getHeight = _ref.getHeight;
	  var getHeight = _ref$getHeight === undefined ? defaultGetHeight : _ref$getHeight;
	  var _ref$getWidth = _ref.getWidth;
	  var getWidth = _ref$getWidth === undefined ? defaultGetWidth : _ref$getWidth;

	  return function (ComposedComponent) {
	    return (function (_React$Component) {
	      _inherits(DimensionsHOC, _React$Component);

	      function DimensionsHOC() {
	        var _this = this;

	        _classCallCheck(this, DimensionsHOC);

	        _React$Component.apply(this, arguments);

	        this.state = {};

	        this.updateDimensions = function () {
	          var container = _this.refs.container;
	          if (!container) {
	            throw new Error('Cannot find container div');
	          }
	          _this.setState({
	            containerWidth: getWidth(container),
	            containerHeight: getHeight(container)
	          });
	        };

	        this.onResize = function () {
	          if (_this.rqf) return;
	          _this.rqf = window.requestAnimationFrame(function () {
	            _this.rqf = null;
	            _this.updateDimensions();
	          });
	        };
	      }

	      DimensionsHOC.prototype.componentDidMount = function componentDidMount() {
	        this.updateDimensions();
	        window.addEventListener('resize', this.onResize, false);
	      };

	      DimensionsHOC.prototype.componentWillUnmount = function componentWillUnmount() {
	        window.removeEventListener('resize', this.onResize);
	      };

	      DimensionsHOC.prototype.render = function render() {
	        return _react2['default'].createElement(
	          'div',
	          { style: style, ref: 'container' },
	          (this.state.containerWidth || this.state.containerHeight) && _react2['default'].createElement(ComposedComponent, _extends({}, this.state, this.props))
	        );
	      };

	      return DimensionsHOC;
	    })(_react2['default'].Component);
	  };
	}

	module.exports = exports['default'];

	// ES7 Class properties
	// http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#property-initializers

	// Using arrow functions and ES7 Class properties to autobind
	// http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#arrow-functions


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(45)() ? Set : __webpack_require__(46);


/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var set, iterator, result;
		if (typeof Set !== 'function') return false;
		set = new Set(['raz', 'dwa', 'trzy']);
		if (String(set) !== '[object Set]') return false;
		if (set.size !== 3) return false;
		if (typeof set.add !== 'function') return false;
		if (typeof set.clear !== 'function') return false;
		if (typeof set.delete !== 'function') return false;
		if (typeof set.entries !== 'function') return false;
		if (typeof set.forEach !== 'function') return false;
		if (typeof set.has !== 'function') return false;
		if (typeof set.keys !== 'function') return false;
		if (typeof set.values !== 'function') return false;

		iterator = set.values();
		result = iterator.next();
		if (result.done !== false) return false;
		if (result.value !== 'raz') return false;

		return true;
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear          = __webpack_require__(47)
	  , eIndexOf       = __webpack_require__(49)
	  , setPrototypeOf = __webpack_require__(55)
	  , callable       = __webpack_require__(60)
	  , d              = __webpack_require__(61)
	  , ee             = __webpack_require__(73)
	  , Symbol         = __webpack_require__(74)
	  , iterator       = __webpack_require__(79)
	  , forOf          = __webpack_require__(83)
	  , Iterator       = __webpack_require__(93)
	  , isNative       = __webpack_require__(94)

	  , call = Function.prototype.call
	  , defineProperty = Object.defineProperty, getPrototypeOf = Object.getPrototypeOf
	  , SetPoly, getValues, NativeSet;

	if (isNative) NativeSet = Set;

	module.exports = SetPoly = function Set(/*iterable*/) {
		var iterable = arguments[0], self;
		if (!(this instanceof SetPoly)) throw new TypeError('Constructor requires \'new\'');
		if (isNative && setPrototypeOf) self = setPrototypeOf(new NativeSet(), getPrototypeOf(this));
		else self = this;
		if (iterable != null) iterator(iterable);
		defineProperty(self, '__setData__', d('c', []));
		if (!iterable) return self;
		forOf(iterable, function (value) {
			if (eIndexOf.call(this, value) !== -1) return;
			this.push(value);
		}, self.__setData__);
		return self;
	};

	if (isNative) {
		if (setPrototypeOf) setPrototypeOf(SetPoly, NativeSet);
		SetPoly.prototype = Object.create(NativeSet.prototype, { constructor: d(SetPoly) });
	}

	ee(Object.defineProperties(SetPoly.prototype, {
		add: d(function (value) {
			if (this.has(value)) return this;
			this.emit('_add', this.__setData__.push(value) - 1, value);
			return this;
		}),
		clear: d(function () {
			if (!this.__setData__.length) return;
			clear.call(this.__setData__);
			this.emit('_clear');
		}),
		delete: d(function (value) {
			var index = eIndexOf.call(this.__setData__, value);
			if (index === -1) return false;
			this.__setData__.splice(index, 1);
			this.emit('_delete', index, value);
			return true;
		}),
		entries: d(function () { return new Iterator(this, 'key+value'); }),
		forEach: d(function (cb/*, thisArg*/) {
			var thisArg = arguments[1], iterator, result, value;
			callable(cb);
			iterator = this.values();
			result = iterator._next();
			while (result !== undefined) {
				value = iterator._resolve(result);
				call.call(cb, thisArg, value, value, this);
				result = iterator._next();
			}
		}),
		has: d(function (value) {
			return (eIndexOf.call(this.__setData__, value) !== -1);
		}),
		keys: d(getValues = function () { return this.values(); }),
		size: d.gs(function () { return this.__setData__.length; }),
		values: d(function () { return new Iterator(this); }),
		toString: d(function () { return '[object Set]'; })
	}));
	defineProperty(SetPoly.prototype, Symbol.iterator, d(getValues));
	defineProperty(SetPoly.prototype, Symbol.toStringTag, d('c', 'Set'));


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// Inspired by Google Closure:
	// http://closure-library.googlecode.com/svn/docs/
	// closure_goog_array_array.js.html#goog.array.clear

	'use strict';

	var value = __webpack_require__(48);

	module.exports = function () {
		value(this).length = 0;
		return this;
	};


/***/ },
/* 48 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toPosInt = __webpack_require__(50)
	  , value    = __webpack_require__(48)

	  , indexOf = Array.prototype.indexOf
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (searchElement/*, fromIndex*/) {
		var i, l, fromIndex, val;
		if (searchElement === searchElement) { //jslint: ignore
			return indexOf.apply(this, arguments);
		}

		l = toPosInt(value(this).length);
		fromIndex = arguments[1];
		if (isNaN(fromIndex)) fromIndex = 0;
		else if (fromIndex >= 0) fromIndex = floor(fromIndex);
		else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

		for (i = fromIndex; i < l; ++i) {
			if (hasOwnProperty.call(this, i)) {
				val = this[i];
				if (val !== val) return i; //jslint: ignore
			}
		}
		return -1;
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(51)

	  , max = Math.max;

	module.exports = function (value) { return max(0, toInteger(value)); };


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sign = __webpack_require__(52)

	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (value) {
		if (isNaN(value)) return 0;
		value = Number(value);
		if ((value === 0) || !isFinite(value)) return value;
		return sign(value) * floor(abs(value));
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(53)()
		? Math.sign
		: __webpack_require__(54);


/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var sign = Math.sign;
		if (typeof sign !== 'function') return false;
		return ((sign(10) === 1) && (sign(-20) === -1));
	};


/***/ },
/* 54 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		value = Number(value);
		if (isNaN(value) || (value === 0)) return value;
		return (value > 0) ? 1 : -1;
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(56)()
		? Object.setPrototypeOf
		: __webpack_require__(57);


/***/ },
/* 56 */
/***/ function(module, exports) {

	'use strict';

	var create = Object.create, getPrototypeOf = Object.getPrototypeOf
	  , x = {};

	module.exports = function (/*customCreate*/) {
		var setPrototypeOf = Object.setPrototypeOf
		  , customCreate = arguments[0] || create;
		if (typeof setPrototypeOf !== 'function') return false;
		return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// Big thanks to @WebReflection for sorting this out
	// https://gist.github.com/WebReflection/5593554

	'use strict';

	var isObject      = __webpack_require__(58)
	  , value         = __webpack_require__(48)

	  , isPrototypeOf = Object.prototype.isPrototypeOf
	  , defineProperty = Object.defineProperty
	  , nullDesc = { configurable: true, enumerable: false, writable: true,
			value: undefined }
	  , validate;

	validate = function (obj, prototype) {
		value(obj);
		if ((prototype === null) || isObject(prototype)) return obj;
		throw new TypeError('Prototype must be null or an object');
	};

	module.exports = (function (status) {
		var fn, set;
		if (!status) return null;
		if (status.level === 2) {
			if (status.set) {
				set = status.set;
				fn = function (obj, prototype) {
					set.call(validate(obj, prototype), prototype);
					return obj;
				};
			} else {
				fn = function (obj, prototype) {
					validate(obj, prototype).__proto__ = prototype;
					return obj;
				};
			}
		} else {
			fn = function self(obj, prototype) {
				var isNullBase;
				validate(obj, prototype);
				isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
				if (isNullBase) delete self.nullPolyfill.__proto__;
				if (prototype === null) prototype = self.nullPolyfill;
				obj.__proto__ = prototype;
				if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
				return obj;
			};
		}
		return Object.defineProperty(fn, 'level', { configurable: false,
			enumerable: false, writable: false, value: status.level });
	}((function () {
		var x = Object.create(null), y = {}, set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(x, y);
			} catch (ignore) { }
			if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
		}

		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 2 };

		x = {};
		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 1 };

		return false;
	}())));

	__webpack_require__(59);


/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';

	var map = { function: true, object: true };

	module.exports = function (x) {
		return ((x != null) && map[typeof x]) || false;
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

	'use strict';

	var create = Object.create, shim;

	if (!__webpack_require__(56)()) {
		shim = __webpack_require__(57);
	}

	module.exports = (function () {
		var nullObject, props, desc;
		if (!shim) return create;
		if (shim.level !== 1) return create;

		nullObject = {};
		props = {};
		desc = { configurable: false, enumerable: false, writable: true,
			value: undefined };
		Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
			if (name === '__proto__') {
				props[name] = { configurable: true, enumerable: false, writable: true,
					value: undefined };
				return;
			}
			props[name] = desc;
		});
		Object.defineProperties(nullObject, props);

		Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
			enumerable: false, writable: false, value: nullObject });

		return function (prototype, props) {
			return create((prototype === null) ? nullObject : prototype, props);
		};
	}());


/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(62)
	  , normalizeOpts = __webpack_require__(68)
	  , isCallable    = __webpack_require__(69)
	  , contains      = __webpack_require__(70)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(63)()
		? Object.assign
		: __webpack_require__(64);


/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(65)
	  , value = __webpack_require__(48)

	  , max = Math.max;

	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(66)()
		? Object.keys
		: __webpack_require__(67);


/***/ },
/* 66 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 69 */
/***/ function(module, exports) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(71)()
		? String.prototype.contains
		: __webpack_require__(72);


/***/ },
/* 71 */
/***/ function(module, exports) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 72 */
/***/ function(module, exports) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d        = __webpack_require__(61)
	  , callable = __webpack_require__(60)

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(75)() ? Symbol : __webpack_require__(76);


/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }
		if (typeof Symbol.iterator === 'symbol') return true;

		// Return 'true' for polyfills
		if (typeof Symbol.isConcatSpreadable !== 'object') return false;
		if (typeof Symbol.iterator !== 'object') return false;
		if (typeof Symbol.toPrimitive !== 'object') return false;
		if (typeof Symbol.toStringTag !== 'object') return false;
		if (typeof Symbol.unscopables !== 'object') return false;

		return true;
	};


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it_

	'use strict';

	var d              = __webpack_require__(61)
	  , validateSymbol = __webpack_require__(77)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null);

	if (typeof Symbol === 'function') NativeSymbol = Symbol;

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// If there's native implementation of given symbol, let's fallback to it
		// to ensure proper interoperability with other native functions e.g. Array.from
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('',
		function () { return validateSymbol(this); }));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(78);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 78 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false;
	};


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isIterable = __webpack_require__(80);

	module.exports = function (value) {
		if (!isIterable(value)) throw new TypeError(value + " is not iterable");
		return value;
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(81)
	  , isString       = __webpack_require__(82)
	  , iteratorSymbol = __webpack_require__(74).iterator

	  , isArray = Array.isArray;

	module.exports = function (value) {
		if (value == null) return false;
		if (isArray(value)) return true;
		if (isString(value)) return true;
		if (isArguments(value)) return true;
		return (typeof value[iteratorSymbol] === 'function');
	};


/***/ },
/* 81 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call((function () { return arguments; }()));

	module.exports = function (x) { return (toString.call(x) === id); };


/***/ },
/* 82 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call('');

	module.exports = function (x) {
		return (typeof x === 'string') || (x && (typeof x === 'object') &&
			((x instanceof String) || (toString.call(x) === id))) || false;
	};


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments = __webpack_require__(81)
	  , callable    = __webpack_require__(60)
	  , isString    = __webpack_require__(82)
	  , get         = __webpack_require__(84)

	  , isArray = Array.isArray, call = Function.prototype.call
	  , some = Array.prototype.some;

	module.exports = function (iterable, cb/*, thisArg*/) {
		var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
		if (isArray(iterable) || isArguments(iterable)) mode = 'array';
		else if (isString(iterable)) mode = 'string';
		else iterable = get(iterable);

		callable(cb);
		doBreak = function () { broken = true; };
		if (mode === 'array') {
			some.call(iterable, function (value) {
				call.call(cb, thisArg, value, doBreak);
				if (broken) return true;
			});
			return;
		}
		if (mode === 'string') {
			l = iterable.length;
			for (i = 0; i < l; ++i) {
				char = iterable[i];
				if ((i + 1) < l) {
					code = char.charCodeAt(0);
					if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
				}
				call.call(cb, thisArg, char, doBreak);
				if (broken) break;
			}
			return;
		}
		result = iterable.next();

		while (!result.done) {
			call.call(cb, thisArg, result.value, doBreak);
			if (broken) return;
			result = iterable.next();
		}
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(81)
	  , isString       = __webpack_require__(82)
	  , ArrayIterator  = __webpack_require__(85)
	  , StringIterator = __webpack_require__(92)
	  , iterable       = __webpack_require__(79)
	  , iteratorSymbol = __webpack_require__(74).iterator;

	module.exports = function (obj) {
		if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
		if (isArguments(obj)) return new ArrayIterator(obj);
		if (isString(obj)) return new StringIterator(obj);
		return new ArrayIterator(obj);
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf = __webpack_require__(55)
	  , contains       = __webpack_require__(70)
	  , d              = __webpack_require__(61)
	  , Iterator       = __webpack_require__(86)

	  , defineProperty = Object.defineProperty
	  , ArrayIterator;

	ArrayIterator = module.exports = function (arr, kind) {
		if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
		Iterator.call(this, arr);
		if (!kind) kind = 'value';
		else if (contains.call(kind, 'key+value')) kind = 'key+value';
		else if (contains.call(kind, 'key')) kind = 'key';
		else kind = 'value';
		defineProperty(this, '__kind__', d('', kind));
	};
	if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

	ArrayIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(ArrayIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__list__[i];
			if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
			return i;
		}),
		toString: d(function () { return '[object Array Iterator]'; })
	});


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear    = __webpack_require__(47)
	  , assign   = __webpack_require__(62)
	  , callable = __webpack_require__(60)
	  , value    = __webpack_require__(48)
	  , d        = __webpack_require__(61)
	  , autoBind = __webpack_require__(87)
	  , Symbol   = __webpack_require__(74)

	  , defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , Iterator;

	module.exports = Iterator = function (list, context) {
		if (!(this instanceof Iterator)) return new Iterator(list, context);
		defineProperties(this, {
			__list__: d('w', value(list)),
			__context__: d('w', context),
			__nextIndex__: d('w', 0)
		});
		if (!context) return;
		callable(context.on);
		context.on('_add', this._onAdd);
		context.on('_delete', this._onDelete);
		context.on('_clear', this._onClear);
	};

	defineProperties(Iterator.prototype, assign({
		constructor: d(Iterator),
		_next: d(function () {
			var i;
			if (!this.__list__) return;
			if (this.__redo__) {
				i = this.__redo__.shift();
				if (i !== undefined) return i;
			}
			if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
			this._unBind();
		}),
		next: d(function () { return this._createResult(this._next()); }),
		_createResult: d(function (i) {
			if (i === undefined) return { done: true, value: undefined };
			return { done: false, value: this._resolve(i) };
		}),
		_resolve: d(function (i) { return this.__list__[i]; }),
		_unBind: d(function () {
			this.__list__ = null;
			delete this.__redo__;
			if (!this.__context__) return;
			this.__context__.off('_add', this._onAdd);
			this.__context__.off('_delete', this._onDelete);
			this.__context__.off('_clear', this._onClear);
			this.__context__ = null;
		}),
		toString: d(function () { return '[object Iterator]'; })
	}, autoBind({
		_onAdd: d(function (index) {
			if (index >= this.__nextIndex__) return;
			++this.__nextIndex__;
			if (!this.__redo__) {
				defineProperty(this, '__redo__', d('c', [index]));
				return;
			}
			this.__redo__.forEach(function (redo, i) {
				if (redo >= index) this.__redo__[i] = ++redo;
			}, this);
			this.__redo__.push(index);
		}),
		_onDelete: d(function (index) {
			var i;
			if (index >= this.__nextIndex__) return;
			--this.__nextIndex__;
			if (!this.__redo__) return;
			i = this.__redo__.indexOf(index);
			if (i !== -1) this.__redo__.splice(i, 1);
			this.__redo__.forEach(function (redo, i) {
				if (redo > index) this.__redo__[i] = --redo;
			}, this);
		}),
		_onClear: d(function () {
			if (this.__redo__) clear.call(this.__redo__);
			this.__nextIndex__ = 0;
		})
	})));

	defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
		return this;
	}));
	defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var copy       = __webpack_require__(88)
	  , map        = __webpack_require__(89)
	  , callable   = __webpack_require__(60)
	  , validValue = __webpack_require__(48)

	  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , define;

	define = function (name, desc, bindTo) {
		var value = validValue(desc) && callable(desc.value), dgs;
		dgs = copy(desc);
		delete dgs.writable;
		delete dgs.value;
		dgs.get = function () {
			if (hasOwnProperty.call(this, name)) return value;
			desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
			defineProperty(this, name, desc);
			return this[name];
		};
		return dgs;
	};

	module.exports = function (props/*, bindTo*/) {
		var bindTo = arguments[1];
		return map(props, function (desc, name) {
			return define(name, desc, bindTo);
		});
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(62)
	  , value  = __webpack_require__(48);

	module.exports = function (obj) {
		var copy = Object(value(obj));
		if (copy !== obj) return copy;
		return assign({}, obj);
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var callable = __webpack_require__(60)
	  , forEach  = __webpack_require__(90)

	  , call = Function.prototype.call;

	module.exports = function (obj, cb/*, thisArg*/) {
		var o = {}, thisArg = arguments[2];
		callable(cb);
		forEach(obj, function (value, key, obj, index) {
			o[key] = call.call(cb, thisArg, value, key, obj, index);
		});
		return o;
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(91)('forEach');


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// Internal method, used by iteration functions.
	// Calls a function for each key-value pair found in object
	// Optionally takes compareFn to iterate object in specific order

	'use strict';

	var callable = __webpack_require__(60)
	  , value    = __webpack_require__(48)

	  , bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys
	  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

	module.exports = function (method, defVal) {
		return function (obj, cb/*, thisArg, compareFn*/) {
			var list, thisArg = arguments[2], compareFn = arguments[3];
			obj = Object(value(obj));
			callable(cb);

			list = keys(obj);
			if (compareFn) {
				list.sort((typeof compareFn === 'function') ? bind.call(compareFn, obj) : undefined);
			}
			if (typeof method !== 'function') method = list[method];
			return call.call(method, list, function (key, index) {
				if (!propertyIsEnumerable.call(obj, key)) return defVal;
				return call.call(cb, thisArg, obj[key], key, obj, index);
			});
		};
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// Thanks @mathiasbynens
	// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

	'use strict';

	var setPrototypeOf = __webpack_require__(55)
	  , d              = __webpack_require__(61)
	  , Iterator       = __webpack_require__(86)

	  , defineProperty = Object.defineProperty
	  , StringIterator;

	StringIterator = module.exports = function (str) {
		if (!(this instanceof StringIterator)) return new StringIterator(str);
		str = String(str);
		Iterator.call(this, str);
		defineProperty(this, '__length__', d('', str.length));

	};
	if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

	StringIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(StringIterator),
		_next: d(function () {
			if (!this.__list__) return;
			if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
			this._unBind();
		}),
		_resolve: d(function (i) {
			var char = this.__list__[i], code;
			if (this.__nextIndex__ === this.__length__) return char;
			code = char.charCodeAt(0);
			if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
			return char;
		}),
		toString: d(function () { return '[object String Iterator]'; })
	});


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf    = __webpack_require__(55)
	  , contains          = __webpack_require__(70)
	  , d                 = __webpack_require__(61)
	  , Iterator          = __webpack_require__(86)
	  , toStringTagSymbol = __webpack_require__(74).toStringTag

	  , defineProperty = Object.defineProperty
	  , SetIterator;

	SetIterator = module.exports = function (set, kind) {
		if (!(this instanceof SetIterator)) return new SetIterator(set, kind);
		Iterator.call(this, set.__setData__, set);
		if (!kind) kind = 'value';
		else if (contains.call(kind, 'key+value')) kind = 'key+value';
		else kind = 'value';
		defineProperty(this, '__kind__', d('', kind));
	};
	if (setPrototypeOf) setPrototypeOf(SetIterator, Iterator);

	SetIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(SetIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__list__[i];
			return [this.__list__[i], this.__list__[i]];
		}),
		toString: d(function () { return '[object Set Iterator]'; })
	});
	defineProperty(SetIterator.prototype, toStringTagSymbol, d('c', 'Set Iterator'));


/***/ },
/* 94 */
/***/ function(module, exports) {

	// Exports true if environment provides native `Set` implementation,
	// whatever that is.

	'use strict';

	module.exports = (function () {
		if (typeof Set === 'undefined') return false;
		return (Object.prototype.toString.call(Set.prototype) === '[object Set]');
	}());


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _underscore = __webpack_require__(4);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _reactImmutableRenderMixin = __webpack_require__(6);

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
					var value = void 0;

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
							type: 'text',
							autoComplete: this.props.autoComplete,
							placeholder: this.props.placeholder,
							defaultValue: this.props.defaultValue,
							onKeyUp: this.onChange
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

	exports['default'] = SearchField;
	module.exports = exports['default'];

/***/ },
/* 96 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = {
		'SPA': {
			all: 'Seleccionar Todo',
			none: 'Deseleccionar Todo',
			loading: 'Cargando...',
			noData: 'No se encontró ningún elemento',
			errorIdField: 'No se pudo cambiar el `idField´, el campo',
			errorDisplayField: 'No se pudo cambiar el `displayField´, el campo',
			errorData: 'no existe en el array de datos o no ha cambiado'
		},
		'ENG': {
			all: 'Select All',
			none: 'Unselect All',
			loading: 'Loading...',
			noData: 'No data found',
			errorIdField: "Couldn\'t change the `idField´, the field",
			errorDisplayField: "Couldn\'t change the `displayField´, the field",
			errorData: 'doesn\'t exist in the data array or has no changes'
		}
	};
	module.exports = exports['default'];

/***/ },
/* 97 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var charMap = {
		'a': ['á', 'Á', 'à', 'À', 'ã', 'Ã', 'â', 'Â', 'ä', 'Ä', 'å', 'Å', 'ā', 'Ā', 'ą', 'Ą'],
		'e': ['é', 'É', 'è', 'È', 'ê', 'Ê', 'ë', 'Ë', 'ē', 'Ē', 'ė', 'Ė', 'ę', 'Ę'],
		'i': ['î', 'Î', 'í', 'Í', 'ì', 'Ì', 'ï', 'Ï', 'ī', 'Ī', 'į', 'Į'],
		'l': ['ł', 'Ł'],
		'o': ['ô', 'Ô', 'ò', 'Ò', 'ø', 'Ø', 'ō', 'Ō', 'ó', 'Ó', 'õ', 'Õ', 'ö', 'Ö'],
		'u': ['û', 'Û', 'ú', 'Ú', 'ù', 'Ù', 'ü', 'Ü', 'ū', 'Ū'],
		'c': ['ç', 'Ç', 'č', 'Č', 'ć', 'Ć'],
		's': ['ś', 'Ś', 'š', 'Š'],
		'z': ['ź', 'Ź', 'ż', 'Ż'],
		'': ['@', '#', '~', '$', '!', 'º', '|', '"', '·', '%', '&', '¬', '/', '(', ')', '=', '?', '¿', '¡', '*', '+', '^', '`', '-', '´', '{', '}', 'ç', ';', ':', '.']
	};

	exports['default'] = {
		normalize: function normalize(value) {
			var parseToLower = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

			var rex = null;

			for (var char in charMap) {
				rex = new RegExp('[' + charMap[char].toString() + ']', 'g');

				try {
					value = value.replace(rex, char);
				} catch (e) {
					console.log('error', value);
				}
			}
			return parseToLower ? value.toLowerCase() : value;
		}
	};
	module.exports = exports['default'];

/***/ },
/* 98 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);