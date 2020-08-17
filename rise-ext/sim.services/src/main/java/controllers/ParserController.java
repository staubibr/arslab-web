package controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import components.CustomException;
import components.FilesMap;
import components.Utilities;
import models.PaletteBucket;
import models.Parsed;
import parsers.IParser;
import parsers.shared.Palette;
 
@RestController
@CrossOrigin(origins = "*")
public class ParserController {
    
	@PostMapping("/parser/palette/typeA")
	public ResponseEntity<InputStreamResource> parserPaletteTypeA(@RequestParam("pal") MultipartFile pal) throws IOException
	{    	        
		List<List<PaletteBucket>> palette = (new Palette()).ParseTypeA(pal.getInputStream());
		
		return Utilities.JsonFileResponse(palette);
	}
	
	@PostMapping("/parser/palette/typeB")
	public ResponseEntity<InputStreamResource> parserPaletteTypeB(@RequestParam("pal") MultipartFile pal) throws IOException
	{    	        
		List<List<PaletteBucket>> palette = (new Palette()).ParseTypeB(pal.getInputStream());
		
		return Utilities.JsonFileResponse(palette);
	}
	  	
	@PostMapping("/parser/auto")
	public ResponseEntity<byte[]> parserAuto(@RequestParam("files") List<MultipartFile> files)
	{    	        
		try {
			FilesMap map = Utilities.Convert(files);
			IParser parser = new parsers.auto.Auto();
			Parsed result = parser.Parse(map);
			
			map.Close();
			
			return Utilities.ByteArrayResponse(result.name, result.toZipByteArray());
		} 
		catch (Exception e) {
		  	throw new CustomException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@PostMapping("/parser/cdpp/celldevs")
	public ResponseEntity<byte[]> parserCdppCellDevs(@RequestParam("files") List<MultipartFile> files)
	{    	        
		try {
			FilesMap map = Utilities.Convert(files);
			IParser parser = new parsers.cdpp.Devs();
			Parsed result = parser.Parse(map);
			
			map.Close();
		  			  	
			return Utilities.ByteArrayResponse(result.name, result.toZipByteArray());
		} 
		catch (Exception e) {
		  	throw new CustomException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	   
	@PostMapping("/parser/cdpp/devs")
	public ResponseEntity<byte[]> parserCdppDevs(@RequestParam("files") List<MultipartFile> files)
	{    	        
		try {
			FilesMap map = Utilities.Convert(files);
			IParser parser = new parsers.cdpp.Devs();
			Parsed result = parser.Parse(map);
				
			map.Close();
		  			  	
			return Utilities.ByteArrayResponse(result.name, result.toZipByteArray());
		} 
		catch (Exception e) {
		  	throw new CustomException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	   
	@PostMapping("/parser/lopez/celldevs")
	public ResponseEntity<byte[]> parserLopezCellDevs(@RequestParam("files") List<MultipartFile> files)
	{    	        
		try {
			FilesMap map = Utilities.Convert(files);
			IParser parser = new parsers.lopez.CellDevs();
			Parsed result = parser.Parse(map);
		  				
			map.Close();
			
			return Utilities.ByteArrayResponse(result.name, result.toZipByteArray());
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