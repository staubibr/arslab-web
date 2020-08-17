package parsers.cdpp;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import components.FilesMap;
import components.Helper;
import models.Message;
import models.Model;
import models.Parsed;
import models.Structure;
import models.StructureInfo;
import parsers.IParser;
import parsers.shared.Ma;

public class Devs implements IParser {

	private static final String TEMPLATE = "{\"value\":${0}}";
	private static List<Message> messages;
		
	public Parsed Parse(FilesMap files)  throws IOException {
		String name = files.FindName(".ma");
		Structure structure = (new Ma()).Parse(files.FindByExt(".ma"), TEMPLATE);
		
		structure.setInfo(new StructureInfo(name, "CDpp", "DEVS"));
		
		messages = ParseLog(structure, files.FindByExt("log"));
				
		return new Parsed(name, structure, messages);
	}
		
	private static List<Message> ParseLog(Structure structure, InputStream log) throws IOException {
		messages = new ArrayList<Message>();
		
		List<Model> coupled = structure.getNodes().stream().filter(md -> md.getType().equals("coupled")).collect(Collectors.toList());
		
		Helper.ReadFile(log, (String l) -> {
			// Mensaje Y / 00:00:20:000 / top(01) / packetsent /      1.00000 para Root(00)
			if (!l.startsWith("Mensaje Y")) return;
			
			String[] split = Arrays.stream(l.split("/")).map(s -> s.trim()).toArray(String[]::new);
			
			String[] tmp1 = split[2].split("\\("); 
			String[] tmp2 = split[4].trim().split(" ");

			String m = tmp1[0];		// model name
			 			 
			Optional<Model> model = coupled.stream().filter(md -> md.getName().equals(m)).findFirst();
			 
			if (model.isPresent()) return;	// Message corresponds to coupled model, we don't want those.
			 			 			 	
			String t = split[1];	// time
			String p = split[3];	// port
			String v = tmp2[0];		// value

			// Magic
			BigDecimal number = new BigDecimal(v);  
			
			v = number.stripTrailingZeros().toPlainString();
			
			messages.add(new Message(t, m, p, v));
		});
		
		return messages;
	}
}