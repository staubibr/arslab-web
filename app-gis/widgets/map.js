'use strict';

import Core from '../../api-web-devs/tools/core.js';
import Templated from '../../api-web-devs/components/templated.js';

export default Core.Templatable("Widget.Map", class Map extends Templated { 

	constructor(container) {
		super(container);		
	}
	
	HideLayer() {
		alert("Layer is not hidden");
	}
	
	GetScale() {
		alert("Scale is whatever");
	}
	
	Template() {
		return "<div handle='map'>fsgbdfghndfghdfghgfd</div>";
	}
});