package components;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import models.Message;
import models.MessageCA;
import models.Structure;

public class Helper {

	public static void ReadFile(InputStream file, LineProcessor delegate) throws IOException {
		Reader reader = new InputStreamReader(file);
		BufferedReader br = new BufferedReader(reader);

		String line = null;
		
        while ((line = br.readLine()) != null) {
        	delegate.process(line);
        }
	}
	
	public static List<String> ReadNLines(InputStream file, int n) throws IOException {
		Reader reader = new InputStreamReader(file);
		BufferedReader br = new BufferedReader(reader);
		
		List<String> lines = new ArrayList<String>();
		
		for (int i = 0; i < n; i++) {
			String line = br.readLine();
		
			if (line == null) break;
			
			lines.add(line);
		}
		
		return lines;
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

	public static byte[] JsonToByte(Object object) throws JsonProcessingException {
	   	ObjectMapper mapper = new ObjectMapper();
	   	
	   	mapper.setSerializationInclusion(Include.NON_EMPTY); 
	   	
	   	return mapper.writeValueAsBytes(object);
	}
	
	public static byte[] StringToByte(String data) throws IOException {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(output, StandardCharsets.UTF_8);

		osw.write(data);
		osw.close();
		
		return output.toByteArray();
	}
	/*
	public static byte[] MessagesToByte(Structure structure, List<? extends Message> messages) throws IOException{
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(output, StandardCharsets.UTF_8);
		CSVPrinter printer = new CSVPrinter(osw, CSVFormat.DEFAULT);
			
		for (Message m : messages) printer.printRecord(m.toArray(structure));
		
		printer.close();
		
		return output.toByteArray();
	}
	*/
	public static byte[] MessagesToByte(Structure structure, List<? extends Message> messages) throws IOException {		
		// TODO: This could be done in a better way, I just need to get the format out now so I can start writing
		// my paper. A nice way to do this would be to organize messages into frames before reaching this point.		
		List<String> lines = new ArrayList<String>();
		List<String> line = new ArrayList<String>();
		
		line.add(messages.get(0).getTime());
		
		for (Message m : messages) {
			if (line.size() > 0 && !line.get(0).equals(m.getTime())) {
				lines.add(line.stream().collect(Collectors.joining(";")));
				
				line = new ArrayList<String>();
								
				line.add(m.getTime());
			}
			
			line.add(m.toString(structure, ","));			
		}
				
		String data = lines.stream().collect(Collectors.joining(System.lineSeparator()));
		
		return StringToByte(data);
	}
	
	public static String FindKey(Map<String, InputStream> files, String ext) {
		return files.keySet().stream()
				   			 .filter(k -> k.contains(ext))
							 .findFirst()
							 .orElse(null);
	}
	
	public static String FindName(Map<String, InputStream> files, String ext) {
		String key = FindKey(files, ext);
		
		return (key == null) ? null : key.substring(0, key.indexOf("."));
	}
	
	public static InputStream FindByExt(Map<String, InputStream> files, String ext) {
		String key = FindKey(files, ext);
		
		return (key == null) ? null : files.get(key);
	}
	
	
}
