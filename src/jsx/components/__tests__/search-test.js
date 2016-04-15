import Search from '../search';
import TestUtils from "react-addons-test-utils";
import React from 'react';
import ReactDOM from 'react-dom';
import {Deferred} from 'jquery';

describe('Search', () => {
	getProps(def) {
		return {
			data: [{itemID:'1', display: 'Test1', toFilter: 'fee'}, {itemID:'2', display: 'Test2', toFilter: 'fuu'}, {itemID:'3', display: 'Test3', toFilter: 'foo'}],
			lang: 'SPA',
			defaultSelection: [1],
			multiSelect: true,
			idField: 'itemID',
			displayField: 'display',
			filterField: 'toFilter',
			afterSelect: (data, selection) => {
				if (data.length > 1) {
					def.resolve(data, selection);
				}
			}
		}
	}

	it('is available', () => {
		expect(Search).not.toBe(null);
	});

	it('filter', (done) => {
		let def = Deferred();
		let props = getProps(def);
		let component = prepare(props);

		// Check filter
		component.handleSearch('foo');
		expect(component.state.data.toJSON()[0].itemID).toBe('3'); // Testing filter
	});

	it('selection', (done) => {
		let def = Deferred();
		let props = getProps(def);
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



});

function prepare(props) {
	return TestUtils.renderIntoDocument(<Search {...props} />);
}