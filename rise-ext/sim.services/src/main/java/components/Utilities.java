package components;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Utilities {
	
	public static FilesMap Convert(List<MultipartFile> files) throws IOException {
		FilesMap map = new FilesMap();
		
		// Stupid lambda requires a try catch block in the lambda function
		for (int i = 0; i < files.size(); i++) {
			InputStream ipt = files.get(i).getInputStream();
			BufferedInputStream bIpt = new BufferedInputStream(ipt);
			
			map.put(files.get(i).getOriginalFilename(), bIpt);
		}
		
		return map;
	}

	public static ResponseEntity<byte[]> ByteArrayResponse(String filename, byte[] buffer) throws JsonProcessingException {			
		return ResponseEntity.ok()
	   	        .contentLength(buffer.length)
	   	        .header("Content-Disposition", "attachment; filename=" + filename + ".zip")
	   	        .header("Access-Control-Allow-Headers", "Content-Disposition")
	   	        .header("Access-Control-Expose-Headers", "Content-Disposition")
	   	        .contentType(MediaType.APPLICATION_OCTET_STREAM)
	   	        .body(buffer);
	}
    
	public static ResponseEntity<InputStreamResource> FileResponse(byte[] buffer) throws JsonProcessingException {	
	   	return ResponseEntity.ok()
	   	        .contentLength(buffer.length)
	   	        .contentType(MediaType.APPLICATION_OCTET_STREAM)
	   	        .body(new InputStreamResource(new ByteArrayInputStream(buffer)));
	}
	
	public static ResponseEntity<InputStreamResource> JsonFileResponse(Object object) throws JsonProcessingException {
	   	ObjectMapper mapper = new ObjectMapper();
	   	
	   	mapper.setSerializationInclusion(Include.NON_EMPTY); 
	   	
	   	byte[] buf = mapper.writeValueAsBytes(object);
	
	   	return FileResponse(buf);
	}
	
	public static String GetFilename(MultipartFile file) {
		int idx = file.getOriginalFilename().indexOf(".");
		
		return file.getOriginalFilename().substring(0, idx);
	}
}
