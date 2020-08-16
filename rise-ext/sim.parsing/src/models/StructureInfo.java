package models;

import java.util.HashMap;

public class StructureInfo extends HashMap<String, String> {

	private static final long serialVersionUID = 4L;
	
	public String getSimulator(){
		return this.get("simulator");
	}
	
	public String getType(){
		return this.get("type");
	}
	
	public String getName(){
		return this.get("name");
	}
	
	public StructureInfo(String name, String simulator, String type) {
		this.put("name", name);
		this.put("simulator", simulator);
		this.put("type", type);
	}
	
	public StructureInfo() {
		
	}
}
