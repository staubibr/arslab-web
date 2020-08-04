package controllers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import components.CustomException;
import models.ModelCdpp;
import models.PaletteBucket;
import models.Parsed;
import parsers.cdpp.CellDevs;
import shared.Ma;
import shared.Palette;
 
@RestController
public class ParserController {
    
	private ResponseEntity<InputStreamResource> FileResponse(Object object) throws JsonProcessingException {
	   	ObjectMapper mapper = new ObjectMapper();
	   	
	   	mapper.setSerializationInclusion(Include.NON_EMPTY); 
	   	
	   	byte[] buf = mapper.writeValueAsBytes(object);
	
	   	return ResponseEntity.ok()
	   	        .contentLength(buf.length)
	   	        .contentType(MediaType.APPLICATION_OCTET_STREAM)
	   	        .body(new InputStreamResource(new ByteArrayInputStream(buf)));
	}
/*
	@PostMapping("/parser/ma")
	public ResponseEntity<InputStreamResource> parserMA(@RequestParam("ma") MultipartFile ma) throws IOException
	{
		List<ModelCdpp> models = Ma.Parse(ma.getInputStream());
				
		return this.FileResponse(models);
	}
*/
	@PostMapping("/parser/palette/typeA")
	public ResponseEntity<InputStreamResource> parserPaletteTypeA(@RequestParam("pal") MultipartFile pal) throws IOException
	{    	        
		ArrayList<PaletteBucket> palette = Palette.ParseTypeA(pal.getInputStream());
		
		return this.FileResponse(palette);
	}
	
	@PostMapping("/parser/palette/typeB")
	public ResponseEntity<InputStreamResource> parserPaletteTypeB(@RequestParam("pal") MultipartFile pal) throws IOException
	{    	        
		ArrayList<PaletteBucket> palette = Palette.ParseTypeB(pal.getInputStream());
		
		return this.FileResponse(palette);
	}
   
	@PostMapping("/parser/cdpp/celldevs")
	public ResponseEntity<String> parserCdppCellDevs(@RequestParam("ma") MultipartFile ma, @RequestParam("val") MultipartFile val, @RequestParam("log") MultipartFile log)
	{    	        
		try {
			Parsed result = CellDevs.Parse(ma.getInputStream(), val.getInputStream(), log.getInputStream());
		  	
			// TODO : convert into simulation.json, messages.json
			
			return new ResponseEntity<String>("Yessir!", HttpStatus.OK);
		} 
		catch (Exception e) {
		  	throw new CustomException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
    
	@ExceptionHandler(CustomException.class)
	public ResponseEntity<String> handleException(CustomException e) {
	    return ResponseEntity.status(e.getStatus()).body(e.getMessage());
	}
}