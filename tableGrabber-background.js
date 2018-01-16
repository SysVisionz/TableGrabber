let variableList = [];
let uniqueVariables = [];

const takeAction = ({action, data, id}) => {
	switch(action) {
		case 'setData':
			variableList = data;
			for (let i in variableList){
				variableList[i] = variableList[i].trim();
				if (variableList[i] == '')
					bugs.splice(i, 1);
			}
			uniqueVariables = [];
			for (let i of variableList){
				if (uniqueVariables.indexOf(i) == -1){
					uniqueVariables.push(i);
				}
			}
			break;
		case 'input':
			browser.tabs.sendMessage(id, {action: 'input', data: uniqueVariables});
			break;
		case 'scan':
			browser.tabs.sendMessage(id, {action: 'scan', data: variableList});
			break;
		default:
			console.log('invalid action');
	}
};

browser.runtime.onMessage.addListener(takeAction);