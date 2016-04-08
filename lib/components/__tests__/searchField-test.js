'use strict';

var _searchField = require('../searchField');

var _searchField2 = _interopRequireDefault(_searchField);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = require('jquery');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

describe('SearchField', function () {

	it('is available', function () {
		expect(_searchField2['default']).not.toBe(null);
	});

	it('throttles', function (done) {
		var called = 0;
		var def = (0, _jquery.Deferred)();
		var props = {
			onSearch: function onSearch(q) {
				if (q !== '') {
					called++;
					if (q == 'foo') {
						def.resolve(q);
					}
				}
			}
		};

		var component = prepare(props);
		var node = component.refs.propersearch_field;

		node.value = 'f';
		_reactAddonsTestUtils2['default'].Simulate.keyUp(node, { key: 'f' });
		node.value = 'fo';
		_reactAddonsTestUtils2['default'].Simulate.keyUp(node, { key: 'o' });
		node.value = 'foo';
		_reactAddonsTestUtils2['default'].Simulate.keyUp(node, { key: 'o' });

		def.done(function (q) {
			expect(called).toBe(1);
			expect(q).toBe('foo');
		}).always(done);
	});

	it('handles enter', function (done) {
		var called = 0;
		var def = (0, _jquery.Deferred)();
		var props = {
			onSearch: function onSearch(q) {
				if (q !== '') {
					called++;
					if (q == 'foo') {
						def.resolve(q);
					}
				}
			}
		};

		var component = prepare(props);
		var node = component.refs.propersearch_field;

		node.value = 'foo';
		_reactAddonsTestUtils2['default'].Simulate.keyUp(node, { key: "Enter", keyCode: 13, which: 13 });

		def.done(function (q) {
			expect(called).toBe(1);
			expect(q).toBe('foo');
		}).always(done);
	});
});

function prepare(props) {
	return _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_searchField2['default'], props));
}