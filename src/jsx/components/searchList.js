import React from 'react';
import _ from 'underscore';
import {shallowEqualImmutable} from 'react-immutable-render-mixin';
import { VirtualScroll } from 'react-virtualized';
import Dimensions from 'react-dimensions';
import cache from '../lib/cache';
const Set = require('es6-set');

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
		allowsEmptySelection: false,
		hiddenSelection: null,
		uniqueID: _.uniqueId('search_list_'),
	}
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
class SearchList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			allSelected: this.props.allSelected,
			nothingSelected: this.props.selection.size == 0,
			hiddenSelection: new Set()
		}
	}

	componentWillMount() {
		if (this.props.hiddenSelection) {
			this.setState({
				hiddenSelection: this.parseHiddenSelection(this.props)
			});
		}
	}

	componentWillReceiveProps(newProps) {
		let hiddenChange = !shallowEqualImmutable(this.props.hiddenSelection, newProps.hiddenSelection);
		let hiddenSelection;

		if (hiddenChange) {
			hiddenSelection = newProps.hiddenSelection ? this.parseHiddenSelection(newProps) : this.state.hiddenSelection;
			this.setState({
				hiddenSelection: hiddenSelection
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		let propschanged = !shallowEqualImmutable(this.props, nextProps);

		if (propschanged) {
			let nothingSelected = false;

			if (!nextProps.allSelected) nothingSelected = this.isNothingSelected(nextProps.data, nextProps.selection);

			// When the props change update the state.
			if (nextProps.allSelected != this.state.allSelected || nothingSelected != this.state.nothingSelected) {
				this.setState({
					allSelected: nextProps.allSelected,
					nothingSelected: nothingSelected,
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
	handleElementClick(itemValue, e) {
		e.preventDefault();
		let data = this.props.data, selection = this.props.selection, nothingSelected = false, allSelected = false;

		if (this.props.multiSelect) {
			if (selection.has(itemValue)) {
				selection.delete(itemValue);
			} else {
				selection.add(itemValue);
			}
		} else {
			if (selection.has(itemValue)) selection = new Set();
			else selection = new Set([itemValue]);
		}

		allSelected = this.isAllSelected(data, selection);
		if (!allSelected) nothingSelected = this.isNothingSelected(data, selection);

		// If the state has changed update it
		if (allSelected != this.state.allSelected || nothingSelected != this.state.nothingSelected){
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
	isNothingSelected(data, selection) {
		let result = true;
		if (selection.size == 0) return true;

		data.forEach(element => {
			if (selection.has(element.get(this.props.idField, null))) { // Some data not in selection
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
	isAllSelected(data, selection) {
		let result = true;
		if (data.size > selection.size) return false;

		data.forEach(element => {
			if (!selection.has(element.get(this.props.idField, null))) { // Some data not in selection
				result = false;
				return false;
			}
		});

		return result;
	}

/**
 * Function called each time the buttons in the bar of the list has been clicked. Delete or add all the data elements into the selection, just if it has changed.
 *
 * @param (Boolean)	selectAll 	If its a select all action or an unselect all.
 * @param (Array)	e 			Element which call the function
 */
	handleSelectAll(selectAll, e) {
		e.preventDefault();

		let newData = [], data = this.props.data, field = this.props.idField;
		let selection = this.props.selection;
		let hasChanged = (selectAll != this.state.allSelected || (!selectAll && !this.state.nothingSelected)); // nothingSelected = false then something is selected

		if (selectAll && hasChanged) {
			data.forEach(element => {
				selection.add(element.get(field, null));
			});
		} else {
			data.forEach(element => {
				selection.delete(element.get(field, null));
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
 * Function called each time the buttons (select empty) in the bar of the list has been clicked (In case empty selection allowed).
 *
 * @param (Array)	e 			Element which call the function
 */
	handleSelectEmpty( e) {
		if (typeof this.props.onSelectionChange == 'function') {
			this.props.onSelectionChange.call(this, null, true);
		}
	}

/**
 * Parse the hidden selection if that property contains somethings.
 *
 * @param (array)	props 				Component props (or nextProps)
 * @return (Set)	hiddenSelection 	The hidden rows.
 */
	parseHiddenSelection(props = this.props) {
		let hidden = [], isArray = _.isArray(props.hiddenSelection), isObject =  _.isObject(props.hiddenSelection);

		if (!isArray && isObject) return props.hiddenSelection; // Is Set

		if (!isArray) { // Is String or number
			hidden = [props.hiddenSelection.toString()];
		} else if (props.hiddenSelection.length > 0) { // Is Array
			hidden = props.hiddenSelection.toString().split(',');
		}

		return new Set(hidden);
	}

/**
 * Return the tool bar for the top of the list. It will be displayed only when the selection can be multiple.
 *
 * @return (html) 	The toolbar code
 */
	getToolbar() {
		let maxWidth = this.props.containerWidth ? (this.props.containerWidth / 2) - 1 : 100;

		return (
			<div className="proper-search-list-bar">
				<div className="btn-group form-inline">
					<a
						id="proper-search-list-bar-check"
						ref={this.props.uniqueID + '_all'}
						className="btn-select list-bar-check" role="button"
						onClick={this.handleSelectAll.bind(this, true)}
						style={{maxWidth: maxWidth, boxSizing: 'border-box'}}>
						<label>{this.props.messages.all}</label>
					</a>
					<a
						id="proper-search-list-bar-unCheck"
						ref={this.props.uniqueID + '_none'}
						className="btn-select list-bar-unCheck"
						role="button"
						onClick={this.handleSelectAll.bind(this, false)}
						style={{maxWidth: maxWidth, boxSizing: 'border-box'}}>
						<label>{this.props.messages.none}</label>
					</a>
				</div>
			</div>
		);
	}

/**
 * Return the tool bar for the top of the list in case Empty Selection allowed
 *
 * @return (html) 	The toolbar code
 */
	getToolbarForEmpty() {
		let allSelected = this.state.allSelected, selectMessage, maxWidth = (this.props.containerWidth / 2) - 1;
		selectMessage = allSelected ? this.props.messages.none : this.props.messages.all;

		return (
			<div className="proper-search-list-bar">
				<div className="btn-group form-inline">
					<a
						id="proper-search-list-bar-select"
						ref={this.props.uniqueID + '_all'}
						className="btn-select list-bar-select"
						role="button"
						onClick={this.handleSelectAll.bind(this, !allSelected)}
						style={{maxWidth: maxWidth, boxSizing: 'border-box'}}>
						<label>{selectMessage}</label>
					</a>
					<a
						id="proper-search-list-bar-empty"
						ref={this.props.uniqueID + '_none'}
						className="btn-select list-bar-empty"
						role="button"
						onClick={this.handleSelectEmpty.bind(this)}
						style={{maxWidth: maxWidth, boxSizing: 'border-box'}}>
						<label>{this.props.messages.empty}</label>
					</a>
				</div>
			</div>
		);
	}

	getRowHeight(index) {
		let id = this.props.data.get(index).get(this.props.idField);
		return this.state.hiddenSelection.has(id) ? 0 : this.props.listRowHeight;
	}

/**
 * Build and return the content of the list.
 *
 * @param {integer} index 		Index of the data to be rendered
 * @return {html}	list-row	A row of the list
 */
	getContent(index) {
		let icon =  null, selectedClass = null, className = null, element = null, listElementClass = this.props.listElementClass;
		let data = this.props.data, rowdata, id, displayField = this.props.displayField, showIcon = this.props.showIcon;

		rowdata = data.get(index);
		element = rowdata.get(displayField);
		className = "proper-search-list-element";
		id = rowdata.get(this.props.idField);

		if (!this.state.hiddenSelection.has(id)) {
			className += ' hidden-list-element';
		}

		if (this.props.multiSelect) {
			if (showIcon) {
				if (rowdata.get('_selected', false)) {
					icon = <i className="fa fa-check-square-o"/>;
					selectedClass = ' proper-search-selected'
				} else {
					icon = <i className="fa fa-square-o"/>;
					selectedClass = null;
				}
			}
		} else {
			if (rowdata.get('_selected')) selectedClass = ' proper-search-single-selected';
			else selectedClass = null;
		}

		if (listElementClass) {
			className += ' ' + listElementClass;
		}

		if (selectedClass) {
			className += ' ' + selectedClass;
		}

		if (typeof element == 'function') {
			element = element(this.props.indexedData[id]);
		} else if (this.props.rowFormater) {
			let ckey = ['search_list', 'list_'+ this.props.uniqueID, 'row__'+rowdata.get(this.props.idField), displayField];
			element = cache.read(ckey);

			if (element === undefined) {
				element = this.props.rowFormater(rowdata.get(displayField));
				cache.write(ckey, element);
			}
		}

		return (
			<div key={'element-' + index} ref={this.props.uniqueID + '_' + index} className={className} onClick={this.handleElementClick.bind(this, id)}>
				{icon}
				{element}
			</div>
		);
	}
/**
 * To be rendered when the data has no data (Ex. filtered data)
 *
 * @return (html) An div with a message
 */
	noRowsRenderer () {
	    return <div key={'element-0'} ref={this.props.uniqueID + '_noData'} className={"proper-search-list search-list-no-data"}>{this.props.messages.noData}</div>;
	}

/**
 * Function called to get the content of each element of the list.
 *
 * @param 	list 		List of elements builded on getContent.
 * @param 	index 		Current index to be rendered.
 * @return 	element 	The element on the index position
 */
	rowRenderer(index) {
		return this.getContent(index);
	}

	render(){
		let toolbar = null, rowHeight = this.props.listRowHeight, className = "proper-search-list";

		if (this.props.multiSelect) {
			toolbar = this.props.allowsEmptySelection ? this.getToolbarForEmpty() : this.getToolbar();
		}

		if (this.props.className) {
			className += ' '+this.props.className;
		}

		if (this.state.hiddenSelection.size > 0) {
			rowHeight = this.getRowHeight.bind(this);
		}

		return (
			<div className={className}>
				{toolbar}
				<VirtualScroll
					ref={this.props.uniqueID + '_virtual'}
					className={"proper-search-list-virtual"}
	                width={this.props.listWidth || this.props.containerWidth}
	                height={this.props.listHeight}
	                rowRenderer={this.rowRenderer.bind(this)}
	                rowHeight={rowHeight}
	                noRowsRenderer={this.noRowsRenderer.bind(this)}
	                rowsCount={this.props.data.size}
	                overscanRowsCount={5}
	              />
			</div>
		)
	}
}

SearchList.defaultProps = getDefaultProps();
let toExport = process.env.NODE_ENV === 'Test' ?  SearchList : Dimensions()(SearchList)
export default toExport;