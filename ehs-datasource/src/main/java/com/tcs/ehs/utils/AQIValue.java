package com.tcs.ehs.utils;

public class AQIValue {
	public Constants.Range range;
	public Float B_HI = 0f;
	public Float B_LO = 0f;
	public Float I_LO = 0f;
	public Float I_HI = 0f;
	public Float value = 0f;
	public Constants.Parameter name;

	public Constants.Range getRange() {
		return range;
	}

	public void setRange(Constants.Range range) {
		this.range = range;
	}

	public Float getB_HI() {
		return B_HI;
	}

	public void setB_HI(Float b_HI) {
		B_HI = b_HI;
	}

	public Float getB_LO() {
		return B_LO;
	}

	public void setB_LO(Float b_LO) {
		B_LO = b_LO;
	}

	public Constants.Parameter getName() {
		return name;
	}

	public void setName(Constants.Parameter name) {
		this.name = name;
	}

	public Float getI_LO() {
		return I_LO;
	}

	public void setI_LO(Float i_LO) {
		I_LO = i_LO;
	}

	public Float getI_HI() {
		return I_HI;
	}

	public void setI_HI(Float i_HI) {
		I_HI = i_HI;
	}

	public Float getValue() {
		return value;
	}

	public void setValue(Float value) {
		this.value = value;
	}
	
	

}
