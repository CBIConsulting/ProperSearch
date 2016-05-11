import React from 'react';
import Search from "../../src/jsx/propersearch";
import Normalizer from "../../src/jsx/utils/normalize";
import {shallowEqualImmutable} from 'react-immutable-render-mixin';

function getDefaultProps() {
	return {
		listHeight: 200,
		listRowHeight: 35
	}
}

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			fieldsSet: null,
			selection: null,
			language: 'ENG',
			idField: 'value',
			displayField: 'label',
			defaultSearch: '',
			multiSelect: true,
			listHeight: this.props.listHeight,
			listRowHeight: this.props.listRowHeight,
			placeholder: 'Search placeHolder',
			filterOff: false,
			dataSize: 100
		}
	}

	componentWillMount() {
		let data = [], fieldsSet = null;

		for (let i = this.state.dataSize; i >= 0; i--) {
			if (i == 8 || i == 9 || i == 16) data.push({itemID: '', display: '', name: 'Tést ' + i, moreFields: 'moreFields values'});
			else data.push({itemID: 'item-' + i, display: this.formater.bind(this), name: 'Tést ' + i, moreFields: 'moreFields values'});
		};

		fieldsSet = new Set(_.keys(data[0]));

		this.setState({
			data: data,
			fieldsSet: fieldsSet,
			idField: 'itemID',
			displayField: 'display'
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		let stateChanged = !shallowEqualImmutable(this.state, nextState);
		let propsChanged = !shallowEqualImmutable(this.props, nextProps);
		let somethingChanged = propsChanged || stateChanged;

		if (nextState.dataSize != this.state.dataSize) {
			let newData = [];

			for (let i = nextState.dataSize; i >= 0; i--) {
				newData.push({
					[nextState.idField]: 'item-' + i,
					[nextState.displayField]: 'Item ' + i,
					name: 'Teeést ' + i,
					fieldx: 'xxx ' + i,
					fieldy: 'yyy ' + i
				});
			}

			this.setState({
				data: newData,
				fieldsSet: new Set(_.keys(newData[0]))
			});

			return false;
		}

		// If something change update form
		if (somethingChanged) {
			this.refs.listHeight.value = nextState.listHeight;
			this.refs.listElementHeight.value = nextState.listRowHeight;
			this.refs.idField.value = nextState.idField;
			this.refs.displayField.value = nextState.displayField;
			this.refs.dataSize.value = nextState.dataSize;
			this.refs.listElementHeight.value = nextState.listRowHeight;
			this.refs.lang.value = nextState.language;
			this.refs.multi.value = nextState.multiSelect;
		}

		return somethingChanged;
	}

	afterSearch(value) {
		console.info('Search: ', value);
	}

	afterSelect(data, selection) {
		console.info('Data: ', data);
		console.info('Selection: ', selection);

		this.setState({
			selection: selection
		});
	}

	filter(listElement, value) {
		let data = listElement.name;
		data = Normalizer.normalize(data);
		return data.indexOf(value) >= 0;
	}

	formater(listElement) {
		return <button className ="btn btn-default" onClick={ (e) => {this.onButtonClick(e, listElement.name)} }>{ listElement.name }</button>;
	}

	onButtonClick(e, name) {
		console.log('Button ' + name + ' has been clicked');
	}

	onChangeData (e) {
		e.preventDefault();
		let data = [], fieldsSet = null, language = '', random = Math.floor(Math.random()* 10);
		let selection = ['item-'+ random,'item-' + (random+1)];
		let defaultSearch = 'Item '+ random, placeholder = 'Search Placeholder ' + random;
		let listHeight = this.props.listHeight + random, listRowHeight = this.props.listRowHeight + random;
		let multiSelect = !this.state.multiSelect, dataSize = (Math.floor(Math.random()* 1000) + 10);

		if (random % 2 == 0) language = 'ENG';
		else language = 'SPA';

		for (let i = dataSize; i >= 0; i--) {
			data.push({value: 'item-' + i, label: 'Item ' + i, name: 'Teeést ' + i, fieldx: 'xxx ' + i, fieldy: 'yyy ' + i});
		}

		fieldsSet = new Set(_.keys(data[0]));

		this.setState({
			data: data,
			fieldsSet: fieldsSet,
			idField: 'value',
			displayField: 'label',
			language: language,
			defaultSelection: selection,
			defaultSearch: defaultSearch,
			listHeight: listHeight,
			listRowHeight: listRowHeight,
			multiSelect: multiSelect,
			filter: null,
			placeholder: placeholder,
			afterSelect: this.afterSelect.bind(this),
			afterSearch: this.afterSearch.bind(this),
			dataSize: dataSize
		});

	}

	onChangeSize(e) {
		e.preventDefault();
		let size = this.refs.dataSize.value;
		size = parseInt(size);

		if (!isNaN(size)) {
			this.setState({
				dataSize: size
			});
		} else {
			this.refs.dataSize.value = this.state.dataSize;
		}
	}

	onChangeIdField(e) {
		e.preventDefault();
		let fieldsSet = this.state.fieldsSet, newIdField = this.refs.idField.value;

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

	onChangeDisplay(e) {
		e.preventDefault();
		let fieldsSet = this.state.fieldsSet, newDisplayField = this.refs.displayField.value;

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

	onChangeListHeight(e) {
		e.preventDefault();
		let height = this.refs.listHeight.value;
		height = parseInt(height);

		if (!isNaN(height)) {
			this.setState({
				listHeight: height
			});
		} else {
			this.refs.listHeight.value = this.state.listHeight;
		}
	}

	onChangeElementHeight(e) {
		e.preventDefault();
		let height = this.refs.listElementHeight.value;
		height = parseInt(height);

		if (!isNaN(height)) {
			this.setState({
				listRowHeight: height
			});
		} else {
			this.refs.listElementHeight.value = this.state.listRowHeight;
		}
	}

	onChangeMultiselect(e) {
		e.preventDefault();
		let multi = null, selection = this.state.selection ? this.state.selection[0] : null;
		if (this.refs.multi.value == 'true') multi = true;
		else multi = false;

		this.setState({
			multiSelect: multi,
			selection: selection
		});
	}

	onChangeLang(e) {
		e.preventDefault();

		this.setState({
			language: this.refs.lang.value
		});
	}

	render() {
		let filter = !this.state.filterOff ? this.filter.bind(this) : null;
		let multiSelect = this.state.multiSelect, language = this.state.language;

	    return (
	    	<div>
		    	<div style={{position: 'absolute', 'width': '100%',top: '5%', left: '40%', display:'inline-flex'}}>
	    			<h1><a href="https://github.com/CBIConsulting/ProperSearch/blob/dev/examples/jsx/app.js"> Code </a></h1>
	    			<button className="btn btn-default" style={{width: 150, height: 40, marginLeft: '40px'}} onClick={this.onChangeData.bind(this)}> Random Data </button>
	    		</div>
		    	<div style={{position: 'absolute', width: '100%', top: '20%'}}>
				    <div style={{position: 'absolute', top: 0, left: '10%',  width: '20%'}}>
				        <div style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}}>
				          	<form className="form-horizontal" role="form">
				          		<div className="form-group">
					                <label> List elements: </label>
					                <div className="form-inline">
					                	<input ref="dataSize" type="text" className="form-control" placeholder="Number of elements" defaultValue={this.state.dataSize} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeSize.bind(this)}>-></button>
					            	</div>
					            </div>
				          		<div className="form-group">
					                <label> Id-Field: </label>
					                <div className="form-inline">
					                	<input ref="idField" type="text" className="form-control" placeholder="Id Field" defaultValue={this.state.idField} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeIdField.bind(this)}>-></button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> Display-Field: </label>
					                <div className="form-inline">
					                	<input ref="displayField" type="text" className="form-control" placeholder="Display Field" defaultValue={this.state.displayField} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeDisplay.bind(this)}>-></button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> List Height: </label>
					                <div className="form-inline">
					                	<input ref="listHeight" type="text" className="form-control" placeholder="List Height" defaultValue={this.state.listHeight} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeListHeight.bind(this)}>-></button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> List Element Height: </label>
					                <div className="form-inline">
					                	<input ref="listElementHeight" type="text" className="form-control" id="listElementHeight" placeholder="List Element Height" defaultValue={this.state.listRowHeight} style={{marginRight: '30px'}}/>
					            		<button className="btn btn-default" onClick={this.onChangeElementHeight.bind(this)}>-></button>
					            	</div>
					            </div>
					            <div className="form-group">
					                <label> Multiselect </label>
					                <div className="form-inline">
					                  <select ref="multi" className="form-control" id="multiselect_id" defaultValue={multiSelect} onChange={this.onChangeMultiselect.bind(this)}>
					                    <option value={true}>Yes</option>
					                    <option value={false}>No</option>
					                  </select>
					                </div>
					            </div>
					            <div className="form-group">
					                <label> Language: </label>
					               	<div className="form-inline">
					                  <select ref="lang" className="form-control input" id="language" defaultValue={language}  onChange={this.onChangeLang.bind(this)}>
					                    <option value="SPA">Spanish</option>
					                    <option value="ENG">English</option>
					                  </select>
					                </div>
					            </div>
				          </form>
				        </div>
				    </div>
				    <div style={{position: 'absolute', top: 0, left: '33%',  width: '45%'}}>
				        <div id="canvas" style={{position: 'absolute', top: 0, bottom: 0, width:' 40%'}}>
				        	<Search
								data={this.state.data}
								idField={this.state.idField}
								displayField={this.state.displayField}
								listHeight={this.state.listHeight}
								listRowHeight={this.state.listRowHeight}
								lang={this.state.language}
								filter={filter}
								multiSelect={this.state.multiSelect}
								defaultSelection={this.state.selection}
								defaultSearch={this.state.defaultSearch}
								placeholder={this.state.placeholder}
								afterSelect={this.afterSelect.bind(this)}
								afterSearch={this.afterSearch.bind(this)}
								allowsEmptySelection={false}
							/>
				        </div>
				        <div id="canvas" style={{position: 'absolute', top: 0, bottom: 0, left:'55%', width:' 30%'}}>
				        	<Search
								data={this.state.data}
								idField={this.state.idField}
								displayField={this.state.displayField}
								listHeight={this.state.listHeight}
								listRowHeight={this.state.listRowHeight}
								lang={this.state.language}
								filter={filter}
								multiSelect={this.state.multiSelect}
								defaultSelection={this.state.selection}
								defaultSearch={this.state.defaultSearch}
								placeholder={this.state.placeholder}
								afterSelect={this.afterSelect.bind(this)}
								afterSearch={this.afterSearch.bind(this)}
								allowsEmptySelection={true}
							/>
							&nbsp;
							<h5> Get Empty values allowed (the empty values never get rendered "", just get that data after click the button, with selection [""]) </h5>
				        </div>
				    </div>
				</div>
			</div>
	    );
	}
}

App.defaultProps = getDefaultProps();

export default App;