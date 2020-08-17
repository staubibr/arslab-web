package parsers.cdpp;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import components.FilesMap;
import components.Helper;
import models.MessageCA;
import models.ModelCA;
import models.Parsed;
import models.Port;
import models.Structure;
import models.StructureInfo;
import parsers.IParser;
import parsers.shared.Ma;
import parsers.shared.Val;

public class CellDevs implements IParser {

	private static final String TEMPLATE = "{\"value\":${0}}";
	private static List<MessageCA> messages;

	@Override
	public Parsed Parse(FilesMap files) throws IOException {
		String name = files.FindName(".ma");
		Structure structure = (new Ma()).ParseCA(files.FindByExt(".ma"), TEMPLATE);

		structure.setInfo(new StructureInfo(name, "CDpp", "Cell-DEVS"));

		FixStructure(structure);
		
		messages = ParseLog(structure, files.FindByExt(".val"), files.FindByExt(".log"));
				
		return new Parsed(name, structure, messages);
	}
	
	private static void FixStructure(Structure structure) {
		structure.getNodes().forEach(m -> {
			structure.getPorts().add(new Port(m.name, "out", "output", TEMPLATE));
		});
	}
	
	private List<MessageCA> ParseLog(Structure structure, InputStream val, InputStream log) throws IOException {	
		// TODO: Do CDpp models always have a single model?	
		ModelCA main = (ModelCA)structure.getNodes().get(0);
		
		// Merge all possible 00:000 frame messages (val > rows > global)
		messages = Helper.MergeFrames(main.GlobalFrame(), main.RowFrame());
		
		if (val != null) messages = Helper.MergeFrames(messages, (new Val()).Parse(val, main));
		
		Helper.ReadFile(log, (String l) -> {
			// Mensaje Y / 00:00:05:000 / lug(9,35,0)(1873) / out /    101.00000 para lug(02)
			// probably empty line
			if (!l.startsWith("Mensaje Y")) return;
			
			String[] split = Arrays.stream(l.split("/"))
								   .map(s -> s.trim())
								   .toArray(String[]::new);

			String[] tmp1 = split[2].split("\\(");
			String[] tmp2 = tmp1[1].substring(0, tmp1[1].length() - 1).split(",");
			
			String t = split[1]; 														// time
			String m = tmp1[0];															// model name;					
			String p = split[3];														// port
			String v = split[4].split("\\s+")[0];
			
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