import Search from "../../src/jsx/propersearch";
import Normalizer from "normalizer";
import $ from "jquery";

const search = document.getElementById('canvas');
const button = document.getElementById('canvas2');

let data = [];
let selection = null;
let language = 'ENG';
let defaultSearch = '';
let multiSelect = true;
let listHeight = 200;
let listRowHeight = 26;

const buttonClick = (e, name) => {
	console.log('Button ' + name + ' has been clicked');
}

const filter = (listElement, value) => {
	let data = listElement.name.toLowerCase();
	data = Normalizer.normalize(data);
	return data.indexOf(value) >= 0;
}

const formater = listElement => {
	return <button className ="btn btn-default" onClick={ (e) => {buttonClick(e, listElement.name)} }>{ listElement.name }</button>;
}

const afterSelect = (data, selection) => {
	console.info('Data: ', data);
	console.info('Selection: ', selection);
}

const afterSearch = value => {
	console.info('Search: ', value);
}

for (let i = 10; i >= 0; i--) {
	data.push({itemID: 'item-' + i, display: formater, name: 'Tést ' + i,moreFields: 'moreFields values'});
};

// Modifying data with the fields
$( document ).ready(function() {
    $('#multiselect_id').on("change",(e) => {
    	if(e.target.value == '0') multiSelect = false;
    	else multiSelect = true;
    });
    console.log(multiSelect)
});

ReactDOM.render(
	<div>
		<Search
			data={data}
			idField={'itemID'}
			displayField={'display'}
			lang={language}
			filter={filter}
			multiSelect={multiSelect}
			defaultSelection={selection}
			defaultSearch={defaultSearch}
			placeholder={'Search placeHolder'}
			afterSelect={afterSelect}
			afterSearch={afterSearch}
		/>
	</div>,
	search
);

const changeData = e => {
	data = [];

	let i = Math.floor(Math.random()* 10);
	selection = ['item-'+i,'item-'+(i+1)];
	defaultSearch = 'Item '+i;

	listHeight += i;
	listRowHeight += i;
	multiSelect = !multiSelect;

	if (i % 2 == 0) language = 'ENG';
	else language = 'ESP';

	for (let i = (Math.floor(Math.random()* 1000) + 10); i >= 0; i--) {
		data.push({value: 'item-' + i, label: 'Item ' + i});
	}

	ReactDOM.render(
		<div>
			<Search
				data={data}
				lang={language}
				multiSelect={multiSelect}
				defaultSelection={selection}
				defaultSearch={defaultSearch}
				placeholder={'Another placeholder ' + i}
				afterSelect={afterSelect}
				afterSearch={afterSearch}
			/>
		</div>,
		search
	);
}

ReactDOM.render(<button className="btn btn-default" onClick={changeData}> Random Data </button>, button);