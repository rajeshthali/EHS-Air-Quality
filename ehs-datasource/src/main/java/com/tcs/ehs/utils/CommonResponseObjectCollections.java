package com.tcs.ehs.utils;

import java.util.ArrayList;
import java.util.List;

public class CommonResponseObjectCollections {
	private List<CommonResponseObject> responseObjects = new ArrayList<>();
	private String assetName;
	private int floor;
	public List<CommonResponseObject> getResponseObjects() {
		return responseObjects;
	}
	public void setResponseObjects(List<CommonResponseObject> responseObjects) {
		this.responseObjects = responseObjects;
	}
	public String getAssetName() {
		return assetName;
	}
	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}
	public int getFloor() {
		return floor;
	}
	public void setFloor(int floor) {
		this.floor = floor;
	}
	
	
}
