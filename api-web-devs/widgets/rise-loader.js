'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Net from '../tools/net.js';
import Templated from '../components/templated.js';

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
				"name": "Alternate Bit Protocol",
				"type" : "DEVS",
				"url": path + "/ABP/"
			}, {
				"name": "Drugs and Addiction",
				"type" : "Cell-DEVS",
				"url": path + "/Addiction/Final/"
			}, {
				"name": "Classroom CO2",
				"type" : "Cell-DEVS",
				"url": path + "/CO2/"
			}, {
				"name": "COVID (TR 0.4, DR 0.01)",
				"type" : "Cell-DEVS",
				"url": path + "/COVID/tr_0.4_dr_0.01/"
			}, {
				"name": "Employee Behaviour",
				"type" : "Cell-DEVS",
				"url": path + "/Employee Behaviour/2/"
			}, {
				"name": "Agricultural Farm",
				"type" : "DEVS",
				"url": path + "/Farm/"
			}, {
				"name": "Fire Spread",
				"type" : "Cell-DEVS",
				"url": path + "/Fire/"
			}, {
				"name": "Fire And Rain",
				"type" : "Cell-DEVS",
				"url": path + "/Fire and Rain/"
			}, {
				"name": "Food Chain",
				"type" : "Cell-DEVS",
				"url": path + "/Food Chain/"
			}, {
				"name": "Logistic Urban Growth Model #1",
				"type" : "Cell-DEVS",
				"url": path + "/LUG/1/"
			}, {
				"name": "Logistic Urban Growth Model #2",
				"type" : "Cell-DEVS",
				"url": path + "/LUG/2/"
			}, {
				"name": "Logistic Urban Growth Model #3",
				"type" : "Cell-DEVS",
				"url": path + "/LUG/3/"
			}, {
				"name": "Lynx & Hare",
				"type" : "Cell-DEVS",
				"url": path + "/Lynx Hare/"
			}, {
				"name": "Sheeps on a Ranch",
				"type" : "Cell-DEVS",
				"url": path + "/Ranch/hot/"
			}, {
				"name": "Settlement Growth",
				"type" : "Cell-DEVS",
				"url": path + "/Region/"
			}, {
				"name": "Smog",
				"type" : "Cell-DEVS",
				"url": path + "/Smog/"
			}, {
				"name": "Tumor Growth",
				"type" : "Cell-DEVS",
				"url": path + "/Tumor/"
			}, {
				"name": "UAV Search",
				"type" : "Cell-DEVS",
				"url": path + "/UAV/"
			}, {
				"name": "Worm",
				"type" : "Cell-DEVS",
				"url": path + "/Worm/"
			}, {
				"name": "Worm Spread",
				"type" : "Cell-DEVS",
				"url": path + "/Worm Spread/"
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
		var p3 = Net.Request(`${model.url}options.json`, null, 'blob');

		var defs = [p1, p2, p3];

		if (model.type == "DEVS") defs.push(Net.Request(`${model.url}diagram.svg`, null, 'blob'));

		var success = function(responses) {	
			Dom.AddCss(this.Elem("wait"), "hidden");	
			
			var options = responses[2];
	
			var files = [];
			
			files.push(new File([responses[0]], 'simulation.json'));
			files.push(new File([responses[1]], 'transitions.csv'));
			files.push(new File([responses[2]], 'options.json'));
			
			if (model.type == "DEVS") files.push(new File([responses[3]], 'diagram.svg'));
			
			this.Emit("filesready", { files : files });
		}.bind(this);

		Promise.all(defs).then(success, this.onError_Handler.bind(this));
    }

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
