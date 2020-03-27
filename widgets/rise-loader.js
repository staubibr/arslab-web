'use strict';

import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';
import Net from '../../basic-tools/tools/net.js';
import Templated from '../../basic-tools/components/templated.js';

export default Core.Templatable("Widget.RiseList", class RiseLoader extends Templated {

    constructor(id) {
        super(id);
		
		// TODO : Not sure this should go here
		// zip.workerScriptsPath = "./references/zip/";
		
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
		var li = Dom.Create("li", { className:'model' }, this.Node('list'));
		
		li.innerHTML = model.name;
		
		li.addEventListener("click", this.onLiModelClick_Handler.bind(this, model));
	}
	
    onLiModelClick_Handler(model, ev){
		// Dom.AddCss(this.Node("list"), "disabled");
		
		this.Emit("ModelSelected", { model : model });
				
        this.getRiseModel(model);
    }

    getRiseModel(model){
		var p = Net.Request(model.url, null, 'blob');

		var success = function(ev) {
			var blob = new Blob([ev.result], { type : "application/zip" });
			var r = new zip.BlobReader(blob);

			zip.createReader(r, this.ReadZip.bind(this), this.onError_Handler);
		}.bind(this);

		p.then(success, this.onError_Handler);
    }

	ReadEntry(entry) {
		var d = Lang.Defer();
		
		entry.getData(new zip.TextWriter(), function(text) {
			var blob = new Blob([text], { type: "text/plain" });
			var file = new File([blob], entry.filename);

			d.Resolve(file);
		});
				
		return d.promise;
	}

	ReadZip(reader) {
		reader.getEntries(function(entries) {
			var defs = entries.map(e => { return this.ReadEntry(e); });
						
			Promise.all(defs).then(function(data) {
				reader.close();
				
				var files = data.map(d => { return d.result; });
							
				// Dom.RemoveCss(this.Node("list"), "disabled");
			
				this.Emit("FilesReady", { files : files });
			}.bind(this));
		}.bind(this));
	}

	onError_Handler(error) {
		// Dom.RemoveCss(this.Node("list"), "disabled");
			
		alert(error.toString());
	}

    Template(){
        return "<ul handle='list'></ul>";
    }
});