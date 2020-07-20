'use strict';

import Core from '../api-web-devs/tools/core.js';
import Dom from '../api-web-devs/tools/dom.js';
import Templated from '../api-web-devs/components/templated.js';
import Playback from '../api-web-devs/widgets/playback.js';
import BoxInput from '../api-web-devs/ui/box-input-files.js';
import Header from './widgets/header.js';
import Map from './widgets/map.js';

export default class Main extends Templated { 

	constructor(node) {			
		super(node);
		
		this.simulation = null;
		debugger;
		this.Widget("map").HideLayer();
	}
	
	Template() {
		return	"<main handle='main'>" +
					"<div handle='header' widget='Widget.Header' class='header'></div>" +
					"<div handle='box' widget='Widget.Box-Input-Files' class='box-input'></div>" +
					"<div handle='map' widget='Widget.Map' class='some-map'></div>" +
				"</main>";
	}
}