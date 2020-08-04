package shared;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import components.Utilities;
import models.PaletteBucket;

public class Palette {

	public static ArrayList<PaletteBucket> ParseTypeA(InputStream pal) throws IOException {
		// Type A: [rangeBegin;rangeEnd] R G B
		ArrayList<PaletteBucket> palette = new ArrayList<PaletteBucket>();
		
		Utilities.ReadFile(pal, (String l) -> {			
			if (l.isBlank()) return;

			if (!l.startsWith("[")) throw new RuntimeException("File format does not correspond to a type A palette.");
			
			String[] split = l.split(", | |,");

			int r = Integer.parseInt(split[1]);
			int g = Integer.parseInt(split[2]);
			int b = Integer.parseInt(split[3]);
			
			String[] bucket = split[0].substring(1, split[0].length() - 1).split(";");
			
			float start = Float.parseFloat(bucket[0]);
			float end = Float.parseFloat(bucket[1]);
						
			palette.add(new PaletteBucket(start, end, new int[] { r,g,b }));			
		});
		
		return palette;
	}

	public static ArrayList<PaletteBucket> ParseTypeB(InputStream pal) throws IOException {
		// Type B (VALIDSAVEFILE: lists R,G,B then lists ranges)
		ArrayList<float[]> ranges = new ArrayList<float[]>();
		ArrayList<int[]> colors = new ArrayList<int[]>();
		ArrayList<PaletteBucket> palette = new ArrayList<PaletteBucket>();

		Utilities.ReadFile(pal, (String l) -> {			
			if (l.isBlank()) return;

			// check number of components per line
			String[] split = l.split(",");		
			
			if(split.length == 2) {
				// this line is a value range [start, end]
				ranges.add(new float[] { Float.parseFloat(split[0]), Float.parseFloat(split[1]) }); 
			}
			else if (split.length == 3){ 
				// this line is a palette element [R,G,B]
				colors.add(new int[] { Integer.parseInt(split[0]), Integer.parseInt(split[1]), Integer.parseInt(split[2]) }); 
			}
		});
		
		if (ranges.size() != colors.size()) throw new RuntimeException("Ranges and colors length must match in palette type B.");

		// populate grid palette object
		for (var i = 0; i < ranges.size(); i++) {
			palette.add(new PaletteBucket(ranges.get(i)[0], ranges.get(i)[1], new int[] { colors.get(i)[0], colors.get(i)[1], colors.get(i)[2] }));			
		}
		
		return palette;
	}
}