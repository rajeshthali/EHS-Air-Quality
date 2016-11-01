package com.ge.predix.solsvc.machinedata.simulator.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants;

public class HygeineAtrributesVO {
	
	@JsonProperty("floor")
	private int floor;
	
	@JsonProperty("assetName")
	private String assetName;
	
	@JsonProperty("name")
	private Constants.Hygiene name;

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

	public Constants.Hygiene getName() {
		return name;
	}

	public void setName(Constants.Hygiene name) {
		this.name = name;
	}
	
}
