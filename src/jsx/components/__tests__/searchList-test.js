import SearchList from '../searchList';
import Immutable from 'immutable';
import TestUtils from "react-addons-test-utils";
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import {Deferred} from 'jquery';
import messages from "../../lang/messages";
const Set = require('es6-set');

describe('SearchList', function() {

	it('is available', () => {
		expect(SearchList).not.toBe(null);
	});

	it('handleElementClick singleSelection', (done) => {
		let def = Deferred();
		let props = getPropsBigData();
		let expected = 'item_89';
		props.multiSelect = false;
		props.onSelectionChange = (selection) => {
			def.resolve(selection);
		}

	    let component = prepare(props);

	    // Click elements
		let node = ReactDOM.findDOMNode(component.refs.test_11);
		TestUtils.Simulate.click(node);

		def.done((selection) => {
			expect(selection.has(expected)).toBe(true);
			expect(selection.size).toBe(1);
		}).always(done);
	});

	it('handleElementClick multiselect', (done) => {
		let def = Deferred();
		let props = getPropsBigData();
		let expected = new Set(['item_98', 'item_100', 'item_88', 'item_91']);

		props.onSelectionChange = (selection) => {
			if (selection.size >= 1) {
				def.resolve(selection);
			}
		}

	    let component = prepare(props);

	    // Click elements
		let node = ReactDOM.findDOMNode(component.refs.test_2);
		let node2 = ReactDOM.findDOMNode(component.refs.test_1); // Old selected item (unselect now)
		let node3 = ReactDOM.findDOMNode(component.refs.test_0);
		let node4 = ReactDOM.findDOMNode(component.refs.test_12);
		let node5 = ReactDOM.findDOMNode(component.refs.test_9);
		TestUtils.Simulate.click(node);
		TestUtils.Simulate.click(node2);
		TestUtils.Simulate.click(node3);
		TestUtils.Simulate.click(node4);
		TestUtils.Simulate.click(node5);

		def.done((selection) => {
			let result = true;
			selection.forEach( element => {
				if (!expected.has(element)) {
					result = false;
					return;
				}
			});
			expect(result).toBe(true);
			expect(selection.size).toBe(4);
		}).always(done);
	});

	it('handleSelectAll all', (done) => {
		let def = Deferred();
		let props = getPropsBigData();

		props.onSelectionChange = (selection) => {
			def.resolve(selection);
		}

	    let component = prepare(props);

	    // Click elements
		let node = ReactDOM.findDOMNode(component.refs.test_all);
		TestUtils.Simulate.click(node);

		def.done((selection) => {
			expect(selection.size).toBe(100);
		}).always(done);
	});

	it('handleSelectAll nothing', (done) => {
		let def = Deferred();
		let props = getPropsBigData();

		props.onSelectionChange = (selection) => {
			def.resolve(selection);
		}

	    let component = prepare(props);

	    // Click elements
		let node = ReactDOM.findDOMNode(component.refs.test_none);
		TestUtils.Simulate.click(node);

		def.done((selection) => {
			expect(selection.size).toBe(0);
		}).always(done);
	});
});

function prepare(props) {
	return TestUtils.renderIntoDocument(<SearchList {...props} />);
}

function formater(listElement) {
	return <button className ="btn btn-default">{ listElement.name }</button>;
}

function getPropsBigData(length = 100) {
	let data = [], preparedData = null;

	for (let i = length; i > 0; i--) {
		data.push({itemID: 'item_' + i, display: formater, name: 'Tést ' + i,moreFields: 'moreFields values'});
	};

	preparedData = prepareData(data, 'itemID');

	return {
		data: preparedData.data,
		indexedData: preparedData.indexed,
		idField: 'itemID',
		multiSelect: true,
		selection: new Set(['item_99']),
		displayField: 'display',
		uniqueID: 'test',
		messages: messages['ENG']
	}
}

/*
 * Prepare the data received by the component for the internal working.
 */
function prepareData(newData, field) {
	// The data will be inmutable inside the component
	let data = Immutable.fromJS(newData), index = 0;
	let indexed = [], parsed = [];

	// Parsing data to add new fields (selected or not, field, rowIndex)
	parsed = data.map(row => {
		if (!row.get(field, false)) {
			row = row.set(field, _.uniqueId());
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
	indexed = _.indexBy(parsed.toJSON(), field);

	return {
		rawdata: data,
		data: parsed,
		indexed: indexed
	};
}