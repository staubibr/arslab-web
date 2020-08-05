package components;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException {
	
	private static final long serialVersionUID = 4L;
	
    private HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

    public HttpStatus getStatus() {
        return status;
    }

    public CustomException(HttpStatus status, String message) {
        super(message);
        
        this.status = status;
    }
}
