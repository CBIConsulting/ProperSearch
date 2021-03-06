import React from 'react';
import Immutable from 'immutable';
import _ from 'underscore';
import SearchList from './searchList';
import SeachField from 'react-propersearch-field';
import messages from "../lang/messages";
import Normalizer from "../utils/normalize";
import {shallowEqualImmutable} from 'react-immutable-render-mixin';
import cache from '../lib/cache';
const Set = require('es6-set');

// For more info about this read ReadMe.md
function getDefaultProps() {
	return {
		data: [],
		rawdata: null, // Case you want to use your own inmutable data. Read prepareData() method for more info.
		indexed: null, // Case you want to use your own inmutable data. Read prepareData() method for more info.
		messages: messages,
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
		allowsEmptySelection: false, // Put this to true to get a diferent ToolBar that allows select empty
	}
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
class Search extends React.Component {
	constructor(props) {
		super(props);

		let preparedData = this.prepareData(null, props.idField, false, props.displayField);

		this.state = {
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
		}
	}

	componentDidMount() {
		this.setDefaultSelection(this.props.defaultSelection);

		this.setState({
			ready: true
		});
	}

	shouldComponentUpdate(nextProps, nextState){
		let stateChanged = !shallowEqualImmutable(this.state, nextState);
		let propsChanged = !shallowEqualImmutable(this.props, nextProps);
		let somethingChanged = propsChanged || stateChanged;

		// Update row indexes when data get filtered
		if (this.state.data.size != nextState.data.size) {
			let parsed, indexed, data;

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
				let selection = nextProps.defaultSelection;
				if (!nextProps.multiSelect) selection = nextState.selection.values().next().value || null;

				// props data has been changed in the last call to this method
				this.setDefaultSelection(selection);
				if (_.isNull(selection) || selection.length === 0) this.setState({ready: true}); // No def selection so then ready
			}

			return false;
		}

		if (propsChanged) {
			let dataChanged = !shallowEqualImmutable(this.props.data, nextProps.data);
			let idFieldChanged = this.props.idField != nextProps.idField, displayFieldChanged = this.props.displayField != nextProps.displayField;
			let selectionChanged = false, nextSelection = new Set(nextProps.defaultSelection), selection = null;

			if (this.state.selection.size != nextSelection.size) {
				selectionChanged = true;
				selection = nextProps.defaultSelection;
			} else {
				this.state.selection.forEach(element => {
					if (!nextSelection.has(element)) {
						selectionChanged = true;
						selection = nextProps.defaultSelection;
						return true;
					}
				});
			}

			if (!nextProps.multiSelect && (nextSelection.size > 1 || this.state.selection.size > 1)) {
				selection = nextSelection.size > 1 ? nextProps.defaultSelection : this.state.selection.values().next().value;
				if (_.isArray(selection)) selection = selection[0];
			}

			if (idFieldChanged || displayFieldChanged) {
				let fieldsSet = new Set(_.keys(nextProps.data[0]));
				let messages = this.getTranslatedMessages();

				// Change idField / displayField but that field doesn't exist in the data
				if (!fieldsSet.has(nextProps.idField) || !fieldsSet.has(nextProps.displayField)) {
					if (!fieldsSet.has(nextProps.idField)) console.error(messages.errorIdField + ' ' + nextProps.idField + ' ' + messages.errorData);
					else console.error(messages.errorDisplayField + ' ' + nextProps.idField + ' ' + messages.errorData);

					return false;
				} else { // New idField &&//|| displayField exist in data array fields
					if (dataChanged){
						cache.flush('search_list');
						let preparedData = this.prepareData(nextProps.data, nextProps.idField, false, nextProps.displayField);

						this.setState({
							data: preparedData.data,
							initialData: preparedData.data,
							rawData: preparedData.rawdata,
							indexedData: preparedData.indexed,
							initialIndexed: preparedData.indexed,
							idField: nextProps.idField,
							displayField: nextProps.displayField,
							ready: false,
							selectionApplied: false
						}, this.setDefaultSelection(selection));

					} else {
						let initialIndexed = null, indexed = null;

						// If the id field change then the indexed data has to be changed but not for display
						if (displayFieldChanged) {
							initialIndexed = this.state.initialIndexed;
							indexed = this.state.indexedData;
						} else {
							initialIndexed = _.indexBy(this.state.initialData.toJSON(), nextProps.idField);
							indexed = _.indexBy(this.state.data.toJSON(), nextProps.idField);
						}

						this.setState({
							indexedData: indexed,
							initialIndexed: initialIndexed,
							idField: nextProps.idField,
							displayField: nextProps.displayField,
							ready: false,
							selectionApplied: false
						});
					}
					return false;
				}
			}

			if (dataChanged){
				cache.flush('search_list');
				let preparedData = this.prepareData(nextProps.data, nextProps.idField, false, nextProps.displayField);

				this.setState({
					data: preparedData.data,
					initialData: preparedData.data,
					rawData: preparedData.rawdata,
					indexedData: preparedData.indexed,
					initialIndexed: preparedData.indexed,
					ready: false,
					selectionApplied: false
				}, this.setDefaultSelection(selection));

				return false;
			}

			if (selectionChanged) {
				// Default selection does nothing if the selection is null so in that case update the state to restart selection
				if (!_.isNull(selection)) {
					this.setDefaultSelection(selection);
				} else {
					this.setState({
						selection: new Set(),
						allSelected: false,
						ready: true
					});
				}

				return false;
			}
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
	componentWillUpdate(nextProps, nextState) {
		// Selection
		if (this.props.multiSelect) {
			if (nextState.selection.size !== this.state.selection.size || (!nextState.selectionApplied && nextState.selection.size > 0)){
				this.updateSelectionData(nextState.selection, nextState.allSelected);
			}
		} else {
			let next = nextState.selection.values().next().value || null;
			let old = this.state.selection.values().next().value || null;
			let oldSize = !_.isNull(this.state.selection) ? this.state.selection.size : 0;

			if (next !== old || oldSize > 1){
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
	updateSelectionData(newSelection, newAllSelected = false) {
		let newIndexed = _.clone(this.state.indexedData);
		let oldSelection = this.state.selection;
		let rowid = null, selected = null, rdata = null, curIndex = null, newData = this.state.data, rowIndex = null;
		let newSelectionSize = !_.isNull(newSelection) ? newSelection.size : 0;

		// If oldSelection size is bigger than 1 that mean's the props has changed from multiselect to single select so if there is some list items with the selected class
		// if should be reset.
		if (!this.props.multiSelect && oldSelection.size <= 1) { // Single select
			let oldId = oldSelection.values().next().value || null;
			let indexedKeys = new Set(_.keys(newIndexed));

			if (!_.isNull(oldId) && indexedKeys.has(oldId)) {
				newIndexed[oldId]._selected = false; // Update indexed data
				rowIndex =  newIndexed[oldId]._rowIndex; // Get data index
				if (newData.get(rowIndex)) {
					rdata = newData.get(rowIndex).set('_selected', false); // Change the row in that index
					newData = newData.set(rowIndex, rdata); // Set that row in the data object
				}
			}

			if (!_.isNull(newSelection) && indexedKeys.has(newSelection)) {
				newIndexed[newSelection]._selected = true; // Update indexed data
				rowIndex =  newIndexed[newSelection]._rowIndex; // Get data index
				rdata = newData.get(rowIndex).set('_selected', true); // Change the row in that index
				newData = newData.set(rowIndex, rdata); // Set that row in the data object
			}

		} else if (!newAllSelected && this.isSingleChange(newSelectionSize)) { // Change one row data at a time
			let changedId = null, selected = null;

			// If the new selection has not one of the ids of the old selection that means an selected element has been unselected.
			oldSelection.forEach(id => {
				if (!newSelection.has(id)) {
					changedId = id;
					selected = false;
					return false;
				}
			});

			// Otherwise a new row has been selected. Look through the new selection for the new element.
			if (!changedId) {
				selected = true;
				newSelection.forEach(id => {
					if (!oldSelection.has(id)) {
						changedId = id;
						return false;
					}
				});
			}

			newIndexed[changedId]._selected = selected; // Update indexed data
			rowIndex =  newIndexed[changedId]._rowIndex; // Get data index
			rdata = newData.get(rowIndex).set('_selected', selected); // Change the row in that index
			newData = newData.set(rowIndex, rdata); // Set that row in the data object
		} else { // Change all data
			if (_.isNull(newSelection)) newSelection = new Set();
			else if (!_.isObject(newSelection)) newSelection = new Set([newSelection]);

			newData = newData.map((row) => {
				rowid = row.get(this.state.idField);
				selected = newSelection.has(rowid.toString());
				rdata = row.set('_selected', selected);
				curIndex = newIndexed[rowid];

				if (curIndex._selected != selected) { // update indexed data
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
	isSingleChange(newSize) {
		let oldSize = this.state.selection.size;

		if (oldSize - 1 == newSize || oldSize + 1 == newSize) return true;
		else return false;
	}

/**
 * Get the translated messages for the component.
 *
 * @return object Messages of the selected language or in English if the translation for this lang doesn't exist.
 */
	getTranslatedMessages() {
		if (!_.isObject(this.props.messages)) {
			return {};
		}

		if (this.props.messages[this.props.lang]) {
			return this.props.messages[this.props.lang];
		}

		return this.props.messages['ENG'];
	}

/**
 * In case that the new selection array be different than the selection array in the components state, then update
 * the components state with the new data.
 *
 * @param {array}	newSelection	The selected rows
 * @param {boolean}	sendSelection 	If the selection must be sent or not
 */
	triggerSelection(newSelection = new Set(), sendSelection = true) {
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
	isAllSelected(data, selection) {
		let result = true;
		if (data.size > selection.size) return false;

		data.forEach((item, index) => {
			if (!selection.has(item.get(this.state.idField, null))) { // Some data not in selection
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
	setDefaultSelection(defSelection) {
		if (defSelection) {
			let selection = null;

			if (defSelection.length == 0) {
				selection = new Set();
			} else {
				if (!_.isArray(defSelection)) {
					selection = new Set([defSelection.toString()]);
				} else {
					selection = new Set(defSelection.toString().split(','));
				}
			}

			selection.delete(''); // Remove empty values

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
	prepareData(newData = null, idField = null, rebuild = false, displayfield = null) {
		// The data will be inmutable inside the component
		let data = newData || this.props.data, index = 0, rdataIndex = 0, idSet = new Set(), field = idField || this.state.idField, fieldValue;
		let indexed = [], parsed = [], rawdata, hasNulls = false;

		// If not Immutable.
		// If an Immutable is received in props.data at the components first building the component will work with that data. In that case
		// the component should get indexed and rawdata in props. It's up to the developer if he / she wants to work with data from outside
		// but it's important to keep in mind that you need a similar data structure (_selected, _rowIndex, idField...)
		if (!Immutable.Iterable.isIterable(data) || rebuild) {
			data = Immutable.fromJS(data); // If data it's already Immutable the method .fromJS return the same object

			// Parsing data to add new fields (selected or not, field, rowIndex)
			parsed = data.map(row => {
				fieldValue = row.get(field, false);

				if (!fieldValue) {
					fieldValue = _.uniqueId();
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
				parsed = parsed.filter(element => !_.isNull(element));
			}

			// Prepare indexed data.
			indexed = _.indexBy(parsed.toJSON(), field);

		} else { // In case received Inmutable data, indexed data and raw data in props.
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
	handleSelectionChange(selection, emptySelection = false) {
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
	handleSearch(value) {
		let lValue = value ? value : null, filter = null;
		let data = this.state.initialData, filteredData = data, selection = this.state.selection;
		let displayField = this.state.displayField, idField = this.state.idField;
		let hasFilter = (typeof this.props.filter == 'function');

		// When the search field has been clear then the value will be null and the data will be the same as initialData, otherwise
		// the data will be filtered using the .filter() function of Inmutable lib. It return a Inmutable obj with the elements that
		// match the expresion in the parameter.
		if (value) {
			lValue = Normalizer.normalize(lValue);

			// If the prop `filter´ has a function then use if to filter as an interator over the indexed data.
			if (hasFilter) {
				let filtered = null, filteredIndexes = new Set();

				// Filter indexed data using the funtion
				_.each(this.state.initialIndexed, element => {
					if (this.props.filter(element, lValue)) {
						filteredIndexes.add(element._rowIndex);
					}
				});

				// Then get the data that match with that indexed data
				filteredData = data.filter(element => {
					return filteredIndexes.has(element.get('_rowIndex'));
				});
			} else {
				filteredData = data.filter(element => {
					filter = element.get(this.props.filterField, null) || element.get(displayField);

					// When it's a function then use the field in filterField to search, if this field doesn't exist then use the field name or then idField.
					if (typeof filter == 'function') {
						filter = element.get('name', null) || element.get(idField);
					}

					filter = Normalizer.normalize(filter);
					return filter.indexOf(lValue) >= 0;
				});
			}
		}

		// Apply selection
		filteredData = filteredData.map(element => {
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
	sendSelection() {
		let hasAfterSelect = typeof this.props.afterSelect == 'function', hasGetSelection = typeof this.props.afterSelectGetSelection == 'function';

		if (hasAfterSelect || hasGetSelection) {
			let selectionArray = [], selection = this.state.selection;

			// Parse the selection to return it as an array instead of a Set obj
			selection.forEach(item => {
				selectionArray.push(item.toString());
			});

			if (hasGetSelection) { // When you just need the selection but no data
				this.props.afterSelectGetSelection.call(this, selectionArray, selection); // selection array / selection Set()
			}

			if (hasAfterSelect) {
				let selectedData = [], properId = null, rowIndex = null, filteredData = null;
				let {indexedData, initialData, rawData, data} = this.state;
				let fields = new Set(_.keys(rawData.get(0).toJSON())), hasIdField = fields.has(this.state.idField) ? true : false;

				if (hasIdField) {
					selectedData = rawData.filter(element => {
						return selection.has(element.get(this.state.idField).toString());
					});
				} else {
					// Get the data (initialData) that match with the selection
					filteredData = initialData.filter(element => selection.has(element.get(this.state.idField)));

					// Then from the filtered data get the raw data that match with the selection
					selectedData = filteredData.map(row => {
						properId = row.get(this.state.idField);
						rowIndex = this.state.initialIndexed[properId]._rawDataIndex;

						return rawData.get(rowIndex);
					});
				}

				this.props.afterSelect.call(this, selectedData.toJSON(), selectionArray);
			}
		}
	}

	sendEmptySelection() {
		let hasAfterSelect = typeof this.props.afterSelect == 'function', hasGetSelection = typeof this.props.afterSelectGetSelection == 'function';

		if (hasAfterSelect || hasGetSelection) {
			if (hasGetSelection) { // When you just need the selection but no data
				this.props.afterSelectGetSelection.call(this, [''], new Set(''));
			}

			if (hasAfterSelect) {
				let filteredData = null, rawData = this.state.rawData, id, display;

				// Get the data (rawData) that have idField or displayfield equals to empty string
				filteredData = rawData.filter(element => {
					id = element.get(this.state.idField);
					display = element.get(this.state.displayField);
					return  display === '' || display === null || id === '' || id === null;
				});

				this.props.afterSelect.call(this, filteredData.toJSON(), ['']);
			}
		}
	}

/**
 * Send the written string in the search field to the afterSearch function if it was set up in the components props
 *
 * @param (String)	searchValue 	String written in the search field
 */
	sendSearch(searchValue) {
		if (typeof this.props.afterSearch == 'function') {
			this.props.afterSearch.call(this, searchValue);
		}
	}

	render() {
		let messages = this.getTranslatedMessages(),
		content = null,
		data = this.state.data,
		selection = new Set(),
		allSelected = this.state.allSelected,
		className = "proper-search";

		if (this.props.className) {
			className += ' '+this.props.className;
		}

		if (this.state.ready) {
			this.state.selection.forEach( element => {
				selection.add(element);
			});

			content = (
				<div>
					<SeachField
						onSearch={this.handleSearch.bind(this)}
						onEnter={this.props.onEnter}
						className={this.props.fieldClass}
						placeholder={this.props.placeholder}
						defaultValue={this.props.defaultSearch}
						searchIcon={this.props.searchIcon}
						clearIcon={this.props.clearIcon}
						throttle={this.props.throttle}
						minLength={this.props.minLength}
						autoComplete={this.props.autoComplete}
					/>
					<SearchList
						data={data}
						rowFormater={this.props.rowFormater}
						indexedData={this.state.initialIndexed}
						className={this.props.listClass}
						idField={this.state.idField}
						displayField={this.state.displayField}
						onSelectionChange={this.handleSelectionChange.bind(this)}
						messages={messages}
						selection={selection}
						allSelected={allSelected}
						multiSelect={this.props.multiSelect}
						listHeight={this.props.listHeight}
						listWidth={this.props.listWidth}
						listRowHeight={this.props.listRowHeight}
						listElementClass={this.props.listElementClass}
						showIcon={this.props.listShowIcon}
						cacheManager={this.props.cacheManager}
						allowsEmptySelection={this.props.allowsEmptySelection}
						hiddenSelection={this.props.hiddenSelection}
					/>
				</div>
			);

		} else {
			content = <div className="proper-search-loading">{messages.loading}</div>
		}

		return (
			<div className={"proper-search " + className}>
				{content}
			</div>
		);
	}
};

Search.defaultProps = getDefaultProps();
export default Search;