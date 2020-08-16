package models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Model implements Serializable {

	private static final long serialVersionUID = 4L;

	public String name;
	public List<String> submodels;
	
	public String getName() {
		return this.name;
	}

	public String getType() {
		return this.getSubmodels().size() > 0 ? "coupled" : "atomic";
	}
	
    public List<String> getSubmodels() {
        return submodels;
    }

    public Model(String name, List<String> submodels) {
        this.name = name;
        this.submodels = submodels;
    }
    
    public Model(String name) {
        this(name, new ArrayList<String>());
    }
    
    public Model() {
        this("",new ArrayList<String>());
    }
    
    public static Model getInstance(String name) {
    	return new Model(name);
    }
}
