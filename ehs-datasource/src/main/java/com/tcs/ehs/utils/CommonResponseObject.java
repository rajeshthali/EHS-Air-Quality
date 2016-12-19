package com.tcs.ehs.utils;

public class CommonResponseObject {
	private String properyName;
	private Integer propertyValue;
	private Long timestamp;
	private Integer KLDValue;
	public Integer getKLDValue() {
		return KLDValue;
	}
	public void setKLDValue(Integer KLDValue) {
		this.KLDValue = KLDValue;
	}
	public String getProperyName() {
		return properyName;
	}
	public void setProperyName(String properyName) {
		this.properyName = properyName;
	}
	public Integer getPropertyValue() {
		return propertyValue;
	}
	public void setPropertyValue(Integer propertyValue) {
		this.propertyValue = propertyValue;
	}
	public Long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Long timestamp) {
		this.timestamp = timestamp;
	}
	
	

}
