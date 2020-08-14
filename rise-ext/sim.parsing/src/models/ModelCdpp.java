package models;

import java.util.ArrayList;
import java.util.List;

public class ModelCdpp extends Model {

	private static final long serialVersionUID = 4L;

	public String initialValue;
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
    
    public ModelCdpp(String name, List<String> submodels, List<Link> links, List<Port> ports) {
    	super(name, submodels, links, ports);
    	
        this.initialRowValues = new ArrayList<InitialRowValues>();
        this.initialValue = null;
        this.size = new int[3];
    }
    
    public ModelCdpp(String name) {
        this(name,new ArrayList<String>(),new ArrayList<Link>(),new ArrayList<Port>());
    }
    
    public ModelCdpp() {
        this("",new ArrayList<String>(),new ArrayList<Link>(),new ArrayList<Port>());
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
}