package models;

import java.io.Serializable;

public class Port implements Serializable {

	private static final long serialVersionUID = 4L;

	public String name;
	public String type;

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Port(String name, String type) {
		this.name = name;
		this.type = type;
	}

    public Port() {
		this("","");
	}
}
