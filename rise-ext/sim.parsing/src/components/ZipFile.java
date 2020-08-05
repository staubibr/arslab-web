package components;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipFile {
	
	private ZipOutputStream zos;
	private ByteArrayOutputStream baos;
	
	public ZipFile() {
		
	}
	
	public void Open() {
	    this.baos = new ByteArrayOutputStream();
		this.zos = new ZipOutputStream(baos);
	}
	
	public void Close() throws IOException {
		this.zos.close();
	}
	
	public void Add(String name, byte[] buffer) throws IOException {
	    ZipEntry entry = new ZipEntry(name);
	    
	    entry.setSize(buffer.length);
	    
	    this.zos.putNextEntry(entry);
	    this.zos.write(buffer);
	    this.zos.closeEntry();
	}
	
	public byte[] toByteArray() {
		return this.baos.toByteArray();
	}
}
