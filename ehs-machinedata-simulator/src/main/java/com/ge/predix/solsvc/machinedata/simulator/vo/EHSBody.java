package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class EHSBody {
	
	@JsonProperty("name")
	private String name;

	@JsonProperty("datapoints")
	private List<List<Long>> datapoints;
	
	@JsonProperty("attributes")
	private EHSAttributesVO attributes;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<List<Long>> getDatapoints() {
		return datapoints;
	}

	public void setDatapoints(List<List<Long>> datapoints) {
		this.datapoints = datapoints;
	}

	public EHSAttributesVO getAttributes() {
		return attributes;
	}

	public void setAttributes(EHSAttributesVO attributes) {
		this.attributes = attributes;
	}

	@Override
	public String toString() {
		return "EHSBody [name=" + name + ", datapoints=" + datapoints
				+ ", attributes=" + attributes + "]";
	}
	
}
