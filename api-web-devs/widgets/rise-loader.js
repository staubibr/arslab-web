'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Net from '../tools/net.js';
import Templated from '../components/templated.js';
import Popup from '../ui/popup.js';

export default Core.Templatable("Widget.RiseList", class RiseLoader extends Popup {

    constructor(id) {
        super(id);
		
        if (!Core.URLs.models) throw new Error("Config Error: rise url not defined in application configuration.");

		var path = Core.URLs.models;
		
		// TODO : This is temporary, just to showcase how we could read from RISE. We need
		// to fix a bunch of issues with RISE before we can fully implement this.
		this.models = [{
				"name": "Alternate Bit Protocol",
				"type" : "DEVS",
				"url": path + "/ABP/"
			}, {
				"name": "Crime and Drugs",
				"type" : "Cell-DEVS",
				"url": path + "/Crime and Drugs/Final/"
			}, {
				"name": "Classroom CO2",
				"type" : "Cell-DEVS",
				"url": path + "/CO2/"
			}, {
				"name": "COVID",
				"type" : "Cell-DEVS",
				"url": path + "/COVID/"
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
				"url": path + "/Settlement Growth/"
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
				"url": path + "/Worm Spreading/"
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

		var p1 = Net.File(`${model.url}structure.json`, 'structure.json');
		var p2 = Net.File(`${model.url}messages.log`, 'messages.log');
		var p3 = Net.File(`${model.url}style.json`, 'style.json', true);
		var p4 = Net.File(`${model.url}diagram.svg`, 'diagram.svg', true);
		var p5 = Net.File(`${model.url}visualization.json`, 'visualization.json', true);
		
		var success = function(files) {			
			Dom.AddCss(this.Elem("wait"), "hidden");	
			
			files = files.filter(f => f != null);
			
			this.Emit("filesready", { files : files });
		}.bind(this);

		Promise.all([p1, p2, p3, p4, p5]).then(success, this.onError_Handler.bind(this));
    }

	onError_Handler(error) {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		this.Emit("error", { error:error });
	}

    Template(){
		return "<div handle='popup' class='popup popup-rise-loader'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'>nls(Popup_Rise_Title)</h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body' handle='body'>"+
						"<div class='rise-loader'>" + 
							"<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
							"<ul handle='list'></ul>" + 
						"</div>"
				  "</div>" +
				  "<div class='popup-footer' handle='footer'></div>" +
			   "</div>";
    }
	
	static Nls() {
		return { 
			"Popup_Close": {
				"en": "Close",
				"fr": "Fermer"
			}, 
			"Popup_Rise_Title" : {
				"en": "Load from RISE",
				"fr": "Charger de RISE"
			}
		
		}
	}
});
