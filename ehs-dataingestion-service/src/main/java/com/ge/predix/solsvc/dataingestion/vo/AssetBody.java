package com.ge.predix.solsvc.dataingestion.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class AssetBody {

	@JsonProperty("name")
	private String name;

	@JsonProperty("datapoints")
	private List<List<Long>> datapoints;

	private Double O3;

	private Double NH3;

	private Double NO2;

	private Double PB;

	private Double CO2;

	private Double SO2;

	private Double PM2_5;

	private Double PM10;

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

	@JsonProperty("O3")
	public Double getO3() {
		return O3;
	}

	@JsonProperty("o3")
	public void setO3(Double o3) {
		O3 = o3;
	}

	@JsonProperty("NH3")
	public Double getNH3() {
		return NH3;
	}

	@JsonProperty("nh3")
	public void setNH3(Double nH3) {
		NH3 = nH3;
	}

	@JsonProperty("NO2")
	public Double getNO2() {
		return NO2;
	}

	@JsonProperty("no2")
	public void setNO2(Double nO2) {
		NO2 = nO2;
	}

	@JsonProperty("PB")
	public Double getPB() {
		return PB;
	}

	@JsonProperty("pb")
	public void setPB(Double pB) {
		PB = pB;
	}

	@JsonProperty("CO2")
	public Double getCO2() {
		return CO2;
	}

	@JsonProperty("co2")
	public void setCO2(Double cO2) {
		CO2 = cO2;
	}

	@JsonProperty("SO2")
	public Double getSO2() {
		return SO2;
	}

	@JsonProperty("so2")
	public void setSO2(Double sO2) {
		SO2 = sO2;
	}

	@JsonProperty("PM2_5")
	public Double getPM2_5() {
		return PM2_5;
	}

	@JsonProperty("pm2_5")
	public void setPM2_5(Double pM2_5) {
		PM2_5 = pM2_5;
	}
	@JsonProperty("PM10")
	public Double getPM10() {
		return PM10;
	}
	@JsonProperty("pm10")
	public void setPM10(Double pM10) {
		PM10 = pM10;
	}

	public String toString() {
		return "AssetBody [name=" + name + ", datapoints=" + datapoints + ", O3=" + O3 + ", NH3=" + NH3 + ", NO2=" + NO2 + ", PB=" + PB + ", CO2=" + CO2 + ", SO2=" + SO2 + ", PM2_5=" + PM2_5
				+ ", PM10=" + PM10 + "]";
	}

}
