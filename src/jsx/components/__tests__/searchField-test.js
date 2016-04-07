import SearchField from '../searchField';
import TestUtils from "react-addons-test-utils";
import React from 'react';
import ReactDOM from 'react-dom';
import {Deferred} from 'jquery';

describe('SearchField', () => {

	it('is available', () => {
		expect(SearchField).not.toBe(null);
	});

	it('throttles', (done) => {
		let called = 0;
		let def = Deferred();
		let props = {
			onSearch: q => {
				if (q !== '') {
					called++;
					if (q == 'foo') {
						def.resolve(q);
					}
				}
			}
		};

		let component = prepare(props);
		let node = component.refs.propersearch_field;

		node.value = 'f';
		TestUtils.Simulate.keyUp(node, {key: 'f'});
		node.value = 'fo';
		TestUtils.Simulate.keyUp(node, {key: 'o'});
		node.value = 'foo';
		TestUtils.Simulate.keyUp(node, {key: 'o'});

		def.done((q) => {
			expect(called).toBe(1);
			expect(q).toBe('foo');
		}).always(done);
	});

	it('handles enter', (done) => {
		let called = 0;
		let def = Deferred();
		let props = {
			onSearch: q => {
				if (q !== '') {
					called++;
					if (q == 'foo') {
						def.resolve(q);
					}
				}
			}
		};

		let component = prepare(props);
		let node = component.refs.propersearch_field;

		node.value = 'foo';
		TestUtils.Simulate.keyUp(node, {key: "Enter", keyCode: 13, which: 13});

		def.done((q) => {
			expect(called).toBe(1);
			expect(q).toBe('foo');
		}).always(done);
	});
});

function prepare(props) {
	return TestUtils.renderIntoDocument(<SearchField {...props} />);
}