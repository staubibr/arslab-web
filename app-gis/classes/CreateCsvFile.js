export default class CreateCsvFileForDownload {
    get CSV() {
      return this._file;
    }
  
    constructor(transitions) {
      this._file = this.ToFile(transitions)

      var blob = new Blob([this._file], { type: 'text/csv;charset=utf-8;' });

      var link = document.createElement("a");
  
      var url = URL.createObjectURL(blob);
  
      link.setAttribute("href", url);
  
      link.setAttribute("download", this._file.name);
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }

    ToFile(data) {
		var content = data.map(c => this.ToCSV(c));
		
		content = content.join("\r\n") + "\r\n";
		
		return new File([content], "transitions.csv", { type:"text/plain",endings:'native' });
    }
  
    ToCSV(c) { return [c.time, c.model, c.port, c.value].join(","); }
  }
  