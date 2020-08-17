package models;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;

import components.Helper;
import components.ZipFile;

public class Parsed {
	public String name;
	public Structure structure;
	public List<? extends Message> messages;
	
	// TODO: Maybe create a class for this horrible double list 
	// It's this way becasue we can have a palette for each layer
	public List<List<PaletteBucket>> palette;
	
	public void setPalette(List<List<PaletteBucket>> palette) {
		this.palette = palette;
	}
	
	public Parsed(String name, Structure structure, List<? extends Message> messages) {
		this.name = name;
		this.structure = structure;
		this.messages = messages;
		this.palette = null;
	}
	
	public byte[] toZipByteArray() throws JsonProcessingException, IOException {
		ZipFile zip = new ZipFile();
		
		zip.Open();
		zip.Add("structure.json", Helper.JsonToByte(this.structure));
		zip.Add("messages.log", Helper.MessagesToByte(this.structure, this.messages));
		
		if (this.palette != null) {
			zip.Add("style.json", Helper.JsonToByte(this.palette));
		}
		
		zip.Close();
		
		return zip.toByteArray();
	}
}