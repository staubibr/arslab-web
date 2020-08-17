package parsers.shared;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import components.Helper;
import models.PaletteBucket;

public class Palette {

	public List<List<PaletteBucket>> ParseTypeA(InputStream pal) throws IOException {
		// Type A: [rangeBegin;rangeEnd] R G B
		ArrayList<PaletteBucket> palette = new ArrayList<PaletteBucket>();
		
		Helper.ReadFile(pal, (String l) -> {			
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
		
		return Arrays.asList(palette);
	}

	public List<List<PaletteBucket>> ParseTypeB(InputStream pal) throws IOException {
		// Type B (VALIDSAVEFILE: lists R,G,B then lists ranges)
		// TODO: What is VALIDSAVEDFILE??
		ArrayList<float[]> ranges = new ArrayList<float[]>();
		ArrayList<int[]> colors = new ArrayList<int[]>();
		ArrayList<PaletteBucket> palette = new ArrayList<PaletteBucket>();

		Helper.ReadFile(pal, (String l) -> {			
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

		return Arrays.asList(palette);
	}
	
	public List<List<PaletteBucket>> Parse(BufferedInputStream pal) throws IOException {
		pal.mark(0);
		
		List<String> lines = Helper.ReadNLines(pal, 1);
		
		if (lines.size() < 1) return null;
		
		else if (lines.get(0).contains("VALIDSAVEDFILE")) {
			// TODO: make the Palette parser into an implementation of IParser. This way, we can instantiate
			// reset, then parse
			pal.reset();
			
			return ParseTypeB(pal); 
		}
		
		else if (lines.get(0).startsWith("[")) {
			// TODO: make the Palette parser into an implementation of IParser. This way, we can instantiate
			// reset, then parse
			pal.reset();
			
			return ParseTypeA(pal);
		}
		
		else return null;
	}
}