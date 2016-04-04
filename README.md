# ProperSearch
====================================
[![Build Status](https://travis-ci.org/CBIConsulting/ProperSearch.svg)](https://travis-ci.org/CBIConsulting/ProperSearch)

A proper search component for react. With a search field and a list of items allows the user to filter that list and select the items. The component return the
selected data when it's selected. Allows multi and single selection. The list is virtual rendered, was designed to handle thousands items without sacrificing
performance, only render the items in the view. Used react-virtualized to render the list items.

Used technologies:

- React
- ES6
- Webpack
- Babel
- Node
- Compass
- Jasmine
- Karma



Features of ProperSearch:

* Data selection allowed from a list
* List filtering on search
* Allow multi and single selection
* Return the selection
* List virtual rendered


The compile and compressed ProperTable distribution file can be found in the dist folder along with the css file. Add the default stylesheet `dist/propertable.min.css`, then import it into any module.

##External dependencies
* React and React DOM
* Underscore


## Preview
![screen shot 2016-04-04 at 11 40 00] (examples/screenshots/example.png "Example of ProperSearch with multiselect")


## How to start

Run:
```
npm install
npm start
```

Check your http://localhost:8080/ or  `open http://localhost:8080/`

## How to test

`npm test`

### Component properties
* data: List data. (Array)
 	* value: Id name. (String)
 	* label: Name to show (String)
* messages: Get the translated messages of the lang selected in the property lang. Default ENG (An example can be found in src/lang)
	* Default:
	```javascript
		'ENG': {
			all: 'Select All',
			none: 'Unselect All',
			loading: 'Loading...',
			noData:'No data found'
		}
	```
* lang: Language for the messages (String)
* defaultSelection: Items of the list selected by default. (React eS6 Set) Default new Set()
* multiSelect: Type of the selection, multiple or single (Boolean)
* listWidth: Custom width for the list under the search field (Integer) Default component's width.
* listHeight: Height of the list. Default 200 (Integer)
* listRowHeight: Height of each row of the list
* afterSelect: Function called after select a row. Return the seleted rows.
	* Ex:
	```javascript
		afterSelect ={
			function(data, selection){
				console.info(data); // Selected data
				console.info(selection); // Array of selected values
			}
		}
	```
* afterSearch: Function called after type something into the search field. Return the written string.
	* Ex:
	```javascript
		afterSearch={
			function(search_string) {
				console.log('Filtering by: ', search_string);
			}
		}
	```
* fieldClass: ClassName for the search field (String)
* listClass: ClassName for the list (String)
* className: ClassName for the component container (String)
* placeholder: Placeholder for the search field (String) Default 'Search...'
* searchIcon: ClassName for the search icon in the left of the search field (String) Default 'fa fa-search fa-fw' (FontAwesome)
* clearIcon: ClassName for the clear icon inside the clear button in the right side of the search field. (String) Default 'fa fa-times fa-fw' (FontAwesome)
* throttle: Time between filtering action and the next. It affects to the search field onChange method setting an timeout (Integer) Default 160
* minLength: Min. length of the written string in the search field to start filtering. (Integer) Default 3
* onEnter: Custom function to be called on Enter key up.

### Basic Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import ProperSearch from 'ProperSearch';

// Function Called after select items in the list.

const afterSelect = (data, selection) => {
	console.info(data);
	console.info(selection);
}

// List data
const data = [];

for (var i = 10000; i >= 0; i--) {
	data.push({value: 'item-' + i, label: 'Item ' + i});
}

// Render the Search component
ReactDOM.render(
	<Search
		data={data}
		multiSelect={true}
		afterSelect={afterSelect}
	/>,
	document.getElementById('example')
);
```


Contributions
------------

Use [GitHub issues](https://github.com/CBIConsulting/ProperSearch/issues) for requests.

Changelog
---------

Changes are tracked as [GitHub releases](https://github.com/CBIConsulting/ProperSearch/releases).