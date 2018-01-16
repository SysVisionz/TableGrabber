let lastColumn = [];
let lastColumnStyles = [];
let columnVals = [];
let uniqueColumnVals = [];
let lastInput = [];

const sortMessage = (msg, sender, sendResponse) => {
	const {action, data} = msg;
	switch(action){
		case 'column':
			sendResponse();
			document.addEventListener("mouseover", highlightColumn);
			document.addEventListener("click", columnClick);
			break;
		case 'input':
			sendResponse();
			uniqueColumnVals = data;
			document.addEventListener("mouseover", highlightInput);
			document.addEventListener("click", inputClick);
			break;
		case 'scan':
			sendResponse();
			for (let i of data){
				let script = document.createElement('script');
				script.textContent = `if (scan){scan('${i}')}`;
				(document.head||document.documentElement).appendChild(script);
				script.remove();
			}
			break;
		default:
			console.log('invalid input');
			break;
	}
	return true;
};

browser.runtime.onMessage.addListener(sortMessage);

const inputRepeat = (msg) => {
	const {target, key} = msg;
	if (key == 'Enter'){
		if (uniqueColumnVals[0]){
			target.value=uniqueColumnVals.shift();
			target.focus();
		}
		else{
			document.removeEventListener('keyup', inputRepeat);
			alert("No remaining data entries.");
		}
	}
};

const highlightColumn = (event) => {
	let column = [];
	let parentArray = [];
	let parentItems = [];
	let rowsList = [];
	let parentTags = [];
	let rowElem;
	let elem = event.target;
	let colNum;
	while (elem){
		parentTags.push(elem.tagName);
		parentItems.push(elem);
		elem = elem.parentNode;
	}
	if (parentTags.indexOf('TABLE') != -1 && event.target.tagName == 'TD'){
		for (let i = 0; i < parentTags.length; i++){
			if (parentTags[i] == 'TR'){
				rowElem=parentItems[i];
				break;
			}
		}
		let row = rowElem.querySelectorAll('td');
		for (let i = 0; i < row.length; i++){
			if (row[i] == event.target){
				colNum = i;
				break;
			}
		}
		for (let i of rowElem.parentNode.querySelectorAll('tr')){
			if (i.querySelectorAll('td')[colNum])
				column.push(i.querySelectorAll('td')[colNum]);
		}
		if (lastColumn && lastColumn.indexOf(event.target) == -1){
			for (let i of lastColumnStyles){
				i[0].style = i[1];
			}
		}
		lastColumn = column;
		for (let i of lastColumn){
			lastColumnStyles.push([i, i.style]);
		}
		column[0].style.boxShadow='-15px 0 15px -15px #FF0000 inset, 15px 0 15px -15px #FF0000 inset, 15px 15px 15px -15px #FF0000 inset';
		column[column.length-1].style.boxShadow='-15px 0 15px -15px #FF0000 inset, 15px 0 15px -15px #FF0000 inset, 15px -15px 15px -15px #FF0000 inset';
		for (let i = 1; i < column.length-1; i++){
			column[i].style.boxShadow='-15px 0 15px -15px #FF0000 inset, 15px 0 15px -15px #FF0000 inset';
		}
		columnVals=[];
		for (let i of column){
			columnVals.push(i.innerText);
		}
	}
};

const columnClick = () => {
	if (lastColumn){
		for (let i of lastColumnStyles){
			i[0].style = i[1];
		}
	}
	if (columnVals[0]){
		browser.runtime.sendMessage({action: 'setData', data: columnVals});
	}
	document.removeEventListener("mouseover", highlightColumn);
	document.removeEventListener("click", columnClick);
};

const highlightInput = (event) => {
	if (lastInput[0] && event.target != lastInput[0])
		lastInput[0].style = lastInput[1];
	if (event.target.tagName == 'INPUT'){
		lastInput=[event.target, event.target.style];
		event.target.style.boxShadow='0 0 5px 5px #FF0000';
	}
};

const inputClick = (event) => {
		if (lastInput[0] && event.target == lastInput[0] && event.target.tagName == 'INPUT'){
			if (lastInput[0]){
				lastInput[0].style = lastInput[1];
			}
			let script = document.createElement('script');
			script.textContent = `var event = new CustomEvent('keydown', {bubbles: true, cancelable: true}); event.keyCode = 13; event.which=13;`;
			(document.head||document.documentElement).appendChild(script);
			script.remove();
			let inter = setInterval(() => {
				event.target.value=uniqueColumnVals.shift();
				event.target.focus();
				let script = document.createElement('script');
				script.textContent = `document.activeElement.dispatchEvent(event)`;
				(document.head||document.documentElement).appendChild(script);
				script.remove();
				if (!uniqueColumnVals[0])
					clearInterval(inter);
			}, 1000);
		}
		document.removeEventListener("mouseover", highlightInput);
		document.removeEventListener("click", inputClick);
};