'use strict';

import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';
import Net from '../../basic-tools/tools/net.js';
import Templated from '../../basic-tools/components/templated.js';
import Zip from '../../web-devs-tools/tools/zip.js';

export default Core.Templatable("Widget.RiseList", class RiseLoader extends Templated {

    constructor(id) {
        super(id);
		
		
		var path = location.href.split("/");
		
		path.pop();
		path = path.join("/");
		
		// TODO : This is temporary, just to showcase how we could read from RISE. We need
		// to fix a bunch of issues with RISE before we can fully implement this.
		this.models = [{
				"name": "Addiction Model",
				"url": path + "/log/Addiction/Addiction.zip"
			}, {
				"name": "CO2 Model",
				"url": path + "/log/CO2/CO2.zip"
			}, {
				"name": "Fire Model",
				"url": path + "/log/Fire/Fire.zip"
			}, {
				"name": "Fire And Rain Model",
				"url": path + "/log/Fire and Rain/Fire and Rain.zip"
			}, {
				"name": "Life Model",
				"url": path + "/log/Life/2/2.zip"
			}, {
				"name": "Logistic Urban Growth Model",
				"url": path + "/log/Logistic Urban Growth/4/4.zip"
			}, {
				"name": "Swarm Model",
				"url": path + "/log/Swarm/Swarm.zip"
			}, {
				"name": "Tumor Model",
				"url": path + "/log/Tumor/Tumor.zip"
			}, {
				"name": "UAV Model",
				"url": path + "/log/UAV/UAV.zip"
			}, {
				"name": "Worm Model",
				"url": path + "/log/Worm/Worm.zip"
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
		
		var p = Net.Request(model.url, null, 'blob');

		var success = function(ev) {
			var blob = new Blob([ev.result], { type : "application/zip" });
			
			Zip.LoadZip(blob).then(this.onZip_Loaded.bind(this), this.onError_Handler.bind(this));
		}.bind(this);

		p.then(success, this.onError_Handler.bind(this));
    }

	onZip_Loaded(ev) {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		this.Emit("FilesReady", { files : ev.result.files });
	}

	onError_Handler(ev) {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		this.Emit("error", { error:ev.error });
	}

    Template(){
        return "<div class='rise-loader'>" + 
				  "<div handle='wait' class='wait hidden'>" + 
					"<img src='./assets/loading.svg'>" +
				  "</div>" + 
				  "<ul handle='list'></ul>" + 
			   "</div>";
    }
});