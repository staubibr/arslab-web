package models;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class MessageCA extends Message {

	private static final long serialVersionUID = 4L;

	public int[] coord;


	public String getId() {
		// Sucks big time (in javascript: return m.coord.join(","))
		return Arrays.stream(this.coord).mapToObj(c -> String.valueOf(c)).collect(Collectors.joining("-"));
	}
	
    public int[] getCoord() {
        return coord;
    }
    
    public MessageCA(String time, String model, int[] coord, String port, String value) {
        super(time, model, port, value);
        
        this.coord = coord;
    }
    
    public MessageCA() {
    	this("","",null,"","");
    }

    public List<String> toArray(Structure structure) {
        String[] result = new String[5];
        
        int iP = structure.getPortIndexByMessage(this);
        				  
        result[0] = String.valueOf(this.coord[0]);
        result[1] = String.valueOf(this.coord[1]);
        result[2] = String.valueOf(this.coord[2]);
        result[3] = String.valueOf(iP);
        result[4] = this.value;

        return Arrays.asList(result);
    }
}
