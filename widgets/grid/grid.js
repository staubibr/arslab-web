'use strict';

import Core from '../../../basic-tools/tools/core.js';
import Dom from '../../../basic-tools/tools/dom.js';
import Templated from '../../../basic-tools/components/templated.js';

const STROKE_WIDTH = 2;
const DEFAULT_COLOR = "#fff";

export default Core.Templatable("Widgets.Grid", class Grid extends Templated { 

	get Canvas() { return this.Node("canvas"); }
	
	set Dimensions(value) { this.dimensions = value; }
	
	set Columns(value) { this.columns = value; }
	
	set Spacing(value) { this.spacing = value; }
	
	set Z(value) { this.z = value; }
	
	constructor(node) {
		super(node);

		this.cell = { w:null, h:null };
		this.dimensions = null;
		this.columns = null;
		this.spacing = null;
		this.size = null;
		this.z = null;
		
		this.ctx = this.Elem("canvas").getContext("2d");
		
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
	
	TotalHeight(singleHeight, columns, z) {
		var rows = this.GetRows(columns, z);
		
		return singleHeight * rows + (rows - 1) * this.spacing;
	}
	
	TotalWidth(singleWidth, columns) {		
		return singleWidth * columns + (columns - 1) * this.spacing;
	}
	
	GetRows(columns, z) {
		return Math.ceil(z.length / columns) ;
	}
	
	Resize() {
		this.size = Dom.Geometry(this.Elem("canvas-container"));
		
		// Number of columns and rows
		this.layout = {
			columns : this.columns,
			rows : this.GetRows(this.columns, this.z)
		}

		// Size of one layer drawn, only used to determine cell size, shouldn't be used after
		var layer = {
			w : (this.size.w - (this.layout.columns * this.spacing - this.spacing)) / this.layout.columns,
			h : (this.size.h - (this.layout.rows * this.spacing - this.spacing)) / this.layout.rows
		}
		
		// Size of a cell
		this.cell = {
			w : Math.floor(layer.w / this.dimensions.x),
			h : Math.floor(layer.h / this.dimensions.y)
		}
		
		// Total effective size of drawing space 
		this.total = {
			w : (this.cell.w * this.dimensions.x) * this.layout.columns + this.layout.columns * this.spacing - this.spacing,
			h : (this.cell.h * this.dimensions.y) * this.layout.rows + this.layout.rows * this.spacing - this.spacing
		}

		// Determine offset w, h to center grid as much as possible
		this.margin = {
			w : (this.size.w - this.total.w) / 2,
			h : (this.size.h - this.total.h) / 2
		}
		
		this.layers = this.z.map(k => {	
			var row = Math.floor(k / this.layout.columns);
			var col = k - (row * this.layout.columns);

			var x1 = col * (this.dimensions.x * this.cell.w + this.spacing);
			var y1 = row * (this.dimensions.y * this.cell.h + this.spacing);
			var x2 = x1 + this.cell.w * this.dimensions.x;
			var y2 = y1 + this.cell.h * this.dimensions.y;

			return { x1:x1, y1:y1, x2:x2, y2:y2, z:this.z[k] } 
		}) 
		
		this.Elem("canvas").style.margin = `${this.margin.h}px ${this.margin.w}px`;		
		
		// Redefine with and height to fit with number of cells and cell size
		this.Elem("canvas").width = this.total.w;	
		this.Elem("canvas").height = this.total.h;	
	}
	
	// TODO : grid shouldn't use simulation object
	Draw(state, palette, simulation) {
		if (this.dimensions) this.DrawState(state, palette, simulation);
		
		else this.Default(DEFAULT_COLOR);
	}
	
	Clear() {
		this.ctx.clearRect(0, 0, this.size.w, this.size.h);
	}
	
	Default(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.size.w, this.size.h);
	}
	
	// TODO : grid shouldn't use simulation object
	DrawState(state, palette, simulation) {		
		for (var k = 0; k < this.z.length; k++) {
			var zero = this.layers[k];
			
			for (var i = 0; i < this.dimensions.x; i++) {
				for (var j = 0; j < this.dimensions.y; j++) {
					var id = i + "-" + j + "-" + this.z[k];	// id of cell to draw
					var v = state.models[id];				// value of cell to draw
					
					this.DrawCell(i, j, k, palette.GetColor(v));
					
					if (simulation.IsSelected(id)) this.DrawCellBorder(i, j, k, palette.SelectedColor);
				}
			}
		}
	}
	
	// TODO : grid shouldn't use simulation object
	DrawChanges(frame, palette, simulation) {
		frame.transitions.forEach((t) => {
			var k = this.z.indexOf(t.Z);
			
			if (k == -1) return;

			this.DrawCell(t.X, t.Y, k, palette.GetColor(t.Value));
					
			if (simulation.IsSelected(t.id)) this.DrawCellBorder(t.X, t.Y, k, palette.SelectedColor);
		});
	}
	
	GetCell(layerX, layerY) {
		var zero = null;
		
		for (var k = 0; k < this.layers.length; k++) {
			if (layerX < this.layers[k].x1 || layerX > this.layers[k].x2) continue;
			
			if (layerY < this.layers[k].y1 || layerY > this.layers[k].y2) continue;
			
			zero = this.layers[k];
			
			break;
		}
		
		if (!zero) return null;
		
		layerX = layerX - zero.x1;
		layerY = layerY - zero.y1;
		
		// Find the new X, Y coordinates of the clicked cell
		var pX = layerX - layerX % this.cell.w;
		var pY = layerY - layerY % this.cell.h;
		
		var x = pX / this.cell.w; 
		var y = pY / this.cell.h; 
		
		return { x:x, y:y, z:zero.z, k:k };
	}
	
	DrawCell(x, y, k, color) {			
		var zero = this.layers[k];
			
		var x = zero.x1 + x * this.cell.w;
		var y = zero.y1 + y * this.cell.h;
		
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, this.cell.w, this.cell.h);
	}
	
	DrawCellBorder(x, y, k, color) {	
		var zero = this.layers[k];
		
		// Find the new X, Y coordinates of the clicked cell
		var pX = zero.x1 + x * this.cell.w;
		var pY = zero.y1 + y * this.cell.h;
		
		var dX = pX + (STROKE_WIDTH / 2);
		var dY = pY + (STROKE_WIDTH / 2);
				
		// Define a stroke style and width
		this.ctx.lineWidth = STROKE_WIDTH;
		this.ctx.strokeStyle = color;
		
		// Draw rectangle, add offset to fix anti-aliasing issue. Subtract from height and width 
		// to draw border internal to the cell
		this.ctx.strokeRect(dX, dY, this.cell.w - STROKE_WIDTH, this.cell.h - STROKE_WIDTH);
	}
	
	onCanvasClick_Handler(ev) {		
		var data = this.GetCell(ev.layerX, ev.layerY);
		
		if (!data) return;
		
		this.Emit("Click", { x:ev.pageX, y:ev.pageY, data:data });
	}
	
	onCanvasMouseMove_Handler(ev) {		
		var data = this.GetCell(ev.layerX, ev.layerY);
		
		if (!data) return;
		
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY, data:data });
	}
	
	onCanvasMouseOut_Handler(ev) {		
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY });
	}
});