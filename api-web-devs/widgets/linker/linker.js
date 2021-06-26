'use strict'

import Templated from '../../components/templated.js';
import Dom from '../../tools/dom.js';

export default class Linker extends Templated {

    get svg() { return this.Elem('svg-content'); }
	
	get svg_file() { return new File([this.svg.innerHTML], "diagram.svg", { type:"image/svg+xml", endings:'native' }); }
	
	get current() { return this._current; }

    constructor(container, options) {
		super(container, options);
		
		this._current = {
			button: null,
			page: null,
			card: null
		}
		
		this.LoadSVG();
		this.MakePages(this.options.pages);
		
		this.Node("chk_thick").On('click', this.OnLinker_Thicken.bind(this));
		this.Node("btn_clear").On('click', this.OnLinker_Clear.bind(this));
		
		this.options.pages.forEach(c => {
			c.button = Dom.Create("button", { type: "button", className: "m-1 inactive", innerHTML: c.caption }, this.Elem("buttons"));
			
			c.button.addEventListener('click', (ev) => this.ChangePage(c));
		});
		
		this.ChangePage(this.options.pages[0]);
    }
	
	MakePages(pages) {
		pages.forEach(page => {
			page.items = page.items.map(item => this.MakeItem(page,item));
		});
	}
	
	MakeItem(page, item) {
		var item = { data:item, attrs:{}, node:null, svg:[] }
		
		for (var attr in page.attrs) item.attrs[attr] = page.attrs[attr](item.data);
		
		item.node = Dom.Create("div", { innerHTML:page.label(item.data), className:"card m-1 dwl-pointer dwl-card" });
		
		Dom.Create("i", { className:"fas fa-exclamation-triangle warning-icon" }, item.node);
		
		item.node.addEventListener('click', this.OnCardNode_Click.bind(this, item), false);
		
		item.svg = this.GetAssociations(item.attrs);
		
		return item;
	}
	
	GetAssociations(attrs) {
		var selector = "";
		
		for (var attr in attrs) selector += `[${attr}=${attrs[attr]}]`
		
		return Array.from(this.svg.querySelectorAll(selector));
	}
	
    LoadSVG() {
		var selector = Linker.SVG_FORMAT.DRAW_IO;
		
		this.svg.innerHTML = this.options.diagram;
		
		this.ResetPointerEvents();
		
		this.svg.querySelectorAll(selector).forEach((n, index) => {
			n.addEventListener('click', this.OnSVG_Click.bind(this), false);
			
			n.style.cursor = "pointer";
			n.style.pointerEvents = "all"
		});
    }
	
	ChangePage(page) {
		Dom.Empty(this.Elem("cards"));
		
		if (this.current.button) Dom.AddCss(this.current.button, 'inactive');
		
		this.current.button = page.button;
		
		Dom.RemoveCss(this.current.button, 'inactive');
		
        this.ClearSVG();
		
		this.current.page = page;
		
		if (page.items.length == 0) {
			return Dom.Create("p", { innerHTML:page.empty }, this.Elem("cards"));
		}
		
		page.items.forEach(item => {
			Dom.Place(item.node, this.Elem("cards"));
			
			Dom.ToggleCss(item.node, 'hide-warning', item.svg.length > 0);
		});
	}
	
	ClearSVG() {
		if (!this.current.card) return;
		
		Dom.RemoveCss(this.current.card.node, 'dwl-highlight-card');
	}
	
	ClearCards() {
		if (!this.current.card) return;
		
		this.current.card.svg.forEach(n => n.classList.remove('dwl-selected'));
	}
	
	RefreshWarnings() {
		this.options.pages.forEach(p => {
			p.items.forEach(card => {
				Dom.ToggleCss(card.node, 'hide-warning', card.svg.length > 0);
			});
		});
	}
	
	ResetPointerEvents() {
		this.svg.querySelectorAll('*').forEach(n => {
			n.style.cursor = "none";
			n.style.pointerEvents = "none"
		});
	}
	
	ResetThickness() {
		this.Elem("chk_thick").checked = false;
		
		this.svg.classList.toggle("dwl-thick", false);	
	}
	
	Clear() {
		this.ClearSVG();
		this.ClearCards();
		this.RefreshWarnings();
	}
	
	Reset() {
		this.Clear();
		this.ResetPointerEvents();
		this.ResetThickness();
	}
		
	OnCardNode_Click(card, ev) {
		this.Clear();
		
		if (this.current.card == card) this.current.card = null;
		
		else {
			this.current.card = card;
			
			Dom.AddCss(card.node, 'dwl-highlight-card');
			
			card.svg.forEach(a => a.classList.add('dwl-selected'));
		}
	} 

	OnSVG_Click(ev) {
		var card = this.current.card;
		
		if (!card) return;
		
		var i = card.svg.indexOf(ev.target);
		
		if (i != -1) {
			ev.target.classList.remove('dwl-selected');
			
			card.svg.splice(i, 1);
			
			for (var attr in card.attrs) ev.target.removeAttribute(attr);
		}
		
		else {
			ev.target.classList.add('dwl-selected');
			
			card.svg.push(ev.target);
			
			for (var attr in card.attrs) ev.target.setAttribute(attr, card.attrs[attr]);
		}
		
		Dom.ToggleCss(card.node, 'hide-warning', card.svg.length > 0);
	}
	
	OnLinker_Clear(ev) {
		this.options.pages.forEach(p => {
			p.items.forEach(card => {
				card.svg.forEach(svg => {
					for (var attr in card.attrs) svg.removeAttribute(attr);
				});
			});
		});
		
		this.Clear();
	}
	
	OnLinker_Thicken(ev) {
		this.svg.classList.toggle("dwl-thick", ev.target.checked);	
	}

	Template() {
		return `<div class="d-flex flex-row h-100 w-100">` + 
			      `<div id="json-container" class="d-flex flex-column card me-1 h-100 w-100">` + 
					 `<div handle="buttons" class="p-3"></div>` + 
					 `<div handle="cards" id="cards" class="h-100 d-flex flex-row flex-wrap align-content-start justify-content-center overflow-auto">` + 
					    `<div handle="svg-content"></div>`+					 
					 `</div>` + 
					 `<p class="m-2">NOTE: Input ports will be automatically associated.</p>` + 
				  `</div>` + 
				  `<div id="svg-container" class="card ms-1 h-100 w-100 position-relative">` + 
				     `<div class="p-3 end-0">` + 
						`<div class="m-1 float-start">` + 
						   `<input handle="chk_thick" id="dwl-thick-chk" class="m-1 dwl-pointer align-middle" type="checkbox" title="Thicken line strokes for easier interaction."/>` +
						   `<label class="m-1 dwl-pointer align-middle" title="Thicken line strokes for easier interaction." for="dwl-thick-chk">Thicker line strokes</label>` + 
						`</div>` +
						`<button handle="btn_clear" type="button" class="m-1 float-end" data-button-type="clear" title="Remove all associations.">Clear</button>` +
					 `</div>` +
					 `<div handle="svg-content" id="svg-content"></div>` +
				  `</div>` + 
			   `</div>`
	}

	static get SVG_FORMAT() {
		return {
			DRAW_IO: 'foreignObject div > div > div, rect:not([fill="none"][stroke="none"]), circle, ellipse, path, polygon'
		}
	}
}