export default class HideLayer {
    get HL() {
      return this._checkbox;
    }
    
	// NOTE: This is not reusable. What happens if no element with id "checkbox" 
	// is in the DOM Tree?
    constructor(layer) {
      this._checkbox = document.querySelector("#checkbox");
	  
      checkbox.addEventListener("change", function () {
		  var checked = this.checked;
		  
		  if (checked !== layer.getVisible()) {
			  layer.setVisible(checked);
		  }
      });

  }
}