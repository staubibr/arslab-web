package models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class InitialRowValues implements Serializable {

	private static final long serialVersionUID = 4L;

	public Integer row;
	public List<String> values;

    public int getRow() {
        return row;
    }

    public List<String> getValues() {
        return values;
    }
    
    public InitialRowValues() {    	
        this.row = null;
        this.values = new ArrayList<String>();
    }
    
    public InitialRowValues(int row, List<String> values) {    	
        this.row = row;
        this.values = values;
    }
}
