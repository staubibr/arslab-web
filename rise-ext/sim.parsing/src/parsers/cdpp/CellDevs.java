package parsers.cdpp;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import components.Utilities;
import models.MessageCA;
import models.Model;
import models.ModelCdpp;
import models.Parsed;
import models.Simulation;
import shared.Ma;
import shared.Val;

public class CellDevs {

	private static List<MessageCA> messages;
		
	public static Parsed Parse(InputStream ma, InputStream val, InputStream log)  throws IOException {		
		List<ModelCdpp> modelsCdpp = Ma.Parse(ma);
		List<Model> models = new ArrayList<>(modelsCdpp);
		
		// TODO: Do CDpp models always have a single model?
		ModelCdpp main = modelsCdpp.get(1);
		
		Simulation sim = new Simulation(main.name, "Cell-DEVS", "CDpp", models);
		
		messages = ParseLog(main, val, log);
		
		return new Parsed(sim, messages);
	}
		
	private static List<MessageCA> ParseLog(ModelCdpp model, InputStream val, InputStream log) throws IOException {		
		// Merge all possible 00:000 frame messages (val > rows > global)
		messages = Utilities.MergeFrames(model.GlobalFrame(), model.RowFrame());
		
		if (val != null) messages = Utilities.MergeFrames(messages, Val.Parse(val, model));
		
		Utilities.ReadFile(log, (String l) -> {
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
			int[] c = Arrays.stream(tmp2).mapToInt(i -> Integer.parseInt(i)).toArray();	// coords
			String p = split[3];														// port
			String v = split[4].split("\\s+")[0];
			
			// Magic
			BigDecimal number = new BigDecimal(v);  
			
			v = number.stripTrailingZeros().toPlainString();
						
			messages.add(new MessageCA(t, m, c, p, v));
		});
		
		return messages;
	}
}