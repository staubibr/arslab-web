package models;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

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
    
    public List<String> toArray() {
        String[] result = new String[4];
        
        result[0] = this.time;
        result[1] = this.model;
        result[2] = this.port;
        result[3] = this.value;
        
        return Arrays.asList(result);
    }
}
