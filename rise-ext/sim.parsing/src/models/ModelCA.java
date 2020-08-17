package models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ModelCA extends Model {

	private static final long serialVersionUID = 4L;

    @JsonIgnore 
	public String initialValue;
    
    @JsonIgnore 
	public List<InitialRowValues> initialRowValues;
    
	public int[] size;
	
    public String getInitialValue() {
        return initialValue;
    }
    
    public List<InitialRowValues> getInitialRowValues() {
        return initialRowValues;
    }

    public int[] getSize() {
        return size;
    }

    public void setSize(int[] value) {
        this.size = value;
    }
    
    public void setSizeX(int value) {
    	if (this.size == null) this.size = new int[] { 1,1,1 };
    	
    	this.size[0] = value;
    }
    
    public void setSizeY(int value) {
    	if (this.size == null) this.size = new int[] { 1,1,1 };
    	
    	this.size[1] = value;
    }
    
    public void setSizeZ(int value) {
    	if (this.size == null) this.size = new int[] { 1,1,1 };
    	
    	this.size[2] = value;
    }
    
    public ModelCA(String name, List<String> submodels) {
    	super(name, submodels);
    	
        this.initialRowValues = new ArrayList<InitialRowValues>();
        this.initialValue = null;
        this.size = null;
    }
    
    public ModelCA(String name) {
        this(name, new ArrayList<String>());
    }
    
    public ModelCA() {
        this("", new ArrayList<String>());
    }

    public List<MessageCA> GlobalFrame() {
		List<MessageCA> messages = new ArrayList<MessageCA>();
		
		if (this.getInitialValue() == null) return messages;
		
		for (int x = 0; x < this.size[0]; x++) {
			for (int y = 0; y < this.size[1]; y++) {
				for (int z = 0; z < this.size[2]; z++) {
					int[] coord = new int[] { x, y, z };
					
					messages.add(new MessageCA("00:00:00:000", this.name, coord, "out", this.initialValue));
				}
			}
		}
				
		return messages;
	}
	
	public List<MessageCA> RowFrame() {
		List<MessageCA> messages = new ArrayList<MessageCA>();
		
		if (this.getInitialRowValues().size() == 0) return messages;
		
		this.getInitialRowValues().forEach(rv -> {
			for (int y = 0; y < rv.values.size(); y++) {
				int[] coord = new int[] { rv.getRow(), y, 0 };
				String value = rv.getValues().get(y);
				
				messages.add(new MessageCA("00:00:00:000", this.name, coord, "out", value));
			}
		});
		
		return messages;
	}
    
    public static ModelCA getInstance(String name) {
    	return new ModelCA(name);
    }
}
