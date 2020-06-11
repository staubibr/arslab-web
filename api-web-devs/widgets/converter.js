'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Templated from '../components/templated.js';
import BoxInput from '../ui/box-input-files.js';

import Zip from '../../api-web-devs/tools/zip.js';

import CdppDevs	from '../parsers/CdppDevs.js';
import CdppCell	from '../parsers/CdppCell.js';
import LopezCell from '../parsers/LopezCell.js';

export default Core.Templatable("Widget.Converter", class Converter extends Templated { 
	
	get Disabled() {
		return this.Elem("parse").disabled;
	}
	
	get Simulator() {
		var node = this.Node("simulators").Node("input:checked");
		
		return node ? node.Element.value : null;
	}
	
	get Type() {
		var node = this.Node("types").Node("input:checked");
		
		return node ? node.Element.value : null;
	}
	
    static get PARSERS() {
        return {
			"CD++" : {
				"DEVS" : CdppDevs,
				"Cell-DEVS" : CdppCell
			},
			"Lopez" : {
				"DEVS" : null,
				"Cell-DEVS" : LopezCell
			},
			"Cadmium" : {
				"DEVS" : null,
				"Cell-DEVS" : null
			}
		};
    }
	
	constructor(node) {		
		super(node);
		
		this.files = null;
		
		var simulators = this.Node("simulators").Nodes("input");
		var types = this.Node("types").Nodes("input");

		simulators.forEach(input => {
			input.On('change', this.onSimulatorOption_Change.bind(this));
			input.On('change', this.onTypeOption_Change.bind(this));
		});
		
		types.forEach(input => {
			input.On('change', this.onTypeOption_Change.bind(this));
		});

		this.Node("parse").On("click", this.onParseButton_Click.bind(this));
		this.Widget("dropzone").On("change", this.onDropzone_Change.bind(this));
	}
	
	onDropzone_Change(ev) {
		this.files = ev.files;
		
		this.UpdateButton();
	}
	
	onSimulatorOption_Change(ev) {
		var parsers = Converter.PARSERS[ev.target.value];
		
		for (var id in parsers) {
			var radio = this.Node("types").Node(`input[value=${id}]`).elem;
			
			radio.checked = false;
			radio.disabled = !parsers[id]; 
			radio.title = !parsers[id] ? Core.Nls("Converter_Parser_NA") : "";
		}
		
		var first = this.Node("types").Elem(`input:not([disabled])`);
		
		if (first) first.checked = true;
	}
	
	onTypeOption_Change(ev) { 
		this.UpdateButton();
		
		if (this.Disabled) return;
	}

	onParseButton_Click(ev) {
		Dom.RemoveCss(this.Elem("wait"), "hidden");
		
		var parser = new Converter.PARSERS[this.Simulator][this.Type];
		
		var p = parser.Parse(this.files);
		
		p.then(this.onParser_Parsed.bind(this, parser), (error) => {
			Dom.AddCss(this.Elem("wait"), "hidden");
		
			this.Emit("error", { error:error })
		});
	}
	
	onParser_Parsed(parser, result) {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		try {
			Zip.SaveZipStream(result.name, result.AsFiles()).then((ev) => {
				this.Emit("converted");
			});
		}
		catch (error) {
			this.Emit("error", { error:error });
		}
	}
	
	UpdateButton() {
		var simulator = this.Node("simulators").Node("input:checked");
		var type = this.Node("types").Node("input:checked");
		
		this.Elem("parse").disabled = !simulator || !type || this.files == null;
	}

	Template() {
		return "<div class='converter'>" +
				  "<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
			      "<div class='options-container'>" +
				     "<div handle='simulators' class='options-column'>" +
				        "<label>Simulator</label>" +
					    "<label class='option'><input type='radio' name='simulator' value='CD++' checked>CD++</label>" +
					    "<label class='option'><input type='radio' name='simulator' value='Cadmium'>Cadmium</label>" +
					    "<label class='option'><input type='radio' name='simulator' value='Lopez'>Lopez</label>" +
				     "</div>" +
				     "<div handle='types' class='options-column'>" +
					    "<label>Type</label>" +
					    "<label class='option'><input type='radio' name='type' value='DEVS' checked>DEVS</label>" +
					    "<label class='option'><input type='radio' name='type' value='Cell-DEVS'>Cell-DEVS</label>" +
				     "</div>" +
			      "</div>" +
			      "<div handle='dropzone' widget='Widget.Box-Input-Files'></div>" +
			      "<button handle='parse' class='save' disabled>nls(Converter_Parse)</button>" +
			   "</div>";
	}
});