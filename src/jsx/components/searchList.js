import React from 'react';
import _ from 'underscore';
import {shallowEqualImmutable} from 'react-immutable-render-mixin';
import { VirtualScroll } from 'react-virtualized';
import Dimensions from 'react-dimensions';
const Set = require('es6-set');

function getDefaultProps() {
	return {
		data: [],
		onSelectionChange: null,
		multiSelect: true,
		messages: null,
		selection: new Set(),
		allSelected: false,
		listRowHeight: 26,
		listHeight: 200,
		listWidth: null // Container width by default
	}
}

class SearchList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			allSelected: this.props.allSelected,
			nothingSelected: this.props.selection.size == 0
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		let propschanged = !shallowEqualImmutable(this.props, nextProps);
		let statechanged = !shallowEqualImmutable(this.state, nextState);
		let somethingchanged = propschanged || statechanged;

		if (propschanged) {
			let nothing =  nextProps.selection.size == 0;

			if (nextProps.allSelected != this.state.allSelected || nothing != this.state.nothingSelected) {
				this.setState({
					allSelected: nextProps.allSelected,
					nothingSelected: nothing,
				});
			}
		}

		return somethingchanged;
	}

	handleElementClick(itemValue, e) {
		let data = this.props.data, selection = this.props.selection, nothingSelected = null;

		if (this.props.multiSelect) {
			if (selection.has(itemValue)) {
				selection.delete(itemValue);
			} else {
				selection.add(itemValue);
			}
		} else {
			selection = new Set([itemValue]);
		}

		nothingSelected = selection.size == 0;
		if (selection.size != data.size || nothingSelected != this.state.nothingSelected){
			this.setState({
				allSelected: selection.size == data.size,
				nothingSelected: nothingSelected
			});
		}

		if (typeof this.props.onSelectionChange == 'function') {
			this.props.onSelectionChange.call(this, selection);
		}
	}

	handleSelectAll(selectAll, e) {
		e.preventDefault();

		let newData = [], data = this.props.data;
		let selection = this.props.selection;
		let hasChanged = (selectAll != this.state.allSelected || (!selectAll && !this.state.nothingSelected)); // nothingSelected = false then something is selected

		if (selectAll && hasChanged) {
			data.forEach(item => {
				selection.add(item.get('value', null));
			});
		} else {
			data.forEach(item => {
				selection.delete(item.get('value', null));
			});
		}

		if (hasChanged) {
			this.setState({
				allSelected: selectAll,
				nothingSelected: !selectAll
			});
		}

		if (typeof this.props.onSelectionChange == 'function' && hasChanged) {
			this.props.onSelectionChange.call(this, selection);
		}

	};

	getToolbar() {
		return (
			<div className="search-list-bar">
				<div className="btn-group form-inline">
					<a id="search-list-bar-check" className="btn" role="button" onClick={this.handleSelectAll.bind(this, true)}>
						<label>{this.props.messages.all}</label>
					</a>
					&nbsp;
					<a id="search-list-bar-unCheck" className="btn" role="button" onClick={this.handleSelectAll.bind(this, false)}>
						<label>{this.props.messages.none}</label>
					</a>
				</div>
			</div>
		);
	}

	getContent() {
		let content =  null, result = [], addClass = '';
		let data = this.props.data, selection = this.props.selection;

		data.forEach((item, index) => {
			if (this.props.multiSelect) {

				if (item.get('_selected', false)) {
					content = <i className="fa fa-check-square-o"/>;
					addClass = ' selected'
				} else {
					content = <i className="fa fa-square-o"/>;
					addClass = '';
				}
			} else {
				if (item.get('_selected')) addClass = ' single-selected';
				else addClass = '';
			}

			result.push(
				<div key={'element-' + index} className={"search-list-element" + addClass} onClick={this.handleElementClick.bind(this, item.get('value'))}>
					{content}
					&nbsp;&nbsp;
					{item.get('label')}
				</div>
			);
		});

		return result;
	}

	noRowsRenderer () {
	    return <div className={"search-list search-list-no-data"}>{this.props.messages.noData}</div>;
	}

	rowRenderer(list, index) {
		return list[index];
	}

	render(){
		let toolbar = null, rowsCount = 0, list = this.getContent(), className = "search-list";

		if (this.props.multiSelect) toolbar = this.getToolbar();
		rowsCount = this.props.data.size;

		if (this.props.className) {
			className += ' '+this.props.className;
		}

		return (
			<div className={className}>
				{toolbar}
				<VirtualScroll
					className={"search-list-virtual"}
	                width={this.props.listWidth || this.props.containerWidth}
	                height={this.props.listHeight}
	                rowRenderer={this.rowRenderer.bind(this, list)}
	                rowHeight={this.props.listRowHeight}
	                noRowsRenderer={this.noRowsRenderer.bind(this)}
	                rowsCount={rowsCount}
	                overscanRowsCount={5}
	              />
			</div>
		)
	}
}

SearchList.defaultProps = getDefaultProps();
export default Dimensions()(SearchList);