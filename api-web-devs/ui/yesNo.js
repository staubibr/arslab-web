'use strict';

import Core from '../tools/core.js';
import Popup from './popup.js';

export default Core.Templatable("Dialog.YesNo", class Settings extends Popup { 
	
	get message() { return this._message; }
	set message(value) { 
		this._message = value; 
		
		this.Elem("message").innerHTML = value;
	}
	
	get answer() { return this._answer; }
	set answer(value) { this._answer = value; }

	constructor(container) {
		super(container);
		
		this._message = null;
		this._answer = null;
		
		this.Node("yes").On('click', ev => {
			this.answer = "yes";
			
			this.Hide();
		});
		
		this.Node("no").On('click', ev => {
			this.answer = "no";
			
			this.Hide();
		});
	}
	
	Template() {
		return "<div handle='popup' class='popup dialog dialog-confirm'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'>nls(Dialog_Title)</h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body' handle='body'>" + 
					  "<div handle='message' class='dialog-message'></div>" +
					  "<div class='dialog-buttons'>" + 
						  "<button class='dialog-yes' handle='yes'>nls(Dialog_Yes)</button>" +
						  "<button class='dialog-no' handle='no'>nls(Dialog_No)</button>" +
					  "</div>" +
				  "</div>" +
			   "</div>";
	}
	
	static Nls() {
		return {
			"Popup_Close": {
				"en": "Close",
				"fr": "Fermer"
			},
			"Dialog_Title": {
				"en": "Confirm"
			},
			"Dialog_Yes": {
				"en": "Yes"
			},
			"Dialog_No" : {
				"en":"No"
			}
		}
	}
});