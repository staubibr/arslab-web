'use strict';

import Core from '../../api-basic/tools/core.js';
import Dom from '../../api-basic/tools/dom.js';
import Net from '../../api-basic/tools/net.js';
import Templated from '../../api-basic/components/templated.js';
// import Zip from '../../api-web-devs/tools/zip.js';

export default Core.Templatable("Widget.RiseList", class RiseLoader extends Templated {

    constructor(id) {
        super(id);
		
		
		var path = location.href.split("/");
		
		path.pop();
		path.pop();
	    
	    	path.push('devs-logs');
	    
		path = path.join("/");
		
		// TODO : This is temporary, just to showcase how we could read from RISE. We need
		// to fix a bunch of issues with RISE before we can fully implement this.
		this.models = [{
				"name": "Alternate Bit Protocol Model",
				"type" : "DEVS",
				"url": path + "/ABP/"
			}, {
				"name": "Addiction Model",
				"type" : "Cell-DEVS",
				"url": path + "/Addiction/"
			}, {
				"name": "CO2 Model",
				"type" : "Cell-DEVS",
				"url": path + "/CO2/"
			}, {
				"name": "Farm Model",
				"type" : "DEVS",
				"url": path + "/Farm/"
			}, /*{
				"name": "Fire Model",
				"type" : "Cell-DEVS",
				"url": path + "/Fire/"
			}, */{
				"name": "Fire And Rain Model",
				"type" : "Cell-DEVS",
				"url": path + "/Fire and Rain/"
			}, /*{
				"name": "Life Model #1",
				"type" : "Cell-DEVS",
				"url": path + "/Life/1/"
			}, {
				"name": "Life Model #2",
				"type" : "Cell-DEVS",
				"url": path + "/Life/2/"
			}, {
				"name": "Life Model #3",
				"type" : "Cell-DEVS",
				"url": path + "/Life/3/"
			}, */{
				"name": "Logistic Urban Growth Model #1",
				"type" : "Cell-DEVS",
				"url": path + "/LUG/1/"
			}, {
				"name": "Logistic Urban Growth Model #2",
				"type" : "Cell-DEVS",
				"url": path + "/LUG/1/"
			}, {
				"name": "Logistic Urban Growth Model #3",
				"type" : "Cell-DEVS",
				"url": path + "/LUG/1/"
			}, /*{
				"name": "Swarm Model",
				"type" : "Cell-DEVS",
				"url": path + "/Swarm/"
			},*/ {
				"name": "Tumor Model",
				"type" : "Cell-DEVS",
				"url": path + "/Tumor/"
			}, {
				"name": "UAV Model",
				"type" : "Cell-DEVS",
				"url": path + "/UAV/"
			}, {
				"name": "Worm Model",
				"type" : "Cell-DEVS",
				"url": path + "/Worm/"
			}
		]
		
		this.models.forEach(m => this.AddModel(m));
    }

	AddModel(model) {
		var li = Dom.Create("li", { className:'model' }, this.Elem('list'));
		
		li.innerHTML = model.name;
		
		li.addEventListener("click", this.onLiModelClick_Handler.bind(this, model));
	}
	
    onLiModelClick_Handler(model, ev){
		this.Emit("ModelSelected", { model : model });
		
        this.getRiseModel(model);
    }

    getRiseModel(model){
		Dom.RemoveCss(this.Elem("wait"), "hidden");

		var p1 = Net.Request(`${model.url}simulation.json`, null, 'blob');
		var p2 = Net.Request(`${model.url}transitions.csv`, null, 'blob');
		var p3 = Net.JSON(`${model.url}options.json`);

		var defs = [p1, p2, p3];

		if (model.type == "DEVS") defs.push(Net.Request(`${model.url}diagram.svg`, null, 'blob'));

		var success = function(responses) {	
			Dom.AddCss(this.Elem("wait"), "hidden");	
			
			var options = responses[2];
	
			var files = [];
			
			files.push(new File([responses[0]], 'simulation.json'));
			files.push(new File([responses[1]], 'transitions.csv'));
			
			if (model.type == "DEVS") files.push(new File([responses[3]], 'diagram.svg'));
			
			this.Emit("FilesReady", { files : files, options : options });
		
			// Zip.LoadZip(blob).then(this.onZip_Loaded.bind(this), this.onError_Handler.bind(this));
		}.bind(this);

		Promise.all(defs).then(success, this.onError_Handler.bind(this));
    }
	/*
	onZip_Loaded(result) {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		this.Emit("FilesReady", { files : result.files });
	}
	*/

	onError_Handler(error) {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		this.Emit("error", { error:error });
	}

    Template(){
        return "<div class='rise-loader'>" + 
				  "<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
				  "<ul handle='list'></ul>" + 
			   "</div>";
    }
});
