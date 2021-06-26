'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';
import Popup from '../../ui/popup.js';
import Linker from './linker.js';
import ChunkReader from '../../components/chunkReader.js';

export default Core.Templatable("Popup.Linker", class PopupLinker extends Popup { 
	
	get svg_file() { return this.linker.svg_file; }
	
	constructor(id) {
		super(id);
	}
	
	async Initialize(simulation, diagram) {
		Dom.Empty(this.Elem('body'));
		
		this.simulation = simulation;
		
		var ports = [];
		
		var diagram = await ChunkReader.ReadAsText(diagram);
		
		simulation.models.forEach(m => {
			m.ports.forEach(p => ports.push({ model:m, port:p }));
		});
		
		var options = {
			diagram: diagram,
			selector : Linker.SVG_FORMAT.DRAW_IO,
			pages: [{
				caption: 'Models',
				empty: 'No models found in the structure file.',
				label: d => `<b>${d.id}</b>`,
				items: simulation.models,
				attrs: {
					"devs-model-id" : d => d.id
				}
			}, {
				caption: 'Output ports',
				empty: 'No output ports found in the structure file.',
				label: d => `<div><b>${d.port.name}</b> @ <b>${d.model.id}</b></div>`,
				items: ports,
				attrs: {
					"devs-port-model" :  d => d.model.id,
					"devs-port-name" : d => d.port.name
				}
			}, {
				caption: 'Links',
				empty: 'No links found in the structure file.',
				label: d => `<div><b>${d.portA.name}</b> @ <b>${d.modelA.id}</b> to</div><div><b>${d.portB.name}</b> @ <b>${d.modelB.id}</b></div>`,
				items: simulation.links,
				attrs: {
					"devs-link-mA" : d => d.modelA.id,
					"devs-link-pA" : d => d.portA.name
				}
			}]
		}
		
		this.linker = new Linker(this.Elem('body'), options);
	}
	
	Show() {		
		return super.Show().then(this.onLinker_Complete.bind(this));
	}
	
	onLinker_Complete(ev) {
		this.linker.Reset();
		
		this.simulation.diagram = this.simulation.LoadSVG(this.linker.svg.innerHTML);
	}
	
	Template() {
		return "<div handle='popup' class='popup'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'>nls(Popup_Linker_Title)</h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body popup-linker' handle='body'>" + 

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