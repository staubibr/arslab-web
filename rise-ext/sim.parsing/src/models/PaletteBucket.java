package models;

import java.io.Serializable;

public class PaletteBucket implements Serializable {

	private static final long serialVersionUID = 4L;

	public float start;
	public float end;
	public int[] color;

    public float getStart() {
        return start;
    }

    public float getEnd() {
        return end;
    }

    public int[] getColor() {
        return color;
    }
    
    public PaletteBucket(float start, float end, int[] color) {
        this.start = start;
        this.end = end;
        this.color = color;
    }
    
    public PaletteBucket() {
    	this(0, 0, new int[3]);
    }
}
