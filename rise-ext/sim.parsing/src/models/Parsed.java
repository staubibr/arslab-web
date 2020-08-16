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
	
	public Parsed(String name, Structure structure, List<? extends Message> messages) {
		this.name = name;
		this.structure = structure;
		this.messages = messages;
	}
	
	public byte[] toZipByteArray() throws JsonProcessingException, IOException {
		ZipFile zip = new ZipFile();
		
		zip.Open();
		zip.Add("structure.json", Helper.JsonToByte(this.structure));
		zip.Add("messages.log", Helper.MessagesToByte(this.structure, this.messages));
		zip.Close();
		
		return zip.toByteArray();
	}
}