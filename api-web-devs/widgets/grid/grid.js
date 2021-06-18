'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';
import Styler from '../../components/styler.js';

const STROKE_WIDTH = 2;
const DEFAULT_COLOR = "#fff";

export default Core.Templatable("Widgets.Grid", class Grid extends Templated { 

	get canvas() { return this.Elem("canvas"); }
	
	set dimensions(value) { this._dimensions = value; }
	get dimensions() { return this._dimensions; }
	
	set columns(value) { this._columns = value; }
	get columns() { return this._columns; }
	
	set spacing(value) { this._spacing = value; }
	get spacing() { return this._spacing; }
	
	set layers(value) { 
		this._layers = value; 
		this._index = {};
		
		this._layers.forEach((l, i) => {			
			if (!this._index.hasOwnProperty(l.z)) this._index[l.z] = {};
				
			l.ports.forEach(p => {
				if (!this._index[l.z].hasOwnProperty(p)) this._index[l.z][p] = [];
				
				this._index[l.z][p].push(l);
			});
		});
	}
	
	get layers() { return this._layers; }
	
	set styles(value) { this._styler = Styler.FromJson(value); }
	get styler() { return this._styler; }

	constructor(node) {
		super(node);

		this._cell = { w:null, h:null };
		this._dimensions = null;
		this._columns = null;
		this._spacing = null;
		this._size = null;
		this._styler = null;
		this._layers = [];
		this._grids = [];

		this._ctx = this.Elem("canvas").getContext("2d");
		
		this.Node("canvas").On("mousemove", this.onCanvasMouseMove_Handler.bind(this));
		this.Node("canvas").On("mouseout", this.onCanvasMouseOut_Handler.bind(this));
		this.Node("canvas").On("click", this.onCanvasClick_Handler.bind(this));
	}
	
	Template() {
		return "<div class='grid'>" + 
				  "<div handle='canvas-container' class='grid-canvas-container'>" +
					"<canvas handle='canvas' class='grid-canvas'></canvas>" +
				  "</div>" + 
			   "</div>";
	}

	GetRows(columns, layers) {
		return Math.ceil(layers.length / columns) ;
	}
	
	Resize() {
		this._size = Dom.Geometry(this.Elem("canvas-container"));
		
		// Number of columns and rows
		this._layout = {
			columns : this.columns,
			rows : this.GetRows(this.columns, this.layers)
		}

		// Size of one layer drawn, only used to determine cell size, shouldn't be used after
		var layer = {
			w : (this._size.w - (this._layout.columns * this.spacing - this.spacing)) / this._layout.columns,
			h : (this._size.h - (this._layout.rows * this.spacing - this.spacing)) / this._layout.rows
		}
		
		// Size of a cell
		this._cell = {
			w : Math.floor(layer.w / this.dimensions.x),
			h : Math.floor(layer.h / this.dimensions.y)
		}
		
		// Total effective size of drawing space 
		this._total = {
			w : (this._cell.w * this.dimensions.x) * this._layout.columns + this._layout.columns * this.spacing - this.spacing,
			h : (this._cell.h * this.dimensions.y) * this._layout.rows + this._layout.rows * this.spacing - this.spacing
		}

		// Determine offset w, h to center grid as much as possible
		this._margin = {
			w : (this._size.w - this._total.w) / 2,
			h : (this._size.h - this._total.h) / 2
		}
		
		this._grids = this.layers.map((l, i) => {	
			var row = Math.floor(i / this._layout.columns);
			var col = i - (row * this._layout.columns);

			var x1 = col * (this.dimensions.x * this._cell.w + this.spacing);
			var y1 = row * (this.dimensions.y * this._cell.h + this.spacing);
			var x2 = x1 + this._cell.w * this.dimensions.x;
			var y2 = y1 + this._cell.h * this.dimensions.y;

			return { x1:x1, y1:y1, x2:x2, y2:y2, z:l.z } 
		}) 
		
		this.Elem("canvas").style.margin = `${this._margin.h}px ${this._margin.w}px`;		
		
		// Redefine with and height to fit with number of cells and cell size
		this.Elem("canvas").width = this._total.w;	
		this.Elem("canvas").height = this._total.h;	
	}
	
	// TODO : grid shouldn't use simulation object maybe?
	Draw(state, simulation) {
		if (this.dimensions) this.DrawState(state, simulation);
		
		else this.Default(DEFAULT_COLOR);
	}
	
	Clear() {
		this._ctx.clearRect(0, 0, this._size.w, this._size.h);
	}
	
	Default(color) {
		this._ctx.fillStyle = color;
		this._ctx.fillRect(0, 0, this._size.w, this._size.h);
	}
	
	// TODO : grid shouldn't use simulation object maybe?
	DrawState(state, simulation) {
		for (var i = 0; i < this.layers.length; i++) {
			var l = this.layers[i];
			var scale = this.styler.GetScale(l.style);
			
			for (var x = 0; x < this.dimensions.x; x++) {
				for (var y = 0; y < this.dimensions.y; y++) {
					for (var p = 0; p < l.ports.length; p++) {
						var v = state.GetValue([x, y, l.z]); // value of cell to draw
						var f = l.ports[p]; 
						
						var color = scale.GetColor(v[f]) || 'rgb(200, 200, 200)';
						
						this.DrawCell(x, y, i, color);
					}
					
					var id = x + "-" + y + "-" + l.z; // id of cell to draw
					
					if (simulation.IsSelected(id)) this.DrawCellBorder(x, y, i, scale.selected_color);
				}
			}
		}
	}
	
	// TODO : grid shouldn't use simulation object maybe?
	DrawChanges(frame, simulation) {
		for (var i = 0; i < frame.state_messages.length; i++) {
			var m = frame.state_messages[i];
			
			for (var f in m.value) {
				var layers = this._index[m.z] && this._index[m.z][f] || [];
				var v = m.value[f];
				
				for (var j = 0; j < layers.length; j++) {
					var l = layers[j];
					var scale = this.styler.GetScale(l.style);
			
					this.DrawCell(m.x, m.y, l.position, scale.GetColor(v));
					
					if (simulation.IsSelected(m.emitter)) this.DrawCellBorder(m.x, m.y, i, scale.selected_color);
				}
			}
		}
	}
	
	GetCell(clientX, clientY) {
		var rect = this.Elem("canvas").getBoundingClientRect();
		
		var x = clientX - rect.left;
		var y = clientY - rect.top;
		
		var zero = null;
		
		for (var k = 0; k < this._grids.length; k++) {
			if (x < this._grids[k].x1 || x > this._grids[k].x2) continue;
			
			if (y < this._grids[k].y1 || y > this._grids[k].y2) continue;
			
			zero = this._grids[k];
			
			break;
		}
		
		if (!zero || zero.y2 == y) return null;
		
		x = x - zero.x1;
		y = y - zero.y1;
		
		// Find the new X, Y coordinates of the clicked cell
		var pX = x - x % this._cell.w;
		var pY = y - y % this._cell.h;
		
		return { x:pX / this._cell.w, y:pY / this._cell.h, z:zero.z, k:k, layer:this.layers[k] };
	}
	
	DrawCell(x, y, k, color) {			
		var zero = this._grids[k];
			
		var x = zero.x1 + x * this._cell.w;
		var y = zero.y1 + y * this._cell.h;
		
		this._ctx.fillStyle = color;
		this._ctx.fillRect(x, y, this._cell.w, this._cell.h);
	}
	
	DrawCellBorder(x, y, k, color) {	
		var zero = this._grids[k];
		
		// Find the new X, Y coordinates of the clicked cell
		var pX = zero.x1 + x * this._cell.w;
		var pY = zero.y1 + y * this._cell.h;
		
		var dX = pX + (STROKE_WIDTH / 2);
		var dY = pY + (STROKE_WIDTH / 2);
		
		// Define a stroke style and width
		this._ctx.lineWidth = STROKE_WIDTH;
		this._ctx.strokeStyle = color;
		
		// Draw rectangle, add offset to fix anti-aliasing issue. Subtract from height and width 
		// to draw border internal to the cell
		this.ctx.strokeRect(dX, dY, this._cell.w - STROKE_WIDTH, this._cell.h - STROKE_WIDTH);
	}
	
	onCanvasClick_Handler(ev) {		
		var data = this.GetCell(ev.clientX, ev.clientY);
		
		if (!data) return;
		
		this.Emit("Click", { x:ev.pageX, y:ev.pageY, data:data });
	}
	
	onCanvasMouseMove_Handler(ev) {				
		var data = this.GetCell(ev.clientX, ev.clientY);
		
		if (!data) return;
		
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY, data:data });
	}
		
	onCanvasMouseOut_Handler(ev) {		
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY });
	}
});