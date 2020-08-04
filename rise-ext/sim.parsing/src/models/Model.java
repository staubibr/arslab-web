package models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Model implements Serializable {

	private static final long serialVersionUID = 4L;

	public String name;
	public List<String> submodels;
	public List<Link> links;
	public List<Port> ports;
	
	public String getName() {
		return this.name;
	}

	public String getType() {
		return submodels.size() > 0 ? "coupled" : "atomic";
	}
	
    public List<String> getSubmodels() {
        return submodels;
    }

    public List<Link> getLinks() {
        return links;
    }

    public List<Port> getPorts() {
        return ports;
    }
    
    public Model(String name, List<String> submodels, List<Link> links, List<Port> ports) {
        this.name = name;
        this.submodels = submodels;
        this.links = links;
        this.ports = ports;
    }
    
    public Model(String name) {
        this(name,new ArrayList<String>(),new ArrayList<Link>(),new ArrayList<Port>());
    }
    
    public Model() {
        this("",new ArrayList<String>(),new ArrayList<Link>(),new ArrayList<Port>());
    }
}
