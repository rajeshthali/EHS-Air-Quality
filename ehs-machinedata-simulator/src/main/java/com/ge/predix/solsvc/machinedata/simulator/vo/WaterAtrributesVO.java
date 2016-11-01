package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants;

public class WaterAtrributesVO {

	@JsonProperty("floor")
	private int floor;
	
	@JsonProperty("assetName")
	private String assetName;
	
	@JsonProperty("name")
	private Constants.Water name;
	
	/*@JsonProperty("name")
	private ArrayList<ArrayList<String>> name = new ArrayList<ArrayList<String>>();
*/
	//private ArrayList<ArrayList<Long>> datapoints = new ArrayList<ArrayList<Long>>();
	
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

	public Constants.Water getName() {
		return name;
	}

	public void setName(Constants.Water name) {
		this.name = name;
	}

	/*public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}*/
	
	

	/*public ArrayList<ArrayList<String>> getName() {
		return name;
	}

	public void setName(ArrayList<ArrayList<String>> name) {
		this.name = name;
	}*/

	
	
	
	
}
