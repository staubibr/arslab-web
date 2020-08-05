package components;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import models.Message;
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

	public static byte[] JsonToByte(Object object) throws JsonProcessingException {
	   	ObjectMapper mapper = new ObjectMapper();
	   	
	   	mapper.setSerializationInclusion(Include.NON_EMPTY); 
	   	
	   	return mapper.writeValueAsBytes(object);
	}
	
	public static byte[] MessagesToByte(List<? extends Message> messages) throws IOException{
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(output, StandardCharsets.UTF_8);
		CSVPrinter printer = new CSVPrinter(osw, CSVFormat.DEFAULT);
			
		for (Message m : messages) printer.printRecord(m.toArray());
		
		printer.close();
		
		return output.toByteArray();
	}
}
