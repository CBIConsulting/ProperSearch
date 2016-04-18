import Search from '../search';
import TestUtils from "react-addons-test-utils";
import React from 'react';
import ReactDOM from 'react-dom';
import {Deferred} from 'jquery';
const Set = require('es6-set');

describe('Search', () => {

	it('is available', () => {
		expect(Search).not.toBe(null);
	});

	it('filter', (done) => {
		let def = Deferred();
		let props = getProps();
		props.afterSearch = (searchValue) => {
			if (searchValue) def.resolve(searchValue);
		}

		let component = prepare(props);

		// Check filter
		component.handleSearch('foo');

		def.done((value) => {
			expect(component.state.data.toJSON()[0].itemID).toBe('3'); // Testing filter
			expect(value).toBe('foo');
		}).always(done);
	});

	it('selection multiselect', (done) => {
		let def = Deferred();
		let props = getProps();
		props.afterSelect = (data, selection) => {
			if (data.length > 1) {
				def.resolve(data, selection);
			}
		}
		let component = prepare(props);

		// Check selection
		component.setDefaultSelection(['1','2']);

		def.done((data, selection) => {
			expect(data.length).toBe(2);
			expect(selection.length).toBe(2);
			expect(data).toContain({itemID:'1', display: 'Test1', toFilter: 'fee'});
			expect(data[2]).not.toBeDefined();
			expect(selection).toContain('1');
			expect(selection).toContain('2');
		}).always(done);
	});

	it('selection multiselect display-function', (done) => {
		let def = Deferred();
		let props = getPropsBigData();

		props.afterSelect = (data, selection) => {
			if (data.length > 1) {
				def.resolve(data, selection);
			}
		}
		let component = prepare(props);

		// Check selection
		component.setDefaultSelection(['item_1','item_2','item_5','item_6', 'item_8']);

		def.done((data, selection) => {
			expect(data.length).toBe(5);
			expect(selection.length).toBe(5);
			expect(selection).toContain('item_2');
			expect(selection).toContain('item_6');
			expect(selection).not.toContain('item_4');
			expect(data).toContain({itemID: 'item_8', display: formater, name: 'Tést 8',moreFields: 'moreFields values'})
		}).always(done);
	});

	it('selection singleselection', (done) => {
		let def = Deferred();
		let def2 = Deferred();
		let props = getPropsBigData();

		props.defaultSelection = null;
		props.afterSelect = (data, selection) => {
			if (data.length >= 1) {
				def.resolve(data, selection);
			} else {
				def2.resolve(data, selection)
			}
		}

		let component = prepare(props);
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
});

function prepare(props) {
	return TestUtils.renderIntoDocument(<Search {...props} />);
}

function getProps() {
	return {
		data: [{itemID:'1', display: 'Test1', toFilter: 'fee'}, {itemID:'2', display: 'Test2', toFilter: 'fuu'}, {itemID:'3', display: 'Test3', toFilter: 'foo'}],
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

	for (let i = length; i >= 0; i--) {
		data.push({itemID: 'item_' + i, display: formater, name: 'Tést ' + i,moreFields: 'moreFields values'});
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