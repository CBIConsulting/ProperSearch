import React from 'react';
import Immutable from 'immutable';
import _ from 'underscore';
import SearchList from './searchList';
import SeachField from './searchField';
import messages from "../lang/messages";
const Set = require('es6-set');

function getDefaultFilter() {
	return ;
}

function getDefaultProps() {
	return {
		data: [],
		messages: messages,
		lang: 'ENG',
		defaultSelection: new Set(),
		multiSelect: false,
		filter: null,
		listWidth: null,
		listHeight: 200,
		listRowHeight: 26,
		afterSelect: null,
		onEnter: null // Optional - To do when key down Enter - SearchField
	}
}

class Search extends React.Component {
	constructor(props) {
		super(props);

		let preparedData = this.prepareData();

		this.state = {
			data: preparedData.data,
			initialData: preparedData.data,
			rawData: preparedData.rawdata,
			indexedData: preparedData.indexed,
			selection: this.props.defaultSelection,
			ready: false
		}
	}

	componentDidMount() {
		this.applySelection();
	}

	applySelection(newSelection = null) {
		let data = this.state.data, selection = newSelection || this.state.selection;
		let parsed = null;

		parsed = data.map(element => {
			if (selection.has(element.get('value', null))) {
				element = element.set('_selected', true);
			} else {
				element = element.set('_selected', false);
			}

			return element;
		});

		if (!newSelection) {
			this.setState({
				data: parsed,
				ready: true
			});
		} else {
			this.setState({
				data: parsed,
				selection: selection
			}, this.sendSelection(selection));
		}
	}

/**
 * Prepare the data received by the component for the internal working.
 *
 * @return (array)	-rawdata: The same data as the props.
 *					-indexed: Same as rawdata but indexed by the properId
 *					-data: Parsed data to add some fields necesary to internal working.
 */
	prepareData() {
		// The data will be inmutable inside the component
		let data = Immutable.fromJS(this.props.data), index = 0;
		let indexed = [], parsed = [];

		// Parsing data to add new fields (selected or not, properId, rowIndex)
		parsed = data.map(row => {
			if (!row.get('_properId', false)) {
				row = row.set('_properId', _.uniqueId());
			}
			if (!row.get('_selected', false)) {
				row = row.set('_selected', false);
			}

			row = row.set('_rowIndex', index++);

			return row;
		});

		// Prepare indexed data.
		indexed = _.indexBy(parsed.toJSON(), '_properId');

		return {
			rawdata: data,
			data: parsed,
			indexed: indexed
		};
	}

	handleSelectionChange(selection) {
		this.applySelection(selection);
	}

	handleSearch(value) {
		let data = this.state.initialData, filteredData = data, selection = this.state.selection;

		if (value) {
			filteredData = data.filter(element => element.get('label', null).toLowerCase().indexOf(value.toLowerCase()) >= 0)
		}

		filteredData = filteredData.map(element => {
			if (selection.has(element.get('value', null))) {
				element = element.set('_selected', true);
			}

			return element;
		});

		this.setState({
			data: filteredData
		});
	}

	sendSelection(selection) {
		if (typeof this.props.afterSelect == 'function') {
			let selectionArray = [], selectedData = [], properId = null, rowIndex = null;
			let {indexedData, initialData, rawData, data} = this.state;
			let filteredData = initialData.filter(element => selection.has(element.get('value', null)));

			selectedData = filteredData.map(row => {
				properId = row.get('_properId', 0);
				rowIndex = indexedData[properId]._rowIndex;

				return rawData.get(rowIndex);
			});

			selection.forEach(item => {
				selectionArray.push(item);
			});

			this.props.afterSelect.call(this, selectedData.toJSON(), selectionArray);
		}
	}

	render() {
		let messages = this.props.messages[this.props.lang], content = messages.loading,
		data = this.state.data,
		selection = this.state.selection,
		allSelected = data.size == selection.size;

		if (this.state.ready) {
			content = (
				<SearchList
					data={data}
					onSelectionChange={this.handleSelectionChange.bind(this)}
					messages={messages}
					selection={selection}
					allSelected={allSelected}
					multiSelect={this.props.multiSelect}
					listHeight={this.props.listHeight}
					listWidth={this.props.listWidth}
					listRowHeight={this.props.listRowHeight}
				/>
			);
		}

		return (
			<div className="proper-search">
				<SeachField onSearch={this.handleSearch.bind(this)}/>
				{content}
			</div>
		);
	}
};

Search.defaultProps = getDefaultProps();

export default Search;
