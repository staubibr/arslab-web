export default class HideLayer {
    get HL() {
      return this._checkbox;
    }
    
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