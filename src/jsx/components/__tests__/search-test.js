import Search from '../search';
import TestUtils from "react-addons-test-utils";
import React from 'react';
import ReactDOM from 'react-dom';
import {Deferred} from 'jquery';
const Set = require('es6-set');

describe('Search', () => {
	let wrapper = null;

	beforeEach(function() {
	    wrapper = document.createElement('div');
	});

	it('is available', () => {
		expect(Search).not.toBe(null);
	});

	it('filter', (done) => {
		let def = Deferred(), component = null, node = null, props = getProps();
		props.afterSearch = (searchValue) => {
			if (searchValue) def.resolve(searchValue);
		}

		component = prepare(props);

		// Check filter
		component.handleSearch('foo');

		def.done((value) => {
			expect(component.state.data.toJSON()[0].itemID).toBe('3'); // Testing filter
			expect(value).toBe('foo');
		}).always(done);
	});

	it('selection multiselect', (done) => {
		let def = Deferred(), component = null, props = getProps();
		props.afterSelect = (data, selection) => {
			def.resolve(data, selection);
		}
		component = prepare(props);

		// Check selection
		component.triggerSelection(new Set(['1','2']));

		def.done((data, selection) => {
			expect(data.length).toBe(2);
			expect(selection.length).toBe(2);
			expect(data).toContain({itemID: 1, display: 'Test1', toFilter: 'fee'});
			expect(data[2]).not.toBeDefined();
			expect(selection).toContain('1');
			expect(selection).toContain('2');
		}).always(done);
	});

	it('selection multiselect display-function', (done) => {
		let def = Deferred(), component = null, props = getPropsBigData();

		props.multiSelect = true;
		props.afterSelect = (data, selection) => {
			def.resolve(data, selection);
		}
		component = prepare(props);

		// Check selection
		component.triggerSelection(new Set(['1','item_2','item_5','item_6', 'item_8']));

		def.done((data, selection) => {
			expect(data.length).toBe(4);
			expect(selection.length).toBe(5);
			expect(selection).toContain('1');
			expect(selection).toContain('item_2');
			expect(selection).toContain('item_6');
			expect(selection).not.toContain('item_4');
			expect(data).toContain({itemID: 'item_8', display: formater, name: 'Tést 8',moreFields: 'moreFields values'})
		}).always(done);
	});

	it('selection singleselection', (done) => {
		let def = Deferred(), def2 = Deferred(), component = null, props = getPropsBigData();

		props.defaultSelection = null;
		props.afterSelect = (data, selection) => {
			if (data.length >= 1) {
				def.resolve(data, selection);
			} else {
				def2.resolve(data, selection)
			}
		}
		component = prepare(props);
		component.triggerSelection(new Set(['item_190']));

		def.done((data, selection) => {
			expect(data.length).toBe(1);
			expect(selection.length).toBe(1);
			expect(selection[0]).toBe('item_190');
		});

		component.triggerSelection(new Set([]));
		def2.done((data, selection) => {
			expect(data.length).toBe(0);
			expect(selection.length).toBe(0);
		}).always(done);
	});

	it('selectAll on filtered data', (done) => {
		let def = Deferred(), component = null, node = null, props = null;
		props = getPropsBigData();

		props.multiSelect = true;
		props.defaultSelection = null;
		props.afterSelect = (data, selection) => {
			if (data.length > 1) {
				def.resolve(data, selection);
			}
		}

		component = prepare(props);
		node = TestUtils.findRenderedDOMComponentWithClass(component, "list-bar-check");

		component.handleSearch('test 10'); // Filter
		TestUtils.Simulate.click(node); // Select All
		component.handleSearch(null); // Back to default

		def.done((data, selection) => {
			expect(selection.length).toBe(12);
			expect(data.length).toBe(12);
		}).always(done);
	});

	it('select/unselect all on filtered data && multiple operations', (done) => {
		let def = Deferred(), component = null, nodeCheckAll = null, nodeUnCheck = null, nodeElements = null, props = null, promise = null;
		props = getPropsBigData();
		promise = { done: () => {return;} }

		spyOn(promise, 'done');

		props.multiSelect = true;
		props.defaultSelection = null;
		props.afterSelect = (data, selection) => {
			if (promise.done.calls.any()) {
				def.resolve(data, selection);
			}
		}

		component = prepare(props);
		nodeCheckAll = TestUtils.findRenderedDOMComponentWithClass(component, "list-bar-check");
		nodeUnCheck = TestUtils.findRenderedDOMComponentWithClass(component, "list-bar-unCheck");
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");

		TestUtils.Simulate.click(nodeCheckAll); // Select All 1000
		component.handleSearch('test 10'); // Filter (12 elements 1000 110 109... 100 10)
		TestUtils.Simulate.click(nodeUnCheck); // UnSelect All (1000 - 12 => 988)
		component.handleSearch(null); // Back to default
		TestUtils.Simulate.click(nodeElements[3]); // Unselect element 997 (988 - 1 => 987)
		component.handleSearch('test 11'); // Filter (11 elements 11 110 111... 116 117 118 119)
		TestUtils.Simulate.click(nodeUnCheck); // UnSelect All (987 - 11 => 976)
		TestUtils.Simulate.click(nodeCheckAll); // Select All (976 + 11 => 987)
		promise.done();
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-search-list-element"); // update nodeElement to current in view
		TestUtils.Simulate.click(nodeElements[3]); // Click element 116 (unSelect) (987 - 1 => 986)

		def.done((data, selection) => {
			let set = new Set(selection);

			expect(selection.length).toBe(986);
			expect(data.length).toBe(986);
			expect(set.has('item_997')).toBe(false);
			expect(set.has('item_996')).toBe(true);
			expect(set.has('item_116')).toBe(false);
			expect(set.has('item_100')).toBe(false);
			expect(promise.done).toHaveBeenCalled();

		}).always(done);
	});

	it('keeps selection after refreshing data && update props', (done) => {
		let def = Deferred(), props = getPropsBigData(), promise = null, component = null, nodeCheckAll = null, nodeElements = null, newData = [];
		promise = { done: () => {return;} }

		spyOn(promise, 'done');

		props.multiSelect = true;
		props.defaultSelection = null;
		props.afterSelect = (data, selection) => {
			if (promise.done.calls.any()) {
				def.resolve(data, selection);
			}
		}

		component = ReactDOM.render(<Search {...props} />, wrapper);

		nodeCheckAll = TestUtils.findRenderedDOMComponentWithClass(component, "list-bar-check");
		TestUtils.Simulate.click(nodeCheckAll); // Select All 1000

		for (let i = 1000; i > 0; i--) {
			newData.push({id: 'item_' + i, display2: 'Element_' + i, name2: 'Testing2 ' + i});
		};
		props.data = newData;
		props.idField = 'id';
		props.displayField = 'display2';
		props.filterField = 'name2';

		component = ReactDOM.render(<Search {...props} />, wrapper); // Update props
		nodeElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");

		promise.done();
		TestUtils.Simulate.click(nodeElements[0]); // Unselect one element (Element 1000) to call afterSelect

		def.done((data, selection) => {
			expect(selection.length).toBe(999);
			expect(data[0]).toEqual(newData[1])
			expect(data[0].id).toBeDefined();
			expect(data[0].display2).toBeDefined();
			expect(data[0].name2).toBeDefined();
			expect(data[0].moreFields).not.toBeDefined();
		}).always(done);
	});

});

function prepare(props) {
	return TestUtils.renderIntoDocument(<Search {...props} />);
}

function getProps() {
	return {
		data: [{itemID:1, display: 'Test1', toFilter: 'fee'}, {itemID:2, display: 'Test2', toFilter: 'fuu'}, {itemID:3, display: 'Test3', toFilter: 'foo'}],
		lang: 'SPA',
		defaultSelection: [1],
		multiSelect: true,
		idField: 'itemID',
		displayField: 'display',
		filterField: 'toFilter',
		listWidth: 100,
		listHeight: 100
	}
}


function formater(listElement) {
	return <button className ="btn btn-default">{ listElement.name }</button>;
}

function getPropsBigData(length = 1000) {
	let data = [];

	for (let i = length; i > 0; i--) {
		data.push({itemID: 'item_' + i, display: formater, name: 'Tést ' + i, moreFields: 'moreFields values'});
	};

	return {
		data: data,
		idField: 'itemID',
		defaultSelection: ['item_1'],
		displayField: 'display',
		filterField: 'name',
		listWidth: 100,
		listHeight: 100
	}
}