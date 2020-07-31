'use strict';
import Core from '../../api-web-devs/tools/core.js';
import Parser from "../../api-web-devs/parsers/parser.js";
export default class CustomParser extends Parser {
	
	Parse(txt) {
		var d = Core.Defer();
		
		if (!txt) {
			d.Reject(new Error("A log (.txt) file must be provided for the custom GIS DEVS parser."));
		
			return d.promise;
		}
		var p = this.ReadByChunk(txt, (parsed, chunk) => {
			return parsed.concat(chunk.split("\n"));
		})
		
		p.then((data) => {
			if (!data) return d.Reject(new Error("Unable to parse the log (.txt) file."));
			
			d.Resolve(data);
		}, (error) => {
			d.Reject(error);
		});
		
		return d.promise;
	}
}