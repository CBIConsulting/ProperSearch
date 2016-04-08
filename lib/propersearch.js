"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _search = require("./components/search");

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (process.env.APP_ENV === 'browser') {
	require("../css/style.scss");
}

exports["default"] = _search2["default"];
module.exports = exports['default'];