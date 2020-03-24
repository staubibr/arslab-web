import Dom from '../tools/dom.js';
import Core from '../tools/core.js';
import Util from '../tools/util.js';
import Templated from './templated.js';

export default class Popup extends Templated { 
	
	set Content(content) {
		this.content = content;
		
		Dom.Place(content, this.Node("body"));
	}
	
	get Content() { return this.content; }
	
	constructor(css, container) {	
		super(container || document.body);
				
		this.onBody_KeyUp_Bound = this.onBody_KeyUp.bind(this);
		
		this.content = null;
		this.h = null;
		
		this.Node("close").addEventListener("click", this.onBtnClose_Click.bind(this));
		
		if (css) Dom.AddCss(this.Node("root"), css);
		
		this.Node("root").addEventListener("click", this.onModal_Click.bind(this));
		
		this.SetStyle(0, "hidden");
	}
	
	SetStyle(opacity, visibility) {
		this.Node("root").style.opacity = opacity;
		this.Node("root").style.visibility = visibility;
	}
	
	Show() {
		Util.DisableFocusable(Dom.Siblings(this.Node("root")), true);
		
		this.h = document.body.addEventListener("keyup", this.onBody_KeyUp_Bound);
		
		this.SetStyle(1, "visible");
		
		this.Emit("Show", { popup:this });
		
		this.Node("close").focus();
	}
	
	Hide() {
		Util.DisableFocusable(Dom.Siblings(this.Node("root")), false);
		
		document.body.removeEventListener("keyup", this.onBody_KeyUp_Bound);
		
		this.SetStyle(0, "hidden");
		
		this.Emit("Hide", { popup:this });
	}
	
	onBody_KeyUp(ev) {
		if (ev.keyCode == 27) this.Hide();
	}
	
	onModal_Click(ev) {
		this.Hide();
	}
	
	onBtnClose_Click(ev) {
		this.Hide();
	}
	
	Template() {
		return "<div handle='root' class='popup'>" +
				  "<div class='popup-container'>" +
					  "<div class='popup-header'>" +
						  "<div class='popup-title' handle='title'></div>" +
						  "<button class='close' handle='close'>×</button>" +
					  "</div>" +
					
					  "<div class='popup-body' handle='body'></div>" +
				  "</div>" +
			  "</div>";
	}
}