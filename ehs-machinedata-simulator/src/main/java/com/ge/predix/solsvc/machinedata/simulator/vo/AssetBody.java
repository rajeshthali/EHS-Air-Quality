package com.ge.predix.solsvc.machinedata.simulator.vo;


import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class AssetBody {

	@JsonProperty("name")
	private String name;
	@JsonProperty("datapoints")
	private ArrayList<ArrayList<Long>> datapoints = new ArrayList<ArrayList<Long>>();
	
	@JsonProperty("O3")
	private Double O3;
	
	@JsonProperty("NH3")
	private Double NH3;
	
	@JsonProperty("NO2")
	private Double NO2;
	
	@JsonProperty("PB")
	private Double PB;
	
	@JsonProperty("CO2")
	private Double CO2;
	
	@JsonProperty("SO2")
	private Double SO2;
	
	@JsonProperty("PM2_5")
	private Double PM2_5;
	
	@JsonProperty("PM10")
	private Double PM10;

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

	public Double getO3() {
		return O3;
	}

	public void setO3(Double o3) {
		O3 = o3;
	}

	public Double getNH3() {
		return NH3;
	}

	public void setNH3(Double nH3) {
		NH3 = nH3;
	}

	public Double getNO2() {
		return NO2;
	}

	public void setNO2(Double nO2) {
		NO2 = nO2;
	}

	public Double getPB() {
		return PB;
	}

	public void setPB(Double pB) {
		PB = pB;
	}

	public Double getCO2() {
		return CO2;
	}

	public void setCO2(Double cO2) {
		CO2 = cO2;
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

	public Double getPM10() {
		return PM10;
	}

	public void setPM10(Double pM10) {
		PM10 = pM10;
	}

	

	

	
	
}
