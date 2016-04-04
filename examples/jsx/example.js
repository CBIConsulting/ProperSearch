import Search from "../../src/jsx/propersearch";

const body = document.getElementById('canvas');
const data = [];

for (var i = 10000; i >= 0; i--) {
	data.push({value: 'item-' + i, label: 'Item ' + i});
};

const afterSelect = (data, selection) => {
	console.info(data);
	console.info(selection);
}

ReactDOM.render(<Search data={data} multiSelect={true} afterSelect={afterSelect}/>, body);