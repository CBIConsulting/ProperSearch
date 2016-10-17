'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var charMap = {
	'a': ['á', 'Á', 'à', 'À', 'ã', 'Ã', 'â', 'Â', 'ä', 'Ä', 'å', 'Å', 'ā', 'Ā', 'ą', 'Ą'],
	'e': ['é', 'É', 'è', 'È', 'ê', 'Ê', 'ë', 'Ë', 'ē', 'Ē', 'ė', 'Ė', 'ę', 'Ę'],
	'i': ['î', 'Î', 'í', 'Í', 'ì', 'Ì', 'ï', 'Ï', 'ī', 'Ī', 'į', 'Į'],
	'l': ['ł', 'Ł'],
	'o': ['ô', 'Ô', 'ò', 'Ò', 'ø', 'Ø', 'ō', 'Ō', 'ó', 'Ó', 'õ', 'Õ', 'ö', 'Ö'],
	'u': ['û', 'Û', 'ú', 'Ú', 'ù', 'Ù', 'ü', 'Ü', 'ū', 'Ū'],
	'c': ['ç', 'Ç', 'č', 'Č', 'ć', 'Ć'],
	's': ['ś', 'Ś', 'š', 'Š'],
	'z': ['ź', 'Ź', 'ż', 'Ż'],
	'': ['@', '#', '~', '$', '!', 'º', '|', '"', '·', '%', '&', '¬', '/', '(', ')', '=', '?', '¿', '¡', '*', '+', '^', '`', '-', '´', '{', '}', 'ç', ';', ':', '.']
};

exports['default'] = {
	normalize: function normalize(value) {
		var parseToLower = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		var rex = null;

		for (var char in charMap) {
			rex = new RegExp('[' + charMap[char].toString() + ']', 'g');

			try {
				value = value.replace(rex, char);
			} catch (e) {
				console.log('error', value);
			}
		}
		return parseToLower ? value.toLowerCase() : value;
	}
};
module.exports = exports['default'];