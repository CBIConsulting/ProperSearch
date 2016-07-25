'use strict';

var _searchList = require('../searchList');

var _searchList2 = _interopRequireDefault(_searchList);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _jquery = require('jquery');

var _messages = require('../../lang/messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Set = require('es6-set');

describe('SearchList', function () {

	it('is available', function () {
		expect(_searchList2['default']).not.toBe(null);
	});

	it('handleElementClick singleSelection', function (done) {
		var def = (0, _jquery.Deferred)();
		var props = getPropsBigData();
		var expected = 'item_89';
		props.multiSelect = false;
		props.onSelectionChange = function (selection) {
			def.resolve(selection);
		};

		var component = prepare(props);

		// Click elements
		var nodeElements = _reactAddonsTestUtils2['default'].scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");
		_reactAddonsTestUtils2['default'].Simulate.click(nodeElements[11]);

		def.done(function (selection) {
			expect(selection.has(expected)).toBe(true);
			expect(selection.size).toBe(1);
		}).always(done);
	});

	it('handleElementClick multiselect', function (done) {
		var def = (0, _jquery.Deferred)();
		var props = getPropsBigData();
		var expected = new Set(['item_98', 'item_100', 'item_88', 'item_91']);

		props.onSelectionChange = function (selection) {
			if (selection.size >= 1) {
				def.resolve(selection);
			}
		};

		var component = prepare(props);

		// Click elements
		var nodeElements = _reactAddonsTestUtils2['default'].scryRenderedDOMComponentsWithClass(component, "proper-search-list-element");
		_reactAddonsTestUtils2['default'].Simulate.click(nodeElements[2]);
		_reactAddonsTestUtils2['default'].Simulate.click(nodeElements[1]); // Old selected item (unselect now)
		_reactAddonsTestUtils2['default'].Simulate.click(nodeElements[0]);
		_reactAddonsTestUtils2['default'].Simulate.click(nodeElements[12]);
		_reactAddonsTestUtils2['default'].Simulate.click(nodeElements[9]);

		def.done(function (selection) {
			var result = true;
			selection.forEach(function (element) {
				if (!expected.has(element)) {
					result = false;
					return;
				}
			});
			expect(result).toBe(true);
			expect(selection.size).toBe(4);
		}).always(done);
	});

	it('handleSelectAll all', function (done) {
		var def = (0, _jquery.Deferred)();
		var props = getPropsBigData();

		props.onSelectionChange = function (selection) {
			def.resolve(selection);
		};

		var component = prepare(props);

		// Click elements
		var node = _reactAddonsTestUtils2['default'].findRenderedDOMComponentWithClass(component, "list-bar-check");
		_reactAddonsTestUtils2['default'].Simulate.click(node);

		def.done(function (selection) {
			expect(selection.size).toBe(100);
		}).always(done);
	});

	it('handleSelectAll nothing', function (done) {
		var def = (0, _jquery.Deferred)();
		var props = getPropsBigData();

		props.onSelectionChange = function (selection) {
			def.resolve(selection);
		};

		var component = prepare(props);

		// Click elements
		var node = _reactAddonsTestUtils2['default'].findRenderedDOMComponentWithClass(component, "list-bar-unCheck");
		_reactAddonsTestUtils2['default'].Simulate.click(node);

		def.done(function (selection) {
			expect(selection.size).toBe(0);
		}).always(done);
	});
});

function prepare(props) {
	return _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_searchList2['default'], props));
}

function formater(listElement) {
	return _react2['default'].createElement(
		'button',
		{ className: 'btn btn-default' },
		listElement.name
	);
}

function getPropsBigData() {
	var length = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

	var data = [],
	    preparedData = null;

	for (var i = length; i > 0; i--) {
		data.push({ itemID: 'item_' + i, display: formater, name: 'Tést ' + i, moreFields: 'moreFields values' });
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
		messages: _messages2['default']['ENG']
	};
}

/*
 * Prepare the data received by the component for the internal working.
 */
function prepareData(newData, field) {
	// The data will be inmutable inside the component
	var data = _immutable2['default'].fromJS(newData),
	    index = 0;
	var indexed = [],
	    parsed = [];

	// Parsing data to add new fields (selected or not, field, rowIndex)
	parsed = data.map(function (row) {
		if (!row.get(field, false)) {
			row = row.set(field, _underscore2['default'].uniqueId());
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
	indexed = _underscore2['default'].indexBy(parsed.toJSON(), field);

	return {
		rawdata: data,
		data: parsed,
		indexed: indexed
	};
}