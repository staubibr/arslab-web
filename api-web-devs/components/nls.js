'use strict';

import Core from '../tools/core.js';

export default class Nls { 
	
	/**
	* Gets the nls ressources
	*
	* Return : Object, an object containing the nls ressources
	*/
    static get strings() { return _strings; }
	
	/**
	* Sets the nls ressources
	*/
    static set strings(value) { _strings = value; }

	constructor(strings) {	
		this.strings = strings;
	}
	
	/**
	* Get a localized nls string ressource
	*
	* Parameters :
	*	id : String, the id of the nls ressource to retrieve
	*	subs : Array(String), an array of Strings to substitute in the localized nls string ressource
	*	locale : String, the locale for the nls ressource
	* Return : String, the localized nls string ressource
	*/
	Ressource(id, subs, locale) {
		if (!this.strings) throw new Error("Nls content not set.");
		
		var itm = this.strings[id];

		if (!itm) throw new Error("Nls String '" + id + "' undefined.");

		var txt = itm[(locale) ? locale : Core.locale];
		
		if (!txt) throw new Error("String does not exist for requested language.");

		return this.Format(txt, subs);
	}
		
	AddNls(strings) {
		this.strings = Core.Mixin(this.strings, strings);
	}
	
	/**
	* Formats a String using substitute strings
	*
	* Parameters :
	*	str : String, the String to format
	*	subs : Array(String), An array of Strings to substitute into the String
	* Return : String, the formatted String
	*/
	Format(str, subs) {
		if (!subs || subs.length == 0) return str;
		
		var s = str;

		for (var i = 0; i < subs.length; i++) {
			var reg = new RegExp("\\{" + i + "\\}", "gm");
			s = s.replace(reg, subs[i]);
		}

		return s;
	}
};
