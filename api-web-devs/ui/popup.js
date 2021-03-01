import Dom from '../tools/dom.js';
import Core from '../tools/core.js';
import Templated from '../components/templated.js';

export default class Popup extends Templated { 
	
	set Title(value) {
		this.Elem("title").innerHTML = value;
	}
	
	set Content(content) {
		this.Empty();
		
		this.content = content;
		
		content.Place(this.Elem("body"));
	}
	
	get Content() { return this.content; }
	
	constructor(container) {	
		super(container || document.body);
		
		this.position = { initial:{}, current:{}, offset:{ x:0, y:0 } };
		this.defer = null;
		
		this.onBody_KeyUp_Bound = this.onBody_KeyUp.bind(this);
		
		this.h = null;
		
		this.nodes.blocker = Dom.Create("div", { className:"popup-blocker" }, document.body);
		
		this.SetStyle(0, "hidden");
		
		this.Node("close").On("click", this.onBtnClose_Click.bind(this));
		this.Node("blocker").On("click", this.onModal_Click.bind(this));
		
		this.container.addEventListener("mousedown", this.onPopup_MouseDown.bind(this));
		this.container.addEventListener("mouseup", this.onPopup_MouseUp.bind(this));
		this.container.addEventListener("mousemove", this.onPopup_MouseMove.bind(this));
	}
	
	SetStyle(opacity, visibility) {
		this.Elem("blocker").style.opacity = opacity;
		this.Elem("blocker").style.visibility = visibility;
		this.Elem("popup").style.opacity = opacity;
		this.Elem("popup").style.visibility = visibility;
	}
	
	Empty() {
		Dom.Empty(this.Elem("body"));
	}
	
	Show() {	
		this.defer = Core.Defer();
	
		this.h = document.body.addEventListener("keyup", this.onBody_KeyUp_Bound);
		
		this.SetStyle(1, "visible");
		
		this.Emit("Show", { popup:this });
		
		this.Elem("close").focus();
		
		return this.defer.promise;
	}
	
	Hide() {		
		document.body.removeEventListener("keyup", this.onBody_KeyUp_Bound);
		
		this.SetStyle(0, "hidden");
		
		this.Emit("Hide", { popup:this });
		
		this.defer.Resolve();
	}
	
	onBody_KeyUp(ev) {
		if (ev.keyCode == 27) this.Hide();
	}
	
	onModal_Click(ev) {
		this.Hide();
	}
	
	onBtnClose_Click(ev) {
		this.Emit("Close", { popup:this });
		
		this.Hide();
	}
	
	onPopup_MouseDown(ev) {
		this.position.initial.x = ev.clientX - this.position.offset.x;
		this.position.initial.y = ev.clientY - this.position.offset.y;

		if (ev.target === this.Elem("title")) this.position.active = true;
	}
	
	onPopup_MouseUp(ev) {
		this.position.initial.x = this.position.current.x;
		this.position.initial.y = this.position.current.y;

		this.position.active = false;
	}
	
	onPopup_MouseMove(ev) {

		if (!this.position.active) return;
      
		ev.preventDefault();

		this.position.current.x = ev.clientX - this.position.initial.x;
		this.position.current.y = ev.clientY - this.position.initial.y;

		this.position.offset.x = this.position.current.x;
		this.position.offset.y = this.position.current.y;

		this.Move(this.position.current.x, this.position.current.y);
	}
	
    Move(x, y) {
		this.Elem("popup").style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    }
	
	Template() {
		return "<div handle='popup' class='popup'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'></h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body' handle='body'></div>" +
				  "<div class='popup-footer' handle='footer'></div>" +
			   "</div>";
	}
	
	static Nls() {
		return {
			"Popup_Close": {
				"en": "Close",
				"fr": "Fermer"
			}
		}
	}
}