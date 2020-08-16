package parsers;

import java.io.IOException;

import components.FilesMap;
import models.Parsed;

public interface IParser {
	public Parsed Parse(FilesMap files) throws IOException;
}
