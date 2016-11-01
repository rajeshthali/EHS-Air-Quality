package com.tcs.ehs.utils;

public class SensorDataValues {

	private long timeStamp;
	private float sensorValue;
	private int dataQuality;
	public long getTimeStamp() {
		return timeStamp;
	}
	public void setTimeStamp(long timeStamp) {
		this.timeStamp = timeStamp;
	}
	public float getSensorValue() {
		return sensorValue;
	}
	public void setSensorValue(float sensorValue) {
		this.sensorValue = sensorValue;
	}
	public int getDataQuality() {
		return dataQuality;
	}
	public void setDataQuality(int dataQuality) {
		this.dataQuality = dataQuality;
	}
	
	
}
