document.addEventListener('DOMContentLoaded', ()=> {
	document.getElementById('svzColumn').addEventListener('click', () => {
		browser.tabs.query({
			currentWindow: true,
			active: true
		})
		.then(response => {
			browser.tabs.sendMessage(response[0].id, {action: 'column'})
			.then(() => window.close());
		});
	});
	document.getElementById('svzInput').addEventListener('click', () => {
		browser.tabs.query({
			currentWindow: true,
			active: true
		})
		.then(response => { 
			browser.runtime.sendMessage({action: 'input', id: response[0].id})
			.then(() => window.close());
		})
	});
	document.getElementById('svzScan').addEventListener('click', () => {
		browser.tabs.query({
			currentWindow: true,
			active: true
		})
		.then(response => { 
			browser.runtime.sendMessage({action: 'scan', id: response[0].id})
			.then(() => window.close());
		});
	});
});