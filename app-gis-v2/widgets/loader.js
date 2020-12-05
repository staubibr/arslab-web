'use strict';

import Core from '../../api-web-devs/tools/core.js';
import Dom from '../../api-web-devs/tools/dom.js';
import oSettings from '../../api-web-devs/components/settings.js';
import Templated from '../../api-web-devs/components/templated.js';
import ChunkReader from '../../api-web-devs/components/chunkReader.js';
import BoxInput from '../../api-web-devs/ui/box-input-files.js';
import Standardized from '../../api-web-devs/parsers/standardized.js';
import SimulationIRR from '../../api-web-devs/simulation/simulationIRR.js';


// A lot of async going on, sorry.
export default Core.Templatable("Widget.Loader", class Loader extends Templated { 
	
	get Files() {
		return this.Widget("dropzone").files;
	}
	

	constructor(node) {		
		super(node);
						
		this.Node("parse").On("click", this.onParseButton_Click.bind(this));
		this.Node("clear").On("click", this.onClearButton_Click.bind(this));
		this.Widget("dropzone").On("change", this.onDropzone_Change.bind(this));
	}
	
	UpdateButton() {		
		this.Elem("parse").disabled = (this.Files.length == 0);
	}
		
	onDropzone_Change(ev) {		
		this.UpdateButton();
	}
		
	onParseButton_Click(ev) {
		Dom.RemoveCss(this.Elem("wait"), "hidden");
		
		this.Emit("ready", { files: this.Files });
	}
	
	onClearButton_Click(ev) {
		this.Widget("dropzone").Clear();
		
		this.UpdateButton();
	}
	
	Template() {
		return "<div class='loader'>" +
				  "<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
			      "<div handle='dropzone' widget='Widget.Box-Input-Files'></div>" +
				  "<div>" +
					 "<button handle='clear' class='clear'>nls(Loader_Clear)</button>" +
					 "<button handle='parse' class='parse' disabled>nls(Loader_Parse)</button>" +
			      "</div>" +
			   "</div>";
	}
});
