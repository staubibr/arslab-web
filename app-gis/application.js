'use strict';

import Core from '../api-web-devs/tools/core.js';
import Dom from '../api-web-devs/tools/dom.js';
import Net from '../api-web-devs/tools/net.js';
import Templated from '../api-web-devs/components/templated.js';
import Playback from '../api-web-devs/widgets/playback.js';
import Header from './widgets/header.js';
import Map from './widgets/map.js';
import Box from '../api-web-devs/ui/box-input-files.js';

export default class Main extends Templated { 

	constructor(node, config) {		
		super(node);
		
		this.simulation = null;
		
		this.Widget("map").GetScale();
	}
	
	Template() {
		return	"<main handle='main'>" +
					"<div handle='header' widget='Widget.Header' class='header'></div>" +
					"<div handle='box' widget='Widget.Box-Input-Files' class='box'></div>" +
					"<div handle='map' widget='Widget.Map' class='map'></div>" +
				"</main>";
	}
}