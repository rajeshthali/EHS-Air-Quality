package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HygeineBody {

	@JsonProperty("name")
	private String name;
	@JsonProperty("datapoints")
	private ArrayList<ArrayList<Long>> datapoints = new ArrayList<ArrayList<Long>>();
	
	@JsonProperty("attributes")
	private HygeineAtrributesVO attributes;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ArrayList<ArrayList<Long>> getDatapoints() {
		return datapoints;
	}

	public void setDatapoints(ArrayList<ArrayList<Long>> datapoints) {
		this.datapoints = datapoints;
	}

	public HygeineAtrributesVO getAttributes() {
		return attributes;
	}

	public void setAttributes(HygeineAtrributesVO attributes) {
		this.attributes = attributes;
	}

	@Override
	public String toString() {
		return "HygeineBody [name=" + name + ", datapoints=" + datapoints + ", attributes=" + attributes + "]";
	}
	
	
	
	
	
}
