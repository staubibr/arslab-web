import Dom from '../tools/dom.js';
import Core from '../tools/core.js';
import Templated from '../components/templated.js';

export default class Popup extends Templated { 
	
	set title(value) {
		this.Elem("title").innerHTML = value;
	}
	
	set content(content) {
		this.Empty();
		
		this._content = content;
		
		_content.Place(this.Elem("body"));
	}
	
	get content() { return this._content; }
	
	constructor(container) {	
		super(container || document.body);
		
		this.moving = false;
		this.offset = { x:0, y:0 };
		this.defer = null;
		
		this.onBody_KeyUp_Bound = this.onBody_KeyUp.bind(this);
		
		this.h = null;
		
		this.nodes.blocker = Dom.Create("div", { className:"popup-blocker" }, document.body);
		
		this.SetStyle(0, "hidden", "none");
		
		this.Node("close").On("click", this.onBtnClose_Click.bind(this));
		this.Node("blocker").On("click", this.onModal_Click.bind(this));
		
		this.container.addEventListener("mousedown", this.onPopup_MouseDown.bind(this));
		this.container.addEventListener("mouseup", this.onPopup_MouseUp.bind(this));
		this.container.addEventListener("mousemove", this.onPopup_MouseMove.bind(this));
	}
	
	SetStyle(opacity, visibility, display) {
		this.Elem("blocker").style.opacity = opacity;
		this.Elem("blocker").style.visibility = visibility;
		this.Elem("blocker").style.display = display;
		this.Elem("popup").style.opacity = opacity;
		this.Elem("popup").style.visibility = visibility;
		this.Elem("popup").style.display = display;
	}
	
	Empty() {
		Dom.Empty(this.Elem("body"));
	}
	
	GetCenter() {
		var geo = Dom.Geometry(this.Elem("popup"));
		
		return { 
			x : window.innerWidth / 2 - geo.w / 2,
			y : window.innerHeight / 2 - geo.h / 2
		}
	}
	
	Show() {	
		this.defer = Core.Defer();
		this.h = document.body.addEventListener("keyup", this.onBody_KeyUp_Bound);		
		
		this.SetStyle(1, "visible", "block");
		
		var center = this.GetCenter();
		
		this.Move(center.x, center.y);
		this.Emit("Show", { popup:this });
		
		this.Elem("close").focus();
		
		return this.defer.promise;
	}
	
	Hide() {		
		document.body.removeEventListener("keyup", this.onBody_KeyUp_Bound);
		
		this.SetStyle(0, "hidden", "none");
		
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
		if (ev.target !== this.Elem("title")) return;
		
		var rect = this.Elem("popup").getBoundingClientRect();
		
		// offset between clicked point and top left of popup
		this.offset.x = ev.clientX - rect.x;
		this.offset.y = ev.clientY - rect.y;

		this.moving = true;
		
		this.onPopup_MouseMove(ev);
	}
	
	onPopup_MouseUp(ev) {
		this.moving = false;
	}
	
	onPopup_MouseMove(ev) {
		if (!this.moving) return;
      
		ev.preventDefault();

		var x = ev.pageX - this.offset.x;
		var y = ev.pageY - this.offset.y;

		this.Move(x, y);
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