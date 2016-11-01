package com.ge.predix.solsvc.machinedata.simulator.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants;

public class AQIAttributesVO {
	
	@JsonProperty("floor")
	private int floor;
	
	@JsonProperty("assetName")
	private String assetName;
	
	@JsonProperty("name")
	private Constants.AQI name;

	/*@JsonProperty("O3")
	private Double O3;
	
	@JsonProperty("NH3")
	private Double NH3;
	
	@JsonProperty("NO2")
	private Double NO2;
	
	@JsonProperty("PB")
	private Double PB;
	
	@JsonProperty("CO")
	private Double CO;
	
	@JsonProperty("SO2")
	private Double SO2;
	
	@JsonProperty("PM2_5")
	private Double PM2_5;
	
	@JsonProperty("PM10")
	private Double PM10;*/

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

	@Override
	public String toString() {
		return "AQIAttributesVO [floor=" + floor + ", assetName=" + assetName+ "]";
		}

	public Constants.AQI getName() {
		return name;
	}

	public void setName(Constants.AQI name) {
		this.name = name;
	}

	
	
}
