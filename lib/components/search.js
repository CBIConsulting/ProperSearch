'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _searchList = require('./searchList');

var _searchList2 = _interopRequireDefault(_searchList);

var _reactPropersearchField = require('react-propersearch-field');

var _reactPropersearchField2 = _interopRequireDefault(_reactPropersearchField);

var _messages2 = require('../lang/messages');

var _messages3 = _interopRequireDefault(_messages2);

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

var _reactImmutableRenderMixin = require('react-immutable-render-mixin');

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
		data: [],
		rawdata: null, // Case you want to use your own inmutable data. Read prepareData() method for more info.
		indexed: null, // Case you want to use your own inmutable data. Read prepareData() method for more info.
		messages: _messages3['default'],
		lang: 'ENG',
		rowFormater: null, // function to format values in render
		defaultSelection: null,
		hiddenSelection: null,
		multiSelect: false,
		listWidth: null,
		listHeight: 200,
		listRowHeight: 26,
		afterSelect: null, // Function Get selection and data
		afterSelectGetSelection: null, // Function Get just selection (no data)
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
		filterField: null, // By default it will be the displayField
		allowsEmptySelection: false };
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
// Put this to true to get a diferent ToolBar that allows select empty

var Search = function (_React$Component) {
	_inherits(Search, _React$Component);

	function Search(props) {
		_classCallCheck(this, Search);

		var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

		var preparedData = _this.prepareData(null, props.idField, false, props.displayField);

		_this.state = {
			data: preparedData.data, // Data to work with (Inmutable)
			initialData: preparedData.data, // Same data as initial state.data but this data never changes. (Inmutable)
			rawData: preparedData.rawdata, // Received data without any modfication (Inmutable)
			indexedData: preparedData.indexed, // Received data indexed (No Inmutable)
			initialIndexed: preparedData.indexed, // When data get filtered keep the full indexed
			idField: props.idField, // To don't update the idField if that field doesn't exist in the fields of data array
			displayField: props.displayField, // same
			selection: new Set(),
			allSelected: false,
			selectionApplied: false, // If the selection has been aplied to the data (mostly for some cases of updating props data)
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
			var _this2 = this;

			var stateChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.state, nextState);
			var propsChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(this.props, nextProps);
			var somethingChanged = propsChanged || stateChanged;

			// Update row indexes when data get filtered
			if (this.state.data.size != nextState.data.size) {
				var parsed = undefined,
				    indexed = undefined,
				    data = undefined;

				if (nextState.ready) {
					if (nextState.data.size === 0) {
						data = nextState.data;
						indexed = {};
					} else {
						parsed = this.prepareData(nextState.data, this.state.idField, true, this.state.displayField); // Force rebuild indexes etc
						data = parsed.data;
						indexed = parsed.indexed;
					}

					this.setState({
						data: data,
						indexedData: indexed,
						allSelected: this.isAllSelected(data, nextState.selection)
					});
				} else {
					var selection = nextProps.defaultSelection;
					if (!nextProps.multiSelect) selection = nextState.selection.values().next().value || null;

					// props data has been changed in the last call to this method
					this.setDefaultSelection(selection);
					if (_underscore2['default'].isNull(selection) || selection.length === 0) this.setState({ ready: true }); // No def selection so then ready
				}

				return false;
			}

			if (propsChanged) {
				var _ret = function () {
					var dataChanged = !(0, _reactImmutableRenderMixin.shallowEqualImmutable)(_this2.props.data, nextProps.data);
					var idFieldChanged = _this2.props.idField != nextProps.idField,
					    displayFieldChanged = _this2.props.displayField != nextProps.displayField;
					var selectionChanged = false,
					    nextSelection = new Set(nextProps.defaultSelection),
					    selection = null;

					if (_this2.state.selection.size != nextSelection.size) {
						selectionChanged = true;
						selection = nextProps.defaultSelection;
					} else {
						_this2.state.selection.forEach(function (element) {
							if (!nextSelection.has(element)) {
								selectionChanged = true;
								selection = nextProps.defaultSelection;
								return true;
							}
						});
					}

					if (!nextProps.multiSelect && (nextSelection.size > 1 || _this2.state.selection.size > 1)) {
						selection = nextSelection.size > 1 ? nextProps.defaultSelection : _this2.state.selection.values().next().value;
						if (_underscore2['default'].isArray(selection)) selection = selection[0];
					}

					if (idFieldChanged || displayFieldChanged) {
						var fieldsSet = new Set(_underscore2['default'].keys(nextProps.data[0]));
						var _messages = _this2.props.messages[_this2.props.lang];

						// Change idField / displayField but that field doesn't exist in the data
						if (!fieldsSet.has(nextProps.idField) || !fieldsSet.has(nextProps.displayField)) {
							if (!fieldsSet.has(nextProps.idField)) console.error(_messages.errorIdField + ' ' + nextProps.idField + ' ' + _messages.errorData);else console.error(_messages.errorDisplayField + ' ' + nextProps.idField + ' ' + _messages.errorData);

							return {
								v: false
							};
						} else {
							// New idField &&//|| displayField exist in data array fields
							if (dataChanged) {
								_cache2['default'].flush('search_list');
								var preparedData = _this2.prepareData(nextProps.data, nextProps.idField, false, nextProps.displayField);

								_this2.setState({
									data: preparedData.data,
									initialData: preparedData.data,
									rawData: preparedData.rawdata,
									indexedData: preparedData.indexed,
									initialIndexed: preparedData.indexed,
									idField: nextProps.idField,
									displayField: nextProps.displayField,
									ready: false,
									selectionApplied: false
								}, _this2.setDefaultSelection(selection));
							} else {
								var initialIndexed = null,
								    _indexed = null;

								// If the id field change then the indexed data has to be changed but not for display
								if (displayFieldChanged) {
									initialIndexed = _this2.state.initialIndexed;
									_indexed = _this2.state.indexedData;
								} else {
									initialIndexed = _underscore2['default'].indexBy(_this2.state.initialData.toJSON(), nextProps.idField);
									_indexed = _underscore2['default'].indexBy(_this2.state.data.toJSON(), nextProps.idField);
								}

								_this2.setState({
									indexedData: _indexed,
									initialIndexed: initialIndexed,
									idField: nextProps.idField,
									displayField: nextProps.displayField,
									ready: false,
									selectionApplied: false
								});
							}
							return {
								v: false
							};
						}
					}

					if (dataChanged) {
						_cache2['default'].flush('search_list');
						var _preparedData = _this2.prepareData(nextProps.data, nextProps.idField, false, nextProps.displayField);

						_this2.setState({
							data: _preparedData.data,
							initialData: _preparedData.data,
							rawData: _preparedData.rawdata,
							indexedData: _preparedData.indexed,
							initialIndexed: _preparedData.indexed,
							ready: false,
							selectionApplied: false
						}, _this2.setDefaultSelection(selection));

						return {
							v: false
						};
					}

					if (selectionChanged) {
						// Default selection does nothing if the selection is null so in that case update the state to restart selection
						if (!_underscore2['default'].isNull(selection)) {
							_this2.setDefaultSelection(selection);
						} else {
							_this2.setState({
								selection: new Set(),
								allSelected: false,
								ready: true
							});
						}

						return {
							v: false
						};
					}
				}();

				if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
			}

			if (!nextState.ready) {
				this.setState({
					ready: true
				});

				return false;
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
			// Selection
			if (this.props.multiSelect) {
				if (nextState.selection.size !== this.state.selection.size || !nextState.selectionApplied && nextState.selection.size > 0) {
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
			var _this3 = this;

			var newAllSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
				var indexedKeys = new Set(_underscore2['default'].keys(newIndexed));

				if (!_underscore2['default'].isNull(oldId) && indexedKeys.has(oldId)) {
					newIndexed[oldId]._selected = false; // Update indexed data
					rowIndex = newIndexed[oldId]._rowIndex; // Get data index
					if (newData.get(rowIndex)) {
						rdata = newData.get(rowIndex).set('_selected', false); // Change the row in that index
						newData = newData.set(rowIndex, rdata); // Set that row in the data object
					}
				}

				if (!_underscore2['default'].isNull(newSelection) && indexedKeys.has(newSelection)) {
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
							rowid = row.get(_this3.state.idField);
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
				indexedData: newIndexed,
				selectionApplied: true
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
   * @param {boolean}	sendSelection 	If the selection must be sent or not
   */

	}, {
		key: 'triggerSelection',
		value: function triggerSelection() {
			var newSelection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
			var sendSelection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (sendSelection) {
				this.setState({
					selection: newSelection,
					allSelected: this.isAllSelected(this.state.data, newSelection)
				}, this.sendSelection);
			} else {
				this.setState({
					selection: newSelection,
					allSelected: this.isAllSelected(this.state.data, newSelection)
				});
			}
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
			var _this4 = this;

			var result = true;
			if (data.size > selection.size) return false;

			data.forEach(function (item, index) {
				if (!selection.has(item.get(_this4.state.idField, null))) {
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

				if (defSelection.length == 0) {
					selection = new Set();
				} else {
					if (!_underscore2['default'].isArray(defSelection)) {
						selection = new Set([defSelection.toString()]);
					} else {
						selection = new Set(defSelection.toString().split(','));
					}
				}

				selection['delete'](''); // Remove empty values

				this.triggerSelection(selection, false);
			}
		}

		/**
   * Prepare the data received by the component for the internal use.
   *
   * @param (object)	newData 	New data for rebuild. (filtering || props changed)
   * @param (string)	idField 	New idField if it has been changed. (props changed)
   * @param (boolean) rebuild		Rebuild the data. NOTE: If newData its an Immutable you should put this param to true.
   *
   * @return (array)	-rawdata: 	The same data as the props or the newData in case has been received.
   *					-indexed: 	Same as rawdata but indexed by the idField
   *					-data: 		Parsed data to add some fields necesary to internal working.
   */

	}, {
		key: 'prepareData',
		value: function prepareData() {
			var newData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var idField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var rebuild = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
			var displayfield = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			// The data will be inmutable inside the component
			var data = newData || this.props.data,
			    index = 0,
			    rdataIndex = 0,
			    idSet = new Set(),
			    field = idField || this.state.idField,
			    fieldValue = undefined;
			var indexed = [],
			    parsed = [],
			    rawdata = undefined,
			    hasNulls = false;

			// If not Immutable.
			// If an Immutable is received in props.data at the components first building the component will work with that data. In that case
			// the component should get indexed and rawdata in props. It's up to the developer if he / she wants to work with data from outside
			// but it's important to keep in mind that you need a similar data structure (_selected, _rowIndex, idField...)
			if (!_immutable2['default'].Iterable.isIterable(data) || rebuild) {
				data = _immutable2['default'].fromJS(data); // If data it's already Immutable the method .fromJS return the same object

				// Parsing data to add new fields (selected or not, field, rowIndex)
				parsed = data.map(function (row) {
					fieldValue = row.get(field, false);

					if (!fieldValue) {
						fieldValue = _underscore2['default'].uniqueId();
					}

					// No rows with same idField. The idField must be unique and also don't render the empty values
					if (!idSet.has(fieldValue) && fieldValue !== '' && row.get(displayfield, '') !== '') {
						idSet.add(fieldValue);
						row = row.set(field, fieldValue.toString());

						if (!row.get('_selected', false)) {
							row = row.set('_selected', false);
						}

						row = row.set('_rowIndex', index++); // data row index
						row = row.set('_rawDataIndex', rdataIndex++); // rawData row index

						return row;
					}

					rdataIndex++; // add 1 to jump over duplicate values
					hasNulls = true;
					return null;
				});

				// Clear null values if exist
				if (hasNulls) {
					parsed = parsed.filter(function (element) {
						return !_underscore2['default'].isNull(element);
					});
				}

				// Prepare indexed data.
				indexed = _underscore2['default'].indexBy(parsed.toJSON(), field);
			} else {
				// In case received Inmutable data, indexed data and raw data in props.
				data = this.props.rawdata;
				parsed = this.props.data;
				indexed = this.props.indexed;
			}

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
   * @param (Set object)	selection 		The selected values using the values of the selected data.
   * @param (Boolean) 	emptySelection 	When allowsEmptySelection is true and someone wants the empty selection.
   */

	}, {
		key: 'handleSelectionChange',
		value: function handleSelectionChange(selection) {
			var emptySelection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (!emptySelection) {
				this.triggerSelection(selection);
			} else {
				this.sendEmptySelection();
			}
		}

		/**
   * Function called each time the search field has changed. Filter the data by using the received search field value.
   *
   * @param (String)	value 	String written in the search field
   */

	}, {
		key: 'handleSearch',
		value: function handleSearch(value) {
			var _this5 = this;

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
						_underscore2['default'].each(_this5.state.initialIndexed, function (element) {
							if (_this5.props.filter(element, lValue)) {
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
						filter = element.get(_this5.props.filterField, null) || element.get(displayField);

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
			var _this6 = this;

			var hasAfterSelect = typeof this.props.afterSelect == 'function',
			    hasGetSelection = typeof this.props.afterSelectGetSelection == 'function';

			if (hasAfterSelect || hasGetSelection) {
				(function () {
					var selectionArray = [],
					    selection = _this6.state.selection;

					// Parse the selection to return it as an array instead of a Set obj
					selection.forEach(function (item) {
						selectionArray.push(item.toString());
					});

					if (hasGetSelection) {
						// When you just need the selection but no data
						_this6.props.afterSelectGetSelection.call(_this6, selectionArray, selection); // selection array / selection Set()
					}

					if (hasAfterSelect) {
						(function () {
							var selectedData = [],
							    properId = null,
							    rowIndex = null,
							    filteredData = null;
							var _state = _this6.state;
							var indexedData = _state.indexedData;
							var initialData = _state.initialData;
							var rawData = _state.rawData;
							var data = _state.data;

							var fields = new Set(_underscore2['default'].keys(rawData.get(0).toJSON())),
							    hasIdField = fields.has(_this6.state.idField) ? true : false;

							if (hasIdField) {
								selectedData = rawData.filter(function (element) {
									return selection.has(element.get(_this6.state.idField).toString());
								});
							} else {
								// Get the data (initialData) that match with the selection
								filteredData = initialData.filter(function (element) {
									return selection.has(element.get(_this6.state.idField));
								});

								// Then from the filtered data get the raw data that match with the selection
								selectedData = filteredData.map(function (row) {
									properId = row.get(_this6.state.idField);
									rowIndex = _this6.state.initialIndexed[properId]._rawDataIndex;

									return rawData.get(rowIndex);
								});
							}

							_this6.props.afterSelect.call(_this6, selectedData.toJSON(), selectionArray);
						})();
					}
				})();
			}
		}
	}, {
		key: 'sendEmptySelection',
		value: function sendEmptySelection() {
			var _this7 = this;

			var hasAfterSelect = typeof this.props.afterSelect == 'function',
			    hasGetSelection = typeof this.props.afterSelectGetSelection == 'function';

			if (hasAfterSelect || hasGetSelection) {
				if (hasGetSelection) {
					// When you just need the selection but no data
					this.props.afterSelectGetSelection.call(this, [''], new Set(''));
				}

				if (hasAfterSelect) {
					(function () {
						var filteredData = null,
						    rawData = _this7.state.rawData,
						    id = undefined,
						    display = undefined;

						// Get the data (rawData) that have idField or displayfield equals to empty string
						filteredData = rawData.filter(function (element) {
							id = element.get(_this7.state.idField);
							display = element.get(_this7.state.displayField);
							return display === '' || display === null || id === '' || id === null;
						});

						_this7.props.afterSelect.call(_this7, filteredData.toJSON(), ['']);
					})();
				}
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
					_react2['default'].createElement(_reactPropersearchField2['default'], {
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
						rowFormater: this.props.rowFormater,
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
						showIcon: this.props.listShowIcon,
						cacheManager: this.props.cacheManager,
						allowsEmptySelection: this.props.allowsEmptySelection,
						hiddenSelection: this.props.hiddenSelection
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