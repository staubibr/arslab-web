'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';
import DiagramData from './diagramData.js';

export class DependenceTree{	//Added
	constructor(model,outPort){
		this.modelName=model;

		this.outPort=outPort;

		this.atomic=[];	//Remove unless we use different colours for links and destination models
	
		this.coupled=[];//Remove unless we use different colours for links and destination models

		this.branch_nodes=[];
	}
}

export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	constructor(node) {
		super(node);
	}
	
	dependenceTreeMap = new Map();	//Added

	setDependenceTreeMap(models_sim){	//Added
		for (var model in models_sim) {
			if (Object.prototype.hasOwnProperty.call(models_sim,model)) {	
				if (models_sim[model].type=="atomic"){
					models_sim[model].ports.forEach(p => { 
						if (p.type == "output"){
							var tree = new DependenceTree(models_sim[model],p);
							this.searchDependencies(models_sim[model],p.name,tree);
							this.dependenceTreeMap.set(models_sim[model].name + p.name,tree)	//Insert tree head in the map
						} 
					});
				}
			}
		}
		// console.log(this.dependenceTreeMap);
	}

	searchDependencies(model,port,tree){	//Added
		if (!this.data.link_branches[model.name].out){return;}
		this.data.link_branches[model.name].out.forEach(	outlink => {
			if (outlink.portA == port){
				if (outlink.modelB){
					tree.branch_nodes.push( this.data.models[outlink.modelB].node);	
					if (this.data.ports[outlink.modelB]){
						if (this.data.ports[outlink.modelB][outlink.portB]){
							if (Array.isArray(this.data.ports[outlink.modelB][outlink.portB].node)){
								this.data.ports[outlink.modelB][outlink.portB].node.forEach( port => {
									tree.branch_nodes.push(port);		
								});
							}else{
								tree.branch_nodes.push( this.data.ports[outlink.modelB][outlink.portB].node);	
							}
						}
					}
					tree.branch_nodes.push( outlink.node);	
					var mk=outlink.marker;
					if (mk) {
						tree.branch_nodes.push(mk);	
					}
					if (this.data.models[outlink.modelB].type=="coupled"){
						tree.coupled.push(this.data.models[outlink.modelB].name);
						this.searchDependencies(this.data.models[outlink.modelB],outlink.portB,tree);
					}else{
						tree.atomic.push(this.data.models[outlink.modelB].name);
					}
				}
			}
		})
	}

	

	SetDiagram(svg) {
		this.Elem('diagram').innerHTML = svg;
		
		this.Node('diagram').Elem("svg").setAttribute("preserveAspectRatio", "none");
		
		var models = this.Node('diagram').Elems("[type='atomic'],[type='coupled']");

		models.forEach((model) => {			
			model.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
			model.addEventListener("click", this.onSvgClick_Handler.bind(this));
			model.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
		});
		
		this.data = new DiagramData(this.Elem('diagram').firstElementChild);
	}
	
	SetCss() {
		var models = this.Node('diagram').Elems("[type='atomic'],[type='coupled']");
		
		models.forEach(m => this.AddModelCss(m, ["model"]));
	}
	
	onSvgMouseMove_Handler(ev) {
		var model = ev.target.getAttribute('name').toLowerCase();
		
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY , model:model });
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
		var m = this.data.Model(t.Id);
		
		if (m) this.AddModelCss(m.node, ["highlighted", t.type]);
		
		var p = this.data.Port(t.Id, t.port);
		
		// if (p) this.AddModelCss(p.node, ["highlighted", t.type]);
		if (p){
			if (p.node.length>0){
				p.node.forEach(portNode => {
					this.AddModelCss(portNode, ["highlighted", t.type]);
				});
			}
		}
		var l = this.data.Link(t.Id, t.port, t.type);
		
		if (l) this.AddModelCss(l.node, ["highlighted", t.type]);
		
		if (l && l.marker) this.AddModelCss(l.marker, ["highlighted", t.type]);

		//Search for ports with branches.	//Added
		var l2 = this.data.LinkBranches(t.Id, t.port);
		if (l2){
			l2.forEach(l3 => {
				if (l3.portA==t.port){
					if (l3) this.AddModelCss(l3.node, ["highlighted", t.type]);
					if (l3 && l3.marker) this.AddModelCss(l3.marker, ["highlighted", t.type]);	
				}
			 } );
		}
		
		//Search for dependence tree.		//Added
		var map = this.dependenceTreeMap.get(t.Id + t.port);
		if (map){
			map.branch_nodes.forEach(node => {
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
		this.data.Nodes().forEach(n => { this.RemoveModelCss(n, ["highlighted", "X", "Y"]); })
	}
});