package models;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    
    public List<String> toArray(Structure structure) {
        String[] result = new String[2];
        
        int iP = structure.getPortIndexByMessage(this);
        
        result[0] = String.valueOf(iP);
        result[1] = this.value;
        
        return Arrays.asList(result);
    }
    
    public String toString(Structure structure, CharSequence delimiter) {
    	return this.toArray(structure).stream().collect(Collectors.joining(delimiter));
    }
}
