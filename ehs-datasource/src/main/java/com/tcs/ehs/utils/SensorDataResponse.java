package com.tcs.ehs.utils;

import java.util.List;

public class SensorDataResponse {

	private String name;
	private List<SensorDataValues> sensorDataValues;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<SensorDataValues> getSensorDataValues() {
		return sensorDataValues;
	}
	public void setSensorDataValues(List<SensorDataValues> sensorDataValues) {
		this.sensorDataValues = sensorDataValues;
	}
	
	
}
