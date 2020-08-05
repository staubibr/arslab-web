export default class CreateCsvFile {
    get CSV() {
      return this._file;
    }
  
    constructor(transitions) {
      this._file = this.ToFile(transitions)

    }

    ToFile(data) {
		var content = data.map(c => this.ToCSV(c));
		
		content = content.join("\r\n") + "\r\n";
		
		return new File([content], "transitions.csv", { type:"text/plain",endings:'native' });
    }
  
    ToCSV(c) { return [c.time, c.model, c.port, c.value].join(","); }
  }
  