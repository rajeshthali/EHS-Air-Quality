package com.tcs.ehs.utils;

import java.util.List;

public class SensorDataResponse {

	private String name;
	private List<SensorDataValues> SensorDataValues;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<SensorDataValues> getSensorDataValues() {
		return SensorDataValues;
	}
	public void setSensorDataValues(List<SensorDataValues> sensorDataValues) {
		SensorDataValues = sensorDataValues;
	}
	
	
}
