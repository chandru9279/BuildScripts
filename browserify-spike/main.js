var unique = require('uniq');

var data = [1, 2, 2, 3, 4, 5, 5, 5, 6];

try{
	window.alert(unique(data));
}
catch(e){
	console.log(unique(data));
}