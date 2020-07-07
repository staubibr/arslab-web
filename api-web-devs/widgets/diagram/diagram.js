'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';
import DiagramData from './diagramData.js';



export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	constructor(node) {
		super(node);
	}

	// SetDiagram(svg,models_sim,simulation) {
	SetDiagram(Simulation) {

		this.Elem('diagram').innerHTML = Simulation.diagram;
		
		this.Node('diagram').Elem("svg").setAttribute("preserveAspectRatio", "none");
		
		Simulation.setDependencyNodes(this.Elem('diagram').firstElementChild,Simulation.dependenceTreeMap);

		this.Simulation = Simulation;

		this.models = []

		this.Simulation.models.forEach( model => {
			if (model.svg){
				var str = '[id='+model.svg+']';
				var m = this.Elem('diagram').firstElementChild.querySelector(str);	
				this.models.push(m);
			}
		});

		this.models.forEach((model) => {			
			model.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
			model.addEventListener("click", this.onSvgClick_Handler.bind(this));
			model.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
		});
		
		// this.data = new DiagramData(this.Elem('diagram').firstElementChild,models_sim);
	}
	
	SetCss() {
		var models = this.Node('diagram').Elems("[type='atomic'],[type='coupled']");
		
		models.forEach(m => this.AddModelCss(m, ["model"]));
	}
	
	onSvgMouseMove_Handler(ev) {
		// var model = ev.target.getAttribute('name').toLowerCase();
		var model = ev.target.getAttribute('id').toLowerCase();
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY , model:model });
		// this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY, model:ev.target.getAttribute('id') });
	}
		
	onSvgMouseOut_Handler(ev) {
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY });
	}
	
	onSvgClick_Handler(ev) {
		var model = ev.target.getAttribute('name');
		
		this.Emit("Click", { x:ev.pageX, y:ev.pageY , model:model, svg:ev.target });
	}
		
	Template() {
		return "<div handle='diagram' class='diagram-container'></div>";
	}

	Resize() {
		this.size = Dom.Geometry(this.Node("diagram"));
		
		var pH = 30;
		var pV = 30;
		
		this.Node("diagram").style.margin = `${pV}px ${pH}px`;
		this.Node("diagram").style.width = `${(this.size.w - (30))}px`;	
		this.Node("diagram").style.height = `${(this.size.h - (30))}px`;
	}
	
	Draw(transitions) {
		this.Reset();
		
		transitions.forEach((t) => {
			if (t.type == "Y") this.DrawYTransition(t);
			
			else if (t.type == "X") this.DrawXTransition(t);
		});
	}

	DrawXTransition(t) {		
		var m = this.data.Model(t.destination);
		
		if (m) this.AddModelCss(m.node, ["highlighted", t.type]);
		
		var p = this.data.Port(t.destination, t.port);
		
		if (p) this.AddModelCss(p.node, ["highlighted", t.type]);
		
		var l = this.data.Link(t.destination, t.port, t.type);
		
		if (l) this.AddModelCss(l.node, ["highlighted", t.type]);	
		
		if (l && l.marker) this.AddModelCss(l.marker, ["highlighted", t.type]);	
	}

	DrawYTransition(t) {  
		
		//Search for dependence tree.		//Added
		// var map = this.dependenceTreeMap.get(t.Id + t.port);
		var tree = this.Simulation.dependenceTreeMap.get(t.Id + t.port);
		if (tree){
			this.AddModelCss(tree.modelNode, ["highlighted", "Y"]);
			
			// this.AddModelCss(tree.portNode, ["highlighted", "Y"]);
			if (Array.isArray(tree.portNode)){
				tree.portNode.forEach(p => {
					this.AddModelCss(p, ["highlighted", "Y"]);
				});
			}
			else
			{
				this.AddModelCss(tree.portNode, ["highlighted", "Y"]);
			}
			
			tree.nodes.forEach(node => {
				if (node) this.AddModelCss(node, ["highlighted", "X"]);
			 } );
		}

	}



	AddModelCss(model, css) {
		css.forEach(c => model.classList.add(c));
	}
	
	RemoveModelCss(model, css) {
		css.forEach(c => model.classList.remove(c));
	}
	
	Reset() {
		// this.data.Nodes().forEach(n => { this.RemoveModelCss(n, ["highlighted", "X", "Y"]); })
		this.Simulation.dependenceTreeMap.forEach(tree => { 
			this.RemoveModelCss(tree.modelNode, ["highlighted", "X", "Y"]); 
			// this.RemoveModelCss(tree.portNode, ["highlighted", "X", "Y"]); 
			if (Array.isArray(tree.portNode)){
				tree.portNode.forEach(p2=> {
					this.RemoveModelCss(p2, ["highlighted", "X", "Y"]); 
				});	
			}else{
				this.RemoveModelCss(tree.portNode, ["highlighted", "X", "Y"]); 
			}
			
			tree.nodes.forEach(br => { 
				this.RemoveModelCss(br, ["highlighted", "X", "Y"]); 
			})		

		})
	}
});