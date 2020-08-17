package models;

import java.io.Serializable;

public class Port implements Serializable {

	private static final long serialVersionUID = 4L;

	public String model;
	public String name;
	public String type;
	public String template;

    public String getModel() {
        return model;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getTemplate() {
        return template;
    }

    public Port(String model, String name, String type, String template) {
		this.model = model;
		this.name = name;
		this.type = type;
		this.template = template;
	}
    
    public Boolean CompareMessage(Message m) {
    	return m.getModel().equals(this.getModel()) && m.getPort().equals(this.getName());
    }
}
