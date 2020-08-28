package components;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.HashMap;

public class FilesMap extends HashMap<String, BufferedInputStream>{
	private static final long serialVersionUID = 1L;

	public void Mark(int pos) throws IOException {
		// Reset Streams to read them again later.
		// foreach requires a try catch block or a biconsumer declaration, awkward.
		for (Entry<String, BufferedInputStream> entry : this.entrySet()) {
			entry.getValue().mark(pos);
		}
	}
	
	public void Reset() throws IOException {
		// Reset Streams to read them again later.
		// foreach requires a try catch block or a biconsumer declaration, awkward.
		for (Entry<String, BufferedInputStream> entry : this.entrySet()) {
			entry.getValue().reset();
		}
	}
	
	public void Close() throws IOException {
		// Reset Streams to read them again later.
		// foreach requires a try catch block or a biconsumer declaration, awkward.
		for (Entry<String, BufferedInputStream> entry : this.entrySet()) {
			entry.getValue().close();
		}
	}
	
	public String FindKey(String ext) {
		return this.keySet().stream()
				   			.filter(k -> k.toLowerCase().contains(ext.toLowerCase()))
							.findFirst()
							.orElse(null);
	}
	
	public String FindName(String ext) {
		String key = FindKey(ext);
		
		return (key == null) ? null : key.substring(0, key.indexOf("."));
	}
	
	public BufferedInputStream FindByExt(String ext) {
		String key = FindKey(ext);
		
		return (key == null) ? null : this.get(key);
	}
}
