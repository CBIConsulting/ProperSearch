'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var shallowEqualImmutable = require('react-immutable-render-mixin').shallowEqualImmutable;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

;(function ($, _, React, ReactDOM, undefined) {

	function getDefaultProps() {
		return {
			listHeight: 200,
			listRowHeight: 35
		};
	}

	var App = function (_React$Component) {
		_inherits(App, _React$Component);

		function App(props) {
			_classCallCheck(this, App);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

			_this.state = {
				data: [],
				fieldsSet: null,
				selection: null,
				language: 'ENG',
				idField: 'value',
				displayField: 'label',
				defaultSearch: '',
				multiSelect: true,
				listHeight: _this.props.listHeight,
				listRowHeight: _this.props.listRowHeight,
				placeholder: 'Search placeHolder',
				filterOff: false,
				dataSize: 100,
				shouldUpdate: true
			};
			return _this;
		}

		_createClass(App, [{
			key: 'componentWillMount',
			value: function componentWillMount() {
				var data = [],
				    fieldsSet = null;

				for (var i = this.state.dataSize; i >= 0; i--) {
					data.push({ itemID: 'item-' + i, display: this.formater.bind(this), name: 'Tést ' + i, moreFields: 'moreFields values' });
				};

				fieldsSet = new Set(_.keys(data[0]));

				this.setState({
					data: data,
					fieldsSet: fieldsSet,
					idField: 'itemID',
					displayField: 'display'
				});
			}
		}, {
			key: 'shouldComponentUpdate',
			value: function shouldComponentUpdate(nextProps, nextState) {
				var _this2 = this;

				var stateChanged = !shallowEqualImmutable(this.state, nextState);
				var propsChanged = !shallowEqualImmutable(this.props, nextProps);
				var somethingChanged = propsChanged || stateChanged;

				if (nextState.dataSize != this.state.dataSize) {
					var _ret = function () {
						var data = _this2.state.data,
						    dataItem = {},
						    fields = new Set(_.keys(data[0])),
						    newData = [];
						var displayField = nextState.displayField,
						    idField = nextState.idField;

						fields['delete'](idField);
						fields['delete'](displayField);
						fields['delete']('name');

						for (var i = nextState.dataSize; i >= 0; i--) {
							dataItem = {};
							dataItem[idField] = 'item-' + i;
							dataItem[displayField] = _this2.formater.bind(_this2);
							dataItem['name'] = 'Tést ' + i;

							fields.forEach(function (field) {
								dataItem[field] = data[0].field;
							});

							newData.push(dataItem);
						};

						fields = new Set(_.keys(newData[0]));

						_this2.setState({
							data: newData,
							fieldsSet: fields
						});

						return {
							v: false
						};
					}();

					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
				}

				if (!nextState.shouldUpdate) {
					this.setState({
						shouldUpdate: true
					});

					return false;
				}

				if (this.state.shouldUpdate != nextState.shouldUpdate) {
					return false;
				}

				return somethingChanged;
			}
		}, {
			key: 'afterSearch',
			value: function afterSearch(value) {
				console.info('Search: ', value);
			}
		}, {
			key: 'afterSelect',
			value: function afterSelect(data, selection) {
				console.info('Data: ', data);
				console.info('Selection: ', selection);

				this.setState({
					selection: selection,
					shouldUpdate: false
				});
			}
		}, {
			key: 'filter',
			value: function filter(listElement, value) {
				var data = listElement.name;
				data = Normalizer.normalize(data);
				return data.indexOf(value) >= 0;
			}
		}, {
			key: 'formater',
			value: function formater(listElement) {
				var _this3 = this;

				return React.createElement(
					'button',
					{ className: 'btn btn-default', onClick: function onClick(e) {
							_this3.onButtonClick(e, listElement.name);
						} },
					listElement.name
				);
			}
		}, {
			key: 'onButtonClick',
			value: function onButtonClick(e, name) {
				console.log('Button ' + name + ' has been clicked');
			}
		}, {
			key: 'onChangeData',
			value: function onChangeData(e) {
				e.preventDefault();
				var data = [],
				    fieldsSet = null,
				    language = '',
				    random = Math.floor(Math.random() * 10);
				var selection = ['item-' + random, 'item-' + (random + 1)];
				var defaultSearch = 'Item ' + random;
				var listHeight = this.props.listHeight + random,
				    listRowHeight = this.props.listRowHeight + random;
				var multiSelect = !this.state.multiSelect;

				if (random % 2 == 0) language = 'ENG';else language = 'ESP';

				for (var i = Math.floor(Math.random() * 1000) + 10; i >= 0; i--) {
					data.push({ value: 'item-' + i, label: 'Item ' + i, name: 'Teeést ' + i, fieldx: 'xxx ' + i, fieldy: 'yyy ' + i });
				}

				fieldsSet = new Set(_.keys(data[0]));

				this.setState({
					data: data,
					fieldsSet: fieldsSet,
					idField: 'value',
					displayField: 'label',
					language: language,
					selection: selection,
					defaultSearch: defaultSearch,
					listHeight: listHeight,
					listRowHeight: listRowHeight,
					multiSelect: multiSelect,
					filterOff: true
				});
			}
		}, {
			key: 'onChangeSize',
			value: function onChangeSize(e) {
				e.preventDefault();
				var size = this.refs.dataSize.value;
				size = parseInt(size);

				if (!isNaN(size)) {
					this.setState({
						dataSize: size
					});
				} else {
					this.refs.dataSize.value = this.state.dataSize;
				}
			}
		}, {
			key: 'onChangeIdField',
			value: function onChangeIdField(e) {
				e.preventDefault();
				var fieldsSet = this.state.fieldsSet,
				    newIdField = this.refs.idField.value;

				// Data has this field so update state otherwise set field to current state value
				// (SEARCH Component has prevent this and throws an error message in console and don't update the idField if that field doesn't exist in data)
				if (fieldsSet.has(newIdField)) {
					this.setState({
						idField: newIdField
					});
				} else {
					console.error('The data has no field with the name ' + newIdField + '. The fields of the data are: ', fieldsSet);
					this.refs.idField.value = this.state.idField;
				}
			}
		}, {
			key: 'onChangeDisplay',
			value: function onChangeDisplay(e) {
				e.preventDefault();
				var fieldsSet = this.state.fieldsSet,
				    newDisplayField = this.refs.displayField.value;

				// Data has this field so update state otherwise set field to current state value
				// (SEARCH Component has prevent this and throws an error message in console and don't update the displayField if that field doesn't exist in data)
				if (fieldsSet.has(newDisplayField)) {
					this.setState({
						displayField: newDisplayField
					});
				} else {
					console.error('The data has no field with the name ' + newDisplayField + '. The fields of the data are: ', fieldsSet);
					this.refs.displayField.value = this.state.displayField;
				}
			}
		}, {
			key: 'onChangeListHeight',
			value: function onChangeListHeight(e) {
				e.preventDefault();
				var height = this.refs.listHeight.value;
				height = parseInt(height);

				if (!isNaN(height)) {
					this.setState({
						listHeight: height
					});
				} else {
					this.refs.listHeight.value = this.state.listHeight;
				}
			}
		}, {
			key: 'onChangeElementHeight',
			value: function onChangeElementHeight(e) {
				e.preventDefault();
				var height = this.refs.listElementHeight.value;
				height = parseInt(height);

				if (!isNaN(height)) {
					this.setState({
						listRowHeight: height
					});
				} else {
					this.refs.listElementHeight.value = this.state.listRowHeight;
				}
			}
		}, {
			key: 'onChangeMultiselect',
			value: function onChangeMultiselect(e) {
				e.preventDefault();
				var multi = null,
				    selection = this.state.selection ? this.state.selection[0] : null;
				if (this.refs.multi.value == 'true') multi = true;else multi = false;

				this.setState({
					multiSelect: multi,
					selection: selection
				});
			}
		}, {
			key: 'onChangeLang',
			value: function onChangeLang(e) {
				e.preventDefault();

				this.setState({
					language: this.refs.lang.value
				});
			}
		}, {
			key: 'render',
			value: function render() {
				var filter = !this.state.filterOff ? this.filter.bind(this) : null;
				var multiSelect = this.state.multiSelect,
				    language = this.state.language;

				return React.createElement(
					'div',
					{ style: { position: 'absolute', width: '100%', top: '20%' } },
					React.createElement(
						'div',
						{ style: { position: 'absolute', top: 0, left: '10%', width: '20%' } },
						React.createElement(
							'div',
							{ style: { position: 'absolute', top: 0, bottom: 0, width: '100%' } },
							React.createElement(
								'form',
								{ className: 'form-horizontal', role: 'form' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										null,
										' List elements: '
									),
									React.createElement(
										'div',
										{ className: 'form-inline' },
										React.createElement('input', { ref: 'dataSize', type: 'text', className: 'form-control', placeholder: 'Number of elements', defaultValue: this.state.dataSize, style: { marginRight: '30px' } }),
										React.createElement(
											'button',
											{ className: 'btn btn-default', onClick: this.onChangeSize.bind(this) },
											'->'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										null,
										' Id-Field: '
									),
									React.createElement(
										'div',
										{ className: 'form-inline' },
										React.createElement('input', { ref: 'idField', type: 'text', className: 'form-control', placeholder: 'Id Field', defaultValue: this.state.idField, style: { marginRight: '30px' } }),
										React.createElement(
											'button',
											{ className: 'btn btn-default', onClick: this.onChangeIdField.bind(this) },
											'->'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										null,
										' Display-Field: '
									),
									React.createElement(
										'div',
										{ className: 'form-inline' },
										React.createElement('input', { ref: 'displayField', type: 'text', className: 'form-control', placeholder: 'Display Field', defaultValue: this.state.displayField, style: { marginRight: '30px' } }),
										React.createElement(
											'button',
											{ className: 'btn btn-default', onClick: this.onChangeDisplay.bind(this) },
											'->'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										null,
										' List Height: '
									),
									React.createElement(
										'div',
										{ className: 'form-inline' },
										React.createElement('input', { ref: 'listHeight', type: 'text', className: 'form-control', placeholder: 'List Height', defaultValue: this.state.listHeight, style: { marginRight: '30px' } }),
										React.createElement(
											'button',
											{ className: 'btn btn-default', onClick: this.onChangeListHeight.bind(this) },
											'->'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										null,
										' List Element Height: '
									),
									React.createElement(
										'div',
										{ className: 'form-inline' },
										React.createElement('input', { ref: 'listElementHeight', type: 'text', className: 'form-control', id: 'listElementHeight', placeholder: 'List Element Height', defaultValue: this.state.listRowHeight, style: { marginRight: '30px' } }),
										React.createElement(
											'button',
											{ className: 'btn btn-default', onClick: this.onChangeElementHeight.bind(this) },
											'->'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										null,
										' Multiselect '
									),
									React.createElement(
										'div',
										{ className: 'form-inline' },
										React.createElement(
											'select',
											{ ref: 'multi', className: 'form-control', id: 'multiselect_id', defaultValue: multiSelect, onChange: this.onChangeMultiselect.bind(this) },
											React.createElement(
												'option',
												{ value: true },
												'Yes'
											),
											React.createElement(
												'option',
												{ value: false },
												'No'
											)
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										null,
										' Language: '
									),
									React.createElement(
										'div',
										{ className: 'form-inline' },
										React.createElement(
											'select',
											{ ref: 'lang', className: 'form-control input', id: 'language', defaultValue: language, onChange: this.onChangeLang.bind(this) },
											React.createElement(
												'option',
												{ value: 'SPA' },
												'Spanish'
											),
											React.createElement(
												'option',
												{ value: 'ENG' },
												'English'
											)
										)
									)
								)
							)
						)
					),
					React.createElement(
						'div',
						{ style: { position: 'absolute', top: 0, left: '33%', width: '25%' } },
						React.createElement(
							'div',
							{ id: 'canvas', style: { position: 'absolute', top: 0, bottom: 0, width: ' 75%' } },
							React.createElement(ProperSearch, {
								data: this.state.data,
								idField: this.state.idField,
								displayField: this.state.displayField,
								listHeight: this.state.listHeight,
								listRowHeight: this.state.listRowHeight,
								lang: this.state.language,
								filter: filter,
								multiSelect: this.state.multiSelect,
								defaultSelection: this.state.selection,
								defaultSearch: this.state.defaultSearch,
								placeholder: this.state.placeholder,
								afterSelect: this.afterSelect.bind(this),
								afterSearch: this.afterSearch.bind(this)
							})
						),
						React.createElement(
							'div',
							{ id: 'canvas2', style: { position: 'absolute', top: 0, bottom: 0, right: 0, width: '20%' } },
							React.createElement(
								'button',
								{ className: 'btn btn-default', onClick: this.onChangeData.bind(this) },
								' Random Data '
							)
						)
					)
				);
			}
		}]);

		return App;
	}(React.Component);

	App.defaultProps = getDefaultProps();

	$(function () {
		var body = document.getElementById('body');
		ReactDOM.render(React.createElement(App, null), body);
	});
})(jQuery, _, React, ReactDOM);
