package models;

import java.util.List;

public class Parsed {
	public Simulation simulation;
	public List<? extends Message> messages;
	
	public Parsed(Simulation simulation, List<? extends Message> messages) {
		this.simulation = simulation;
		this.messages = messages;
	}
}
