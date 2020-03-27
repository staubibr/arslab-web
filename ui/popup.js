import Dom from '../tools/dom.js';
import Core from '../tools/core.js';
import Templated from '../components/templated.js';

export default class Popup extends Templated { 
	
	set Title(value) {
		this.Node("title").innerHTML = value;
	}
	
	set Widget(widget) {
		this.Empty();
		
		this.widget = widget;
		
		widget.Place(this.Node("body"));
	}
	
	get Widget() { return this.widget; }
	
	get Root() { return this.Node("root"); }
	
	constructor(css, container) {	
		super(container || document.body);
				
		this.onBody_KeyUp_Bound = this.onBody_KeyUp.bind(this);
		
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
	
	Empty() {
		Dom.Empty(this.Node("body"));
	}
	
	Show() {
		Core.DisableFocusable(Dom.Siblings(this.Node("root")), true);
		
		this.h = document.body.addEventListener("keyup", this.onBody_KeyUp_Bound);
		
		this.SetStyle(1, "visible");
		
		this.Emit("Show", { popup:this });
		
		this.Node("close").focus();
	}
	
	Hide() {
		Core.DisableFocusable(Dom.Siblings(this.Node("root")), false);
		
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
				  "<div handle='container' class='popup-container'>" +
					  "<div class='popup-header'>" +
						  "<h2 class='popup-title' handle='title'></h2>" +
						  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
					  "</div>" +
					
					  "<div class='popup-body' handle='body'></div>" +
				  "</div>" +
			  "</div>";
	}
}