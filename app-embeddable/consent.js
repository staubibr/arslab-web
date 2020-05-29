'use strict';

import Core from '../api-basic/tools/core.js';
import Net from '../api-basic/tools/net.js';
import Dom from '../api-basic/tools/dom.js';
import Templated from '../api-basic/components/templated.js';

export default class Consent extends Templated { 

	constructor(node, json) {		
		super(node);
		
		this.callback = null;
		
		this.Elem('message').innerHTML = Core.Nls('Consent_Size', [json.filesize]);
		
		this.Node('button').On("click", this.OnConsent_Click.bind(this));
	}
	
	then(callback) {
		this.callback = callback;
	}
	
	OnConsent_Click(ev) {
		if (this.callback) this.callback();
	}
	
	Template() {
		return	"<main handle='main' class='consent'>" +
					"<div class='consent-container'>" +
						"<div handle='message' class='consent-message'></div>" +
						"<button handle='button' class='consent-button'>nls(Consent_Button)</button>" +
					"</div>" +
				"</main>";
	}
}