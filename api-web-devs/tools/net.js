import Core from './core.js';

export default class Net {
	
	/**
	* Execute a web request
	*
	* Parameters :
	*	url : String, the request URL
	* Return : none
	*
	* TODO : This should return a promise object but (ie11)
	*
	*/
	static Fetch(url, options, optional){
		var d = Core.Defer();
		var p = fetch(url, options);
		
		p.then((response) => {
			if (response.status == 200) d.Resolve(response);
		
			else if (response.status > 399 && response.status < 500 && !!optional) d.Resolve(null);
			
			else d.Reject(new Error(`Url ${url} returned ${response.status} ${response.statusText}`));
		}, (error) => d.Reject(error));

		return d.promise;
	}
	
	static FetchBlob(url, options, optional) {
		var d = Core.Defer();
		
		this.Fetch(url, options, optional).then(response => {
			if (response == null) d.Resolve(null);
			
			else response.blob().then(blob => d.Resolve(blob), error => d.Reject(error));
		}, error => d.Reject(error));
		
		return d.promise;
	}
	
	static FetchText(url, options, optional) {
		var d = Core.Defer();
		
		this.Fetch(url, options, optional).then(response => {
			if (response == null) d.Resolve(null);
			
			else response.text().then(text => d.Resolve(text), error => d.Reject(error));
		}, error => d.Reject(error));
		
		return d.promise;
	}
	
	static JSON(url, options, optional) {
		var d = Core.Defer();
		
		Net.FetchText(url, options, optional).then(text => {
			d.Resolve(text ? JSON.parse(text) : null);
		}, error => d.Reject(error));
		
		return d.promise;
	}

	static File(url, name, optional) {
		var d = Core.Defer();
		
		Net.FetchBlob(url, null, optional).then(b => {			
			d.Resolve(b ? new File([b], name) : null);
		}, error => d.Reject(error));
		
		return d.promise;
	}
	
	/**
	* Get a parameter value from the document URL
	*
	* Parameters :
	*	name : String, the name of the parameter to retrieve from the URL
	* Return : String, the value of the parameter from the URL, an empty string if not found
	*/
	static GetUrlParameter (name) {				
		name = name.replace(/[\[\]]/g, '\\$&');
		
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
		
		var results = regex.exec(window.location.href);
		
		if (!results) return null;
		
		if (!results[2]) return '';
		
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
	
	/**
	* Download content as a file
	*
	* Parameters :
	*	name : String, the name of the file to download
	*	content : String, the content of the file to save
	* Return : none
	*/
	static Download(name, content) {
		var link = document.createElement("a");
		
		// link.href = "data:application/octet-stream," + encodeURIComponent(content);
		link.href = URL.createObjectURL(content);
		link.download = name;
		link.click();
		link = null;
	}
	
	/**
	* Gets the base URL for the app
	*
	* Parameters : none
	* Return : String, the base path to the web app
	*/
	static AppPath() {
		var path = location.href.split("/");
		
		path.pop();
		
		return path.join("/");
	}
	
	/**
	* Gets the base URL for the app
	*
	* Parameters : none
	* Return : String, the base path to the web app
	*/
	static FilePath(file) {
		file = file.charAt(0) == "/" ? file.substr(1) : file;
		
		var path = [Net.AppPath(), file];
				
		return path.join("/");
	}
}