package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class EHSMachineDataVO {
	
	@JsonProperty("name")
	private String name;

	@JsonProperty("NO2")
	private Double NO2;

	@JsonProperty("SO2")
	private Double SO2;

	@JsonProperty("PM2_5")
	private Double PM2_5;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getNO2() {
		return NO2;
	}

	public void setNO2(Double nO2) {
		NO2 = nO2;
	}

	public Double getSO2() {
		return SO2;
	}

	public void setSO2(Double sO2) {
		SO2 = sO2;
	}

	public Double getPM2_5() {
		return PM2_5;
	}

	public void setPM2_5(Double pM2_5) {
		PM2_5 = pM2_5;
	}

	@Override
	public String toString() {
		return "EHSMachineDataVO [name=" + name + ", NO2=" + NO2 + ", SO2="
				+ SO2 + ", PM2_5=" + PM2_5 + "]";
	}

}
