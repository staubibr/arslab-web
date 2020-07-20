'use strict';

import Core from '../../api-web-devs/tools/core.js';
import Templated from '../../api-web-devs/components/templated.js';

export default Core.Templatable("Widget.Map", class Map extends Templated { 

	constructor(container) {
		super(container);		
	}
	
	Template() {
		return "<div handle='map'>POTATO</div>";
	}
});