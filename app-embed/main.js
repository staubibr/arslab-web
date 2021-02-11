import WDSV from 'http://206.12.94.204:8080/arslab-web/1.4/app-embed/WDSV.js';
import Net from '../api-web-devs/tools/net.js';

var params = { 
	id : Net.GetUrlParameter("id"),
	path: Net.GetUrlParameter("path")
}

var viewer = new WDSV(document.body, params);

viewer.On("Error", (error) => alert(error.toString()));