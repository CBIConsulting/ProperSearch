import SearchField from '../searchField';
import TestUtils from "react-addons-test-utils";
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

describe('SearchField', () => {

	it('is available', () => {
		expect(SearchField).not.toBe(null);
	});

	it('throttles', (done) => {
		let called = 0;
		let def = $.Deferred();
		let props = {
			onSearch: q => {
				console.log(q);
				called++;
				if (q == 'foo') {
					def.resolve(q);
				}
			}
		};

		let component = prepare(props);
		let node = component.refs.searchfield;

		node.value = 'f';
		TestUtils.Simulate.keyUp(node, {key: 'f'});
		node.value = 'fo';
		TestUtils.Simulate.keyUp(node, {key: 'o'});
		node.value = 'foo';
		TestUtils.Simulate.keyUp(node, {key: 'o'});

		def.done((q) => {
			expect(called).toBe(1);
			expect(q).toBe('foo');
			//expect(props.onSearch).toHaveBeenCalledWith('foo');
		}).always(done);

		console.log(component.refs);
	});
});

function prepare(props) {
	return TestUtils.renderIntoDocument(<SearchField {...props} />);
}