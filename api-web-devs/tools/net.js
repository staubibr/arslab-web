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
	* TODO : Convert to fetch
	* TODO : Uniform error handling
	*
	*/
	
	static Request(url, headers, responseType, optional) {
		var d = Core.Defer();
		
		var xhttp = new XMLHttpRequest();
		
		xhttp.onreadystatechange = function() {
			if (this.readyState != 4) return;
		
			if (this.status == 404 && !!optional) d.Resolve(null);
		
			if (this.status == 200) d.Resolve(this.response);
			
			else d.Reject({ status:this.status, response:this.response });
		};
		
		xhttp.open("GET", url, true);
		
		if (headers) {
			for (var id in headers) xhttp.setRequestHeader(id, headers[id]);
		}
		
		if (responseType) xhttp.responseType = responseType;   
		
		xhttp.send();
		
		return d.promise;
	}
	
	static Fetch(url, options){
		var d = Core.Defer();
		var p = fetch(url, options);
		
		p.then((response) => {
			if (response.status == 200) d.Resolve(response);
			
			else response.text().then((text) => fail(new Error(text)), fail);
		}, fail);
		
		function fail(error) {
			d.Reject(error);
		}
		
		return d.promise;
	}
	
	static FetchBlob(url, options) {
		var d = Core.Defer();
		
		this.Fetch(url, options).then(response => {
			response.blob().then(blob => d.Resolve(blob), error => d.Reject(error));
		}, error => d.Reject(error));
		
		return d.promise;
	}
	
	static FetchText(url, options) {
		var d = Core.Defer();
		
		this.Fetch(url, options).then(response => {
			response.text().then(text => d.Resolve(text), error => d.Reject(error));
		}, error => d.Reject(error));
		
		return d.promise;
	}
	
	static FetchJson(url, options) {
		var d = Core.Defer();
		
		this.FetchText(url, options).then(text => d.Resolve(JSON.parse(text), error => d.Reject(error)));
		
		return d.promise;
	}
	
	static JSON(url, optional) {
		var d = Core.Defer();
		
		Net.Request(url, null, null, optional).then(r => d.Resolve(JSON.parse(r)), d.Reject);
				
		return d.promise;
	}
	
	static File(url, name, optional) {
		var d = Core.Defer();
		
		Net.Request(url, null, 'blob', optional).then(b => {			
			d.Resolve(b ? new File([b], name) : null);
		}, d.Reject);
		
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