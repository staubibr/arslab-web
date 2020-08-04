package components;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.List;

import models.MessageCA;

public class Utilities {

	public static void ReadFile(InputStream file, LineProcessor delegate) throws IOException {
		Reader reader = new InputStreamReader(file);
		BufferedReader br = new BufferedReader(reader);

		String line = null;
		
        while ((line = br.readLine()) != null) {
        	delegate.process(line);
        }
	}
	
	public static List<MessageCA> MergeFrames(List<MessageCA> one, List<MessageCA> two) {
		// Man Java sucks (in javascript: var index = {})
		HashMap<String, MessageCA> index = new HashMap<String, MessageCA>();
		
		one.forEach(m -> index.put(m.getId(), m));

		two.forEach(m -> {
			String id = m.getId();

			// frame 1 has message id from frame 2, supercede value of 1 by value of 2
			if (index.containsKey(id))  {
				index.get(id).value = m.getValue();
			}
			
			// frame 1 doesn't have message id from frame 2, add it
			else index.put(m.getId(), m);
		});
		
		return one;
	}
}
