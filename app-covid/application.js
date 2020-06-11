'use strict';

import Core from '../api-web-devs/tools/core.js';
import Dom from '../api-web-devs/tools/dom.js';
import Net from '../api-web-devs/tools/net.js';
import Templated from '../api-web-devs/components/templated.js';
import Tooltip from '../api-web-devs/ui/tooltip.js';
import oSettings from '../api-web-devs/components/settings.js';
import Standardized from '../api-web-devs/parsers/standardized.js';
import SimulationCA from '../api-web-devs/simulation/simulationCA.js';
import Playback from '../api-web-devs/widgets/playback.js';
import GridAuto from '../api-web-devs/widgets/grid/auto.js';
import Grid from '../api-web-devs/widgets/grid/grid.js';
import Header from './widgets/header.js';
import Chart from './widgets/chart.js';

export default class Main extends Templated { 

	constructor(node, config) {		
		super(node);
		
		this.config = config;
		this.simulation = null;
		this.settings = null;
		this.chart = null;
		
		this.LoadSeries(config.series);
		this.LoadLogs(config.series[0].logs);
		
		this.Node("series").On("change", this.OnSeries_Change.bind(this));
		this.Node("load").On("click", this.OnLoad_Click.bind(this));
		
		this.tooltip = new Tooltip();
		
		this.tooltip.nodes.label = Dom.Create("div", { className:"tooltip-label" }, this.tooltip.Elem("content"));
	}
	
	LoadSeries(series) {
		Dom.Empty(this.Elem("series"));
		
		series.forEach((s, i) => {			
			Dom.Create("option", { innerHTML:s.label[Core.locale], value:i  }, this.Elem("series"));
		});
	}
	
	LoadLogs(logs) {
		Dom.Empty(this.Elem("logs"));
		
		logs.forEach((l, i) => {					
			var label = Core.Nls("App_Log_Option", [l.transmission, l.death]);
			
			Dom.Create("option", { innerHTML:label, value:i }, this.Elem("logs"));
		});
	}
	
	OnSeries_Change(ev) {
		var series = this.config.series[ev.target.value];
		
		this.LoadLogs(series.logs);
	}
	
	OnLoad_Click(ev) {
		this.Widget("playback").Stop();
		
		Dom.RemoveCss(this.Elem("wait"), "hidden");
		Dom.AddCss(this.Elem("simulation"), "hidden");
		
		var i = this.Elem("series").value;
		var j = this.Elem("logs").value;
		
		var log = this.config.series[i].logs[j];
		var path = `../devs-logs/COVID/tr_${log.transmission}_dr_${log.death}/`;
		
		var p1 = Net.File(path + `simulation.json`, 'simulation.json');
		var p2 = Net.File(path + `transitions.csv`, 'transitions.csv');
		var p3 = Net.File(path + `options.json`, 'options.json');
		
		Promise.all([p1, p2, p3]).then(this.OnFiles_Loaded.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnFiles_Loaded(files) {		
		var parser = new Standardized();
		
		var p = parser.Parse(files);
		
		p.then(this.OnParser_Parsed.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnParser_Parsed(files) {	
		Dom.AddCss(this.Elem("wait"), "hidden");
		Dom.RemoveCss(this.Elem("simulation"), "hidden");
		
		var content = files.Content();
		
		this.simulation = SimulationCA.FromFiles(content);
		this.settings = oSettings.FromJson(content.options);
		
		this.settings.json.grid.width = 400;
		this.settings.json.grid.height = 400;
		this.settings.json.playback.speed = 25;
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		
		this.simulation.On("Move", this.OnSimulation_Move.bind(this));
		this.simulation.On("Jump", this.OnSimulation_Move.bind(this));
		
		var ports = this.simulation.models[0].ports.map(p => p.name);
		
		var options = { 
			clickEnabled:false,
			columns : this.settings.Get("grid", "columns"), 
			spacing : this.settings.Get("grid", "spacing"), 
			layers : [{ z:0, ports:ports, style:0 }], 
			styler:this.settings.styler
		}
		
		this.grid = new GridAuto(this.Widget("grid"), this.simulation, options);
		
		var size = this.settings.CanvasSize(this.simulation, 1);
		var geom = Dom.Geometry(this.Elem("body"));
		
		this.Elem("grid-container").style.width = size.width + "px";
		this.Elem("grid-container").style.height = size.height + "px";
		this.Elem("chart-container").style.height = size.height + "px";
		this.Elem("chart-container").style.width = (geom.w - size.width) + "px";
		
		this.grid.Redraw();
		
		this.Widget("playback").Initialize(this.simulation, this.settings);
		
		if (!this.chart) {
			this.chart = new Chart(this.Elem("chart"));
			
			this.chart.On("mousemove", this.OnChart_MouseMove.bind(this));
			this.chart.On("mouseout", this.OnChart_MouseOut.bind(this));
		}
		
		var data = this.GetChartData(this.simulation.frames);
		var dates = this.GetDates(this.simulation.frames);
		var date = this.simulation.FirstFrame().time;
		
		this.chart.Update(data, dates, "count", date, Core.Nls("Chart_Y_Label"), true);
	}
	
	GetDates(frames) {
		var dates = [];
		
		for (var j = 0; j < frames.length; j++) {
			dates.push(frames[j].time);
		}
		
		return dates;
	}
	
	GetChartData(frames) {		
		var data = [];
		
		for (var i = 0; i < this.config.chart.length; i++) {
			var c = this.config.chart[i];
			var count = 0;
			
			data.push({ id:i, label:c.label[Core.locale], values:[], color:`rgb(${c.color})` });
			
			for (var j = 0; j < frames.length; j++) {
				var f = frames[j];
				
				for (var k = 0; k < f.transitions.length; k++) {
					var t = f.transitions[k];
					
					if (t.value > c.bucket[0] && t.value <= c.bucket[1]) count++;
				}
				
				data[i].values.push({ id:c.label, time:f.time, count:count });
			}
		}
		
		return data;
	}
	
	OnSimulation_Move(ev) {		
		this.chart.UpdateHighlight(this.simulation.CurrentFrame().time, false);
	}
	
	OnChart_MouseMove(ev) {	
		this.tooltip.Empty();

		var html = `<div class='tooltip-title'>${Core.Nls("Chart_Y_Label")}</div>`;
		
		ev.items.forEach((d, i) => {
			html = html + "<div class='tooltip-line'>" + 
							 "<svg width='40' height='20'>" + 
								`<line class='tooltip-symbol' x1='10' y1='10' x2='25' y2='10' stroke='${d.color}'></line>` + 
							 "</svg>" +
							 `<div class='tooltip-label tooltip-label-left'>${d.label}: </div>` +
							 `<div class='tooltip-label tooltip-label-right'>${d.value.count}</div>` +
						  "</div>";
		});
		
		this.tooltip.Elem("content").innerHTML = html;
		
		this.tooltip.Show(ev.x + 20, ev.y - 50);
	}
	
	OnChart_MouseOut(ev) {
		this.tooltip.Hide();
	}
	
	OnWidget_Error(ev) {
		alert (ev.error);
	}
	
	Template() {
		return	"<main handle='main'>" +
					"<div handle='header' widget='Widget.Header' class='header'></div>" +
					"<hr>" +
					
					"<div class='row instructions'>" +
						"<i class='fa fa-info-circle'></i><label>nls(App_Instructions)</label>" +
					"</div>" +
					
					"<div class='row parameter'>" +
						"<label class='label parameter'>nls(App_Series)" +
							"<select handle='series'></select>" +
						"</label>" +
					"</div>" +
					
					"<div class='row parameter'>" +
						"<label class='label parameter'>nls(App_Log)" +
							"<select handle='logs'></select>" +
						"</label>" +
					"</div>" +
					
					"<div class='row parameter'>" +
						"<button handle='load' class='button load'>nls(App_Load)</button>" +
					"</div>" +
					"<hr>" +
					
				    "<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
					
					"<div handle='simulation' class='simulation hidden'>" +
						"<div handle='body' class='body'>" + 
							"<div handle='grid-container' class='grid-container'>" +
							   "<div handle='grid' widget='Widgets.Grid' class='grid-widget-container'></div>" +
							"</div>" +
							"<div handle='chart-container' class='chart-container'>" + 
								"<svg handle='chart' class='chart-svg'></svg>" + 
							"</div>" +
						"</div>" +
						
						"<div handle='playback' widget='Widget.Playback'></div>" +
					"</div>" +
				"</main>";
	}
}