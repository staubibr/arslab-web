package parsers.shared;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;

import components.Helper;
import models.InitialRowValues;
import models.Link;
import models.Model;
import models.ModelCA;
import models.Port;
import models.Structure;

public class Ma {

	private Model current = null;
	
	private Model ReadModel(Structure structure, String l) {
		String name = l.substring(1, l.length() - 1);
		
		Model out = new Model(name);
		
		structure.getNodes().add(out);
		
		return out;
	}
	
	private ModelCA ReadModelCA(Structure structure, String l, ArrayList<String> ignore) {
		String name = l.substring(1, l.length() - 1);
		
		if (ignore.contains(name)) return null; 
		
		ModelCA out = new ModelCA(name);
						
		structure.getNodes().add(out);
		
		return out;
	}
	
	private void ReadLink(Structure structure, Model current, String r) {
		String[] sLink = r.split("\\s+");
		String[] lLink = sLink[0].split("@");
		String[] rLink = sLink[1].split("@");
		
		Link link = new Link();
		
		link.modelA = lLink.length == 1 ? current.name : lLink[1];
		link.portA = lLink[0];
		link.portB = rLink[0];
		link.modelB = rLink.length == 1 ? current.name : rLink[1];

		// For Cell-DEVS models linked to DEVS models, links will contain the coordinate of the 
		// linked cell. For now, we remove that information. In the future, we should keep it.
		// This will require a linkCA class and maybe is a good time to convert parsers as 
		// objects rather than collection of static functions.
		// link.modelA = link.modelA.split("\\(")[0];
		// link.modelB = link.modelB.split("\\(")[0];
		
		structure.getLinks().add(link);
	}

	private void ReadDim(ModelCA model, String r) {
		String tmp = r.replaceAll(" ", "");
		
		String[] dim = tmp.substring(1, tmp.length() - 1).split(",|, ");
		
		model.setSize(new int[3]);
		
		model.size[0] = Integer.parseInt(dim[0]);
		model.size[1] = Integer.parseInt(dim[1]);
		model.size[2] = (dim.length == 2) ? 1 : Integer.parseInt(dim[2]);
	}
	
	private void ReadNeighborPorts(Structure structure, Model current, String r, String template) {
		Arrays.stream(r.split(" "))
			  .forEach(p -> {
				  structure.getPorts().add(new Port(current.name, p, "output", template));
			  });
	}
	
	private void ReadInitialRowValues(ModelCA model, String r) {
		String[] split = r.split("\\s+");
		
		InitialRowValues rv = new InitialRowValues();
		
		rv.row = Integer.parseInt(split[0]);
		
		for (int i = 0; i < split[1].length(); i++) {
		    char c = split[1].charAt(i);        

			rv.values.add(String.valueOf(c));
		}
		
		model.initialRowValues.add(rv);
	}
	
	private void CompletePorts(Structure structure, String template) {
		structure.getLinks().forEach((Link l) -> {
			Port pA = structure.getPorts().stream()
										  .filter(p -> p.name.equals(l.portA) && p.model.equals(l.modelA))
										  .findFirst()
										  .orElse(null);

			if (pA == null) structure.getPorts().add(new Port(l.modelA, l.portA, "output", template));

			Port pB = structure.getPorts().stream()
									   	  .filter(p -> p.name.equals(l.portB) && p.model.equals(l.modelB))
										  .findFirst()
										  .orElse(null);

			if (pB == null) structure.getPorts().add(new Port(l.modelB, l.portB, "input", template));			
		});	
	}
	
	public <T extends Model> Structure Parse(InputStream ma, String template) throws IOException {	
		Structure structure = new Structure();
				
		Helper.ReadFile(ma, (String line) -> {
			String[] lr = line.trim().toLowerCase().split(":");
			String l = lr[0].trim();
			
			if (l.startsWith("[")) current = ReadModel(structure, l);
			
			if (lr.length < 2) return;
			
			String r = lr[1].trim();

			// components : sender@Sender
			if (l.equals("components")) current.submodels.add(r.split("@")[0]);

			// Link : dataOut@sender in1@Network
			else if (l.equals("link")) ReadLink(structure, current, r);
		});
		
		CompletePorts(structure, template);
				
		structure.getPorts().sort((Port a, Port b) -> a.getModel().compareTo(b.getModel()));
		structure.getLinks().sort((Link a, Link b) -> a.getModelA().compareTo(b.getModelA()));
		
		return structure;
	}
	
	public Structure ParseCA(InputStream ma, String template) throws IOException {
		Structure structure = new Structure();
				
		ArrayList<String> ignore = new ArrayList<String>();

		ignore.add("top");
		
		Helper.ReadFile(ma, (String line) -> {
			String[] lr = line.trim().toLowerCase().split(":");
			String l = lr[0].trim();
			
			if (l.startsWith("[")) current = ReadModelCA(structure, l, ignore);
			
			if (current == null || lr.length < 2) return;
			
			String r = lr[1].trim();

			// components : sender@Sender
			if (l.equals("components")) current.submodels.add(r.split("@")[0]);

			// Link : dataOut@sender in1@Network
			else if (l.equals("link")) ReadLink(structure, current, r);

			// NeighborPorts: c ty
			else if (l.equals("neighborports")) ReadNeighborPorts(structure, current, r, template);

			// dim : (30, 30)
			else if (l.equals("dim")) ReadDim((ModelCA)current, r);

			// height : 20
			else if (l.equals("height")) ((ModelCA)current).setSizeX(Integer.parseInt(r));

			// width : 50
			else if (l.equals("width")) ((ModelCA)current).setSizeY(Integer.parseInt(r));

			// initialvalue : 0
			else if (l.equals("initialvalue")) ((ModelCA) current).initialValue = r;

			// initialrowvalue :  1      00111011100011100200
			else if (l.equals("initialrowvalue")) ReadInitialRowValues((ModelCA) current, r);

			// localtransition : RegionBehavior
			else if (l.equals("localtransition") || l.equals("zone")) ignore.add(r);
		});
		
		CompletePorts(structure, template);
		
		structure.getPorts().sort((Port a, Port b) -> a.getModel().compareTo(b.getModel()));
		structure.getLinks().sort((Link a, Link b) -> a.getModelA().compareTo(b.getModelA()));
		
		return structure;
	}
}