'use strict';

import Core from '../../basic-tools/tools/core.js';
import Evented from '../../basic-tools/components/evented.js';
import ChunkReader from '../../basic-tools/components/chunkReader.js';

export default class Parser extends Evented { 

	constructor(files) {
		super();
		
		this.files = files;
	}
	
	Parse() {		
		throw new Error("Parsers must implement a Parse() function");
	}
	
	ParseFile(file, delegate) {
		var d = Core.Defer();
		var r = new ChunkReader();
		
		if (!file) d.Resolve(null);
		
		else r.Read(file).then(function(ev) {
			var content = delegate(ev.result);
			
			d.Resolve(content);
		});

		return d.promise;
	}
	
	ParseFileByChunk(file, delegate) {
		var d = Core.Defer();
		var reader = new ChunkReader();
		
		if (!file) d.Resolve(null);
		
		else ParseFileChunk();
		
		return d.promise;
		
		function ParseFileChunk() {
			reader.ReadChunk(file).then((ev) => {
				var idx = ev.result.lastIndexOf('\n');
				var content = ev.result.substr(0, idx);
				
				reader.MoveCursor(content.length + 1);
				
				try {
					var parserContent = delegate(content, 100 * reader.position / file.size);
				}
				catch (error) {					
					return d.Reject(new Error("Unable to parse files with selected parser. Did you select the right parser?"));
				}
				
				if (reader.position < file.size) ParseFileChunk();
				
				else if (reader.position == file.size) d.Resolve(parserContent);
				
				else throw new Error("Reader position exceeded the file size.");
			});
		}
	}
}