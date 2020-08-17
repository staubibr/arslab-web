package models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

public class Structure implements Serializable {

	private static final long serialVersionUID = 4L;
	
	public Map<String, String> info;

	public List<Model> nodes;
	public List<Port> ports;
	public List<Link> links;
	
	public Map<String, String> getInfo() {
		return this.info;
	}
	
	public void setInfo(Map<String, String> value) {
		this.info = value;
	}

	public List<Model> getNodes() {
		return this.nodes;
	}

	public List<Port> getPorts() {
		return this.ports;
	}

	public List<Link> getLinks() {
		return this.links;
	}
	
    public Structure(Map<String, String> info, List<Model> models, List<Port> ports, List<Link> links) {
    	this.info = info;
        this.nodes = models;
        this.ports = ports;
        this.links = links;
    }
    
    public Structure(List<Model> models, List<Port> ports, List<Link> links) {
    	this(new HashMap<String, String>(), models, ports, links);
    }
    
    public Structure() {
    	this(new ArrayList<Model>(), new ArrayList<Port>(), new ArrayList<Link>());
    }
    
    public Structure(Map<String, String> info) {
    	this(info, new ArrayList<Model>(), new ArrayList<Port>(), new ArrayList<Link>());
    }
    
    public int getPortIndexByMessage(Message m) {
        return IntStream.range(0, this.getPorts().size())
        				  .filter(i -> this.getPorts().get(i).CompareMessage(m))
        				  .findFirst()
        				  .orElse(-1);
    }
}
