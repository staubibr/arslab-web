package models;

import java.io.Serializable;

public class Link implements Serializable {

	private static final long serialVersionUID = 4L;
	
	public String modelA;
	public String portA;
	public String modelB;
	public String portB;

    public String getModelA() {
        return modelA;
    }

    public String getPortA() {
        return portA;
    }

    public String getModelB() {
        return modelB;
    }

    public String getPortB() {
        return portB;
    }
    
    public Link(String modelA, String portA, String modelB, String portB) {
        this.modelA = modelA;
        this.portA = portA;
        this.modelB = modelB;
        this.portB = portB;
    }
    
    public Link() {
    	this("","","","");
    }
}
