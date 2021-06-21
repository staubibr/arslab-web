'use strict';

import Section from './section.js';

export default class Playback extends Section { 
	
	get speed() { return this._json.speed; }
	
	get loop() { return this._json.loop; }
	
	get cache() {  return this._json.cache; }
	
	set speed(value) { this._json.speed = value; }
	
	set loop(value) { this._json.loop = value; }
	
	set cache(value) { this._json.cache = value; }
	
	constructor(json) {		
		super(json);
		
		this.json = json || Playback.Default();
	}
	
	static FromJson(json) {
		var playback = new Playback();
		
		if (json.speed != undefined) playback.json.speed = json.speed;
		if (json.loop != undefined) playback.json.loop = json.loop;
		if (json.cache != undefined) playback.json.cache = json.cache;
		
		return playback;
	}
	
	static Default() {
		return {
			speed : 10,
			loop : false,
			cache : 10
		}
	}
}
