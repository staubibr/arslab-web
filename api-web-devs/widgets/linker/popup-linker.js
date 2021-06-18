'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';
import Popup from '../../ui/popup.js';
import Linker from './linker-mod-2.js';
import ChunkReader from '../../components/chunkReader.js';

export default Core.Templatable("Popup.Linker", class PopupLinker extends Popup { 
	
	get structure_file() { 	
		var content = [JSON.stringify(this.structure)];
	
		return new File(content, "structure.json", { type:"application/json", endings:'native' });
	}
	
	get diagram_file() { 	
		var content = [this.diagram];
		
		return new File(content, "diagram.svg", { type:"image/svg+xml", endings:'native' });
	}
	
	constructor(id) {
		super(id);
	}
	
	async Show(fStructure, fDiagram) {
		Dom.Empty(this.Elem('body'));
				
		var structure = await ChunkReader.ReadAsJson(fStructure);
		var diagram = await ChunkReader.ReadAsText(fDiagram);
		
		var options = {
			files: {
				json: this.GetContent(structure),
				diagram: diagram
			},
			handlers : {
				clear: () => this.linker.clear(),
				reset: () => this.linker.reset(),
				thicken: () => this.linker.thicken(3),
			},
			selector : Linker.SVG_FORMAT.DRAW_IO,
			configuration: {
				"models":{
					caption: 'Models',
					empty: 'No models found in the structure file.',
					label: (d => `<b>${d.id}</b>`)
				},
				"ports":{
					caption: 'Output ports',
					empty: 'No output ports found in the structure file.',
					label: (d => `<div><b>${d.name}</b> @ <b>${d.model_id}</b></div>`)
				},
				"links":{
					caption: 'Links',
					empty: 'No links found in the structure file.',
					label: (d => `<div><b>${d.portA}</b> @ <b>${d.modelA}</b> to</div><div><b>${d.portB}</b> @ <b>${d.modelB}</b></div>`)
				}
			}
		}

		this.linker = new Linker(this.Elem('body'), options);
		
		return super.Show().then(this.onLinker_Complete.bind(this, structure));
	}
	
	onLinker_Complete(structure, ev) {
		this.linker.resetSvg();
		
		this.linker.json.models.forEach(m => structure.nodes[m.index].svg = m.svg);
		this.linker.json.ports.forEach(p => structure.nodes[p.index].svg = p.svg);
		this.linker.json.links.forEach(l => structure.links[l.index].svg = l.svg);
		
		this.structure = structure;
		this.diagram = this.linker.svg;
	}
	
	GetContent(structure) {
		structure.nodes.forEach((n, i) => n.index = i);
		
		var models = structure.nodes.filter(n => "model_type" in n);
		
		models = models.map((m, i) => {
			return {
				index: m.index,
				id: m.id,
				type: structure.model_types[m.model_type].type,
				svg: m.svg
			}
		});
		
		var ports = structure.nodes.filter(n => {
			if (!("model_id" in n && "port_type" in n)) return false;
			
			return structure.port_types[n.port_type].type == "output";
		});
		
		ports = ports.map((p, i) => {
			return {
				index: p.index,
				model_id: p.model_id,
				name: structure.port_types[p.port_type].name,
				svg: p.svg
			}
		});
		
		var links = structure.links.map((l, i) => {
			return {
				index: i,
				modelA: l.modelA,
				modelB: l.modelB,
				portA: l.portA,
				portB: l.portB,
				svg: l.svg
			}
		});
		
		return { models: models, ports: ports, links: links }
	}
	
	Template() {
		return "<div handle='popup' class='popup popup-linker'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'>nls(Popup_Linker_Title)</h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body' handle='body'>" + 

				  "</div>" +
			   "</div>";
	}
	
	static Nls() {
		return {
			"Popup_Close": {
				"en": "Close",
				"fr": "Fermer"
			},
			"Popup_Linker_Title" : {
				"en":"DEVS Diagram Linker"
			}
		}
	}
});