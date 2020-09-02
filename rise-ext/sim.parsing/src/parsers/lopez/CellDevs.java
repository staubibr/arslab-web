package parsers.lopez;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import components.FilesMap;
import components.Helper;
import models.MessageCA;
import models.Parsed;
import models.Port;
import models.Structure;
import models.StructureInfo;
import parsers.IParser;
import parsers.shared.Ma;

// TODO: This is very similar to CDpp Cell-DEVS, maybe they could be combined
public class CellDevs implements IParser {

	private static final String TEMPLATE = "{\"value\":${0}}";
	private static List<MessageCA> messages;
		
	public Parsed Parse(FilesMap files)  throws IOException {
		String name = files.FindName(".ma");
		Structure structure = (new Ma()).ParseCA(files.FindByExt(".ma"), TEMPLATE);
				
		FixStructure(structure);
				
		structure.setInfo(new StructureInfo(name, "Lopez", "Cell-DEVS"));
		
		messages = ParseLog(structure, files.FindByExt(".log"));
		
		return new Parsed(name, structure, messages);
	}
	
	private static void FixStructure(Structure structure) {
		structure.getPorts().forEach(p -> p.name = "out_" + p.name);
		
		structure.getNodes().forEach(m -> {
			structure.getPorts().add(new Port(m.name, "out", "output", TEMPLATE));
		});
		
		structure.getPorts().forEach(p -> p.template = "{\"value\":${0}}");
	}
	
	private static List<MessageCA> ParseLog(Structure structure, InputStream log) throws IOException {				
		messages = new ArrayList<MessageCA>();
		
		Helper.ReadFile(log, (String l) -> {
			// 0 / L / Y / 00:00:00:000:0 / region(0,0)(02) / out_scenario4 /      0.00000 / region(01)
			// probably empty line
			if (!l.startsWith("0 / L / Y")) return;
			
			String[] split = Arrays.stream(l.split("/"))
								   .map(s -> s.trim())
								   .toArray(String[]::new);

			String[] tmp1 = split[4].split("\\(");
			String[] tmp2 = tmp1[1].substring(0, tmp1[1].length() - 1).split(",");

			String t = split[3].trim();													// time
			String m = tmp1[0];															// model name
			String p = split[5];														// port
			String v = split[6];														// value

			int[] c = new int[3];

			c[0] = Integer.parseInt(tmp2[0]);
			c[1] = Integer.parseInt(tmp2[1]);
			c[2] = (tmp2.length == 2) ? 0 : Integer.parseInt(tmp2[2]);
			
			// Magic
			BigDecimal number = new BigDecimal(v);  
			
			v = number.stripTrailingZeros().toPlainString();
						
			messages.add(new MessageCA(t, m, c, p, v));
		});
		
		return messages;
	}
}