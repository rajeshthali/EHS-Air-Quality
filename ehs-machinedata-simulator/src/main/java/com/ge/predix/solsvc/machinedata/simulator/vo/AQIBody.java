package com.ge.predix.solsvc.machinedata.simulator.vo;


import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class AQIBody {

	@JsonProperty("name")
	private String name;
	@JsonProperty("datapoints")
	private ArrayList<ArrayList<Long>> datapoints = new ArrayList<ArrayList<Long>>();
	
	@JsonProperty("attributes")
	private AQIAttributesVO attributes;

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

	public AQIAttributesVO getAttributes() {
		return attributes;
	}

	public void setAttributes(AQIAttributesVO attributes) {
		this.attributes = attributes;
	}

	@Override
	public String toString() {
		return "AQIBody [name=" + name + ", datapoints=" + datapoints + ", attributes=" + attributes + "]";
	}
	
	

	
	

	

	
	
}
