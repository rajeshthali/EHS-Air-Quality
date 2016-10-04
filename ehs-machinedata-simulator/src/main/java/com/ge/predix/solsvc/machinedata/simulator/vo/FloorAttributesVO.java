package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.ArrayList;
import java.util.List;

public class FloorAttributesVO {
	
	private List<AQIBody> areaDataList = new ArrayList<>();
	private List<AQIBody> machineDataList = new ArrayList<>();
	private List<HygeineBody> hygieneDataList = new ArrayList<>();
	public List<AQIBody> getAreaDataList() {
		return areaDataList;
	}
	public void setAreaDataList(List<AQIBody> areaDataList) {
		this.areaDataList = areaDataList;
	}
	public List<AQIBody> getMachineDataList() {
		return machineDataList;
	}
	public void setMachineDataList(List<AQIBody> machineDataList) {
		this.machineDataList = machineDataList;
	}
	public List<HygeineBody> getHygieneDataList() {
		return hygieneDataList;
	}
	public void setHygieneDataList(List<HygeineBody> hygieneDataList) {
		this.hygieneDataList = hygieneDataList;
	}
	
}
