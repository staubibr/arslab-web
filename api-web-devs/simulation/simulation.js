'use strict';

import Evented from '../components/evented.js';
import Cache from './cache.js';
import Frame from './frame.js';
import Model from './model.js';


export class DependenceTree{	//Added
	constructor(model,outPort){
		// this.modelName=model;
		this.modelName=model.name;
		this.modelNode={};

		// this.outPort=outPort;
		this.outPort=outPort.name;
		this.portSvg=[];
		this.portNode=[];

		this.atomic=[];	//Remove unless we use different colours for links and destination models
		this.coupled=[];//Remove unless we use different colours for links and destination models

		this.branch_nodes=[];
		this.nodes=[];
	}
}

export default class Simulation extends Evented { 
	
	get Name() { return this.name; }
	
	get State() { return this.state; }

	get Selected() { return this.selected; }
	
	// TODO : Should vary in a SimulationCA class
	get Ratio() { 
		throw new Error("get Ratio must be defined in child simulation class.");
	}

	constructor(name, simulator, type, models, frames) {
		super();

		this.name = name || null;
		this.simulator = simulator || null;
		this.type = type || null;
		this.models = models || null;
		this.frames = frames || [];
		this.atomics = models.filter(model => model.type == "atomic");
		this.dependenceTreeMap = new Map();	//Added
		this.modelMap = new Map();	//Added
		this.index = {};
		this.selected = [];
		this.cache = new Cache();
		this.modelIDs = [];
		this.portIDs = [];
		this.modelNodes = [];
		this.portNodes = [];

		if (this.models) {
			this.models = this.models.map(m => new Model(m.name, m.type, m.submodels, m.ports, m.links,m.svg));

			this.models.forEach(m => {
				if (m.submodels){
					m.submodels = m.submodels.map(name => this.models.find(m => name == m.name));
				}
			});
			
			this.setDependenceTreeMap(this.models);
			
			this.models.forEach(m => {
				if (m.svg!=undefined){
					this.modelMap.set(m.svg.toLowerCase(),m.name)
				}
			});

			//Not sure if needed
			this.modelIDs = this.models.map(m => m.svg);
			this.modelIDs = this.modelIDs.filter(function( element ) {return element !== undefined;});

			//Not sure if needed
			var portIDs_aux = this.models.map(m => m.ports);
			portIDs_aux.forEach ( p1=> {
				p1.forEach ( p2=> {
					if (p2.svg) {
						this.portIDs.push(p2.svg) ;
					}	
				});
			});			
		}
	}
	
	Initialize(nCache) {
		this.state.Reset();
		
		this.cache.Build(nCache, this.frames, this.state);
		
		this.state.Reset();
		
		this.frames.forEach((f) => f.Difference(this.state));
		
		this.state = this.cache.First();
	}
	
	GetState(i) {
		if (i == this.frames.length - 1) return this.cache.Last();
		
		if (i == 0) return this.cache.First();
		
		var cached = this.cache.GetClosest(i);
		
		for (var j = cached.i + 1; j <= i; j++) {
			cached.ApplyTransitions(this.Frame(j));
		}
		
		return cached;
	}
	
	CurrentFrame() {
		return this.frames[this.state.i];
	}
	
	AddFrame(frame) {		
		this.frames.push(frame);
		
		this.index[frame.time] = frame;
		
		return frame;
	}
	
	Frame(i) {
		return this.frames[i];
	}
	
	Index(id) {
		return this.index[id];
	}
	
	FirstFrame(i) {
		return this.frames[0];
	}
	
	LastFrame(i) {
		return this.frames[this.frames.length - 1];
	}
	
	GoToFrame(i) {
		this.state = this.GetState(i);
		
		this.Emit("Jump", { state:this.state });
	}
	
	GoToNextFrame() {
		var frame = this.Frame(this.state.i + 1);
		
		this.state.ApplyTransitions(frame);
		
		this.Emit("Move", { frame : frame, direction:"next" });
	}
	
	GoToPreviousFrame() {
		var frame = this.Frame(this.state.i);
		var reverse = frame.Reverse();
		
		this.state.RollbackTransitions(frame);
		
		this.Emit("Move", { frame : reverse, direction:"previous" });
	}
	
	Save() {
		return {
			i : this.state.i,
			selection : this.selected
		}
	}
	
	Load(config) {
		this.GoToFrame(config.i);
		
		this.selected = config.selection;
		
		this.Emit("Session", { simulation:this });
	}
	
	onSimulation_Error(message) {
		this.Emit("Error", { error:new Error(message) });
	}
	
	IsSelected(model) {
		return this.selected.indexOf(model) > -1;
	}
	
	Select(model) {
		var idx = this.selected.indexOf(model);
		
		// Already selected
		if (idx != -1) return;
		
		this.selected.push(model);
		
		this.Emit("Selected", { model:model, selected:true });
	}
	
	Deselect(model) {
		var idx = this.selected.indexOf(model);
		
		// Not in current selection
		if (idx == -1) return;
		
		this.selected.splice(idx, 1);
		
		this.Emit("Selected", { model:model, selected:false });
	}
	
	static FromJson(json) {
		throw new Error("function FromJson must be defined in child simulation class.");
	}

	setDependenceTreeMap(models_sim){	//Added
		for (var model in models_sim) {

			if (models_sim[model].type=="atomic"){
			
				models_sim[model].ports.forEach(p => { 
			
					if (p.type == "output"){
			
						var tree = new DependenceTree(models_sim[model],p);
		
						tree.modelSvg=models_sim[model].svg;
		
						if (Array.isArray(p.svg)){
							p.svg.forEach(p2=> {
								tree.portSvg.push(p2);
							});	
						}else{
							tree.portSvg=p.svg;
						}
						
		
						this.searchDependencies(models_sim[model],p.name,tree);
		
						this.dependenceTreeMap.set(models_sim[model].name + p.name,tree)	//Insert tree head in the map
			
					} 
			
				});
			}
		}
		// console.log(this.dependenceTreeMap);
	}

	searchDependencies(model,port,tree){	//Added
		var selected_links=model.links.filter(function(link){return link.portA==port;})
		
		var selected_links=model.links.filter(function(link){return link.modelA==model.name;})
				
		if (!selected_links){return;}
		
		selected_links.forEach(	outlink => {
		
			if (outlink.portA == port){
		
				if (outlink.modelB){
		
					var selected_models=this.models.filter(function(model){return model.name==outlink.modelB;})

					selected_models.forEach(m => {

						tree.branch_nodes.push(m.svg);	

						var selected_ports=m.ports.filter(function(p){return p.name==outlink.portB;})

						selected_ports.forEach(p => {
							if (Array.isArray(p.svg)){
								p.svg.forEach(p2=> {
									tree.branch_nodes.push(p2);
								});	
							}else{
								tree.branch_nodes.push(p.svg);
							}
						});
						
					});
					tree.branch_nodes.push( outlink.svg);
					
					selected_models.forEach(m => {

						if (m.type=="coupled"){		
							tree.coupled.push(m.name);
							this.searchDependencies(m,outlink.portB,tree);
						}else{
							tree.atomic.push(m.name);
						}

					});

				}
			}
		})
	}

}