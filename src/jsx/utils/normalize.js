const charMap =  {
	'a': ['á','Á','à','À','ã','Ã','â','Â','ä','Ä','å','Å','ā','Ā','ą','Ą'],
	'e': ['é','É','è','È','ê','Ê','ë','Ë','ē','Ē','ė','Ė','ę','Ę'],
	'i': ['î','Î','í','Í','ì','Ì','ï','Ï','ī','Ī','į','Į'],
	'l': ['ł', 'Ł'],
	'o': ['ô','Ô','ò','Ò','ø','Ø','ō','Ō','ó','Ó','õ','Õ','ö','Ö'],
	'u': ['û','Û','ú','Ú','ù','Ù','ü','Ü','ū','Ū'],
	'c': ['ç','Ç','č','Č','ć','Ć'],
	's': ['ś','Ś','š','Š'],
	'z': ['ź','Ź','ż','Ż'],
	'' : ['@','#','~','$','!','º','|','"','·','%','&','¬','/','(',')','=','?','¿','¡','*','+','^','`','-','´','{','}','ç',';',':','.'],
}

export default {
	normalize: function (value, parseToLower = true) {
		let rex = null;

		for(let char in charMap){
			rex = new RegExp('[' + charMap[char].toString() + ']', 'g');

			try{
				value = value.replace(rex, char);
			} catch(e) {
				console.log('error', value);
			}
		}
		return parseToLower ? value.toLowerCase() : value;
	}
}