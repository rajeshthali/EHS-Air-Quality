package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class EHSAreaDataVO {
	
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
	
	@JsonProperty("machineData")
	private List<EHSMachineDataVO> machineData;

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

	public List<EHSMachineDataVO> getMachineData() {
		return machineData;
	}

	public void setMachineData(List<EHSMachineDataVO> machineData) {
		this.machineData = machineData;
	}

	@Override
	public String toString() {
		return "EHSAreaDataVO [O3=" + O3 + ", NH3=" + NH3 + ", NO2=" + NO2
				+ ", PB=" + PB + ", CO2=" + CO2 + ", SO2=" + SO2 + ", PM2_5="
				+ PM2_5 + ", PM10=" + PM10 + ", machineData=" + machineData
				+ "]";
	}

}
