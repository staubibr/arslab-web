package models;

import java.io.Serializable;

public class Message implements Serializable {

	private static final long serialVersionUID = 4L;

	public String time;
	public String model;
	public String port;
	public String value;

    public String getTime() {
        return time;
    }

    public String getModel() {
        return model;
    }

    public String getPort() {
        return port;
    }

    public String getValue() {
        return value;
    }
    
    public Message(String time, String model, String port, String value) {
        this.time = time;
        this.model = model;
        this.port = port;
        this.value = value;
    }
    
    public Message() {
    	this("","","","");
    }
}
