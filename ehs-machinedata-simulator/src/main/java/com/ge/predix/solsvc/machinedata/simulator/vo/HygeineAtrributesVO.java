package com.ge.predix.solsvc.machinedata.simulator.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HygeineAtrributesVO {
	
	@JsonProperty("floor")
	private int floor;
	
	@JsonProperty("assetName")
	private String assetName;
	
	@JsonProperty("temperature")
	private Double temperature;
	
	@JsonProperty("noise")
	private Double noise;
	
	@JsonProperty("humidity")
	private Double humidity;

	public Double getTemperature() {
		return temperature;
	}

	public void setTemperature(Double temperature) {
		this.temperature = temperature;
	}

	public Double getNoise() {
		return noise;
	}

	public void setNoise(Double noise) {
		this.noise = noise;
	}

	public Double getHumidity() {
		return humidity;
	}

	public void setHumidity(Double humidity) {
		this.humidity = humidity;
	}

	public int getFloor() {
		return floor;
	}

	public void setFloor(int floor) {
		this.floor = floor;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}
	
	
}
