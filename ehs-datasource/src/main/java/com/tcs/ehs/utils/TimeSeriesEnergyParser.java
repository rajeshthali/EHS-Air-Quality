package com.tcs.ehs.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Results;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Tag;
import com.ge.predix.entity.util.map.Map;

@Component
public class TimeSeriesEnergyParser extends CommonTimeSeriesParser {

	public Collection<Floor> convertToEnergyData(Collection<CommonResponseObjectCollections> list) {
		java.util.Map<String, Floor> floorMap = new HashMap<>();
		if(list != null) {
			Floor floorObj = null;
			for(CommonResponseObjectCollections responseObjectCollection : list) {
				String floorNoStirng = Integer.toString(responseObjectCollection.getFloor());
				floorObj = floorMap.get(floorNoStirng);
				if (floorObj == null) {
					floorObj = new Floor();
					floorObj.setFloorNo(floorNoStirng);
					floorMap.put(floorNoStirng, floorObj);
				}
				String assetNameStirng = responseObjectCollection.getAssetName();
				FloorAsset floorAsset = floorObj.getAssetsMap().get(assetNameStirng);
				if (floorAsset == null) {
					floorAsset = new FloorAsset();
					floorAsset.setAssetName(assetNameStirng);
					floorObj.getAssetsMap().put(assetNameStirng, floorAsset);
				}
				List<CommonResponseObject> commonResponseObjectList = responseObjectCollection.getResponseObjects();
				List<EnergyResponseObject> energyList = new ArrayList<>();
				java.util.Map<Long, EnergyResponseObject> energyMap = new TreeMap<>();
				EnergyResponseObject EnergyResponseObject = null;
				for(CommonResponseObject commonResponseObject : commonResponseObjectList) {
					if(energyMap.get(commonResponseObject.getTimestamp()) == null) {
						EnergyResponseObject = new EnergyResponseObject();
						EnergyResponseObject.setTimestamp(commonResponseObject.getTimestamp());
						energyMap.put(commonResponseObject.getTimestamp(), EnergyResponseObject);
					}else{
						EnergyResponseObject = energyMap.get(commonResponseObject.getTimestamp());
					}

					if("SMTLine1".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						EnergyResponseObject.setSmtLine1EnergyValue(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("SMTLine2".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						EnergyResponseObject.setSmtLine2EnergyValue(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
					else if("ProductionGroundFloor".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						EnergyResponseObject.setProductionGroundFloorEnergyValue(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}	
				}
				for(EnergyResponseObject obj : energyMap.values()) {
					energyList.add(obj);
				}
				floorAsset.setData(energyList);
			}
		}
		return floorMap.values();
	}
	public class ResponseObjectCollections {
		private List<EnergyResponseObject> responseObjects = new ArrayList<>();
		private String name;

		public List<EnergyResponseObject> getResponseObjects() {
			return responseObjects;
		}

		public void setResponseObjects(List<EnergyResponseObject> responseObjects) {
			this.responseObjects = responseObjects;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}
	@JsonInclude(Include.NON_NULL)
	public static class EnergyResponseObject {

		private Float smtLine1EnergyValue;
		private Float smtLine2EnergyValue;
		private Float productionGroundFloorEnergyValue;		
		private Long timestamp;

		public Float getSmtLine1EnergyValue() {
			return smtLine1EnergyValue;
		}
		public void setSmtLine1EnergyValue(Float smtLine1EnergyValue) {
			this.smtLine1EnergyValue = smtLine1EnergyValue;
		}
		public Float getSmtLine2EnergyValue() {
			return smtLine2EnergyValue;
		}
		public void setSmtLine2EnergyValue(Float smtLine2EnergyValue) {
			this.smtLine2EnergyValue = smtLine2EnergyValue;
		}
		public Float getProductionGroundFloorEnergyValue() {
			return productionGroundFloorEnergyValue;
		}
		public void setProductionGroundFloorEnergyValue(Float productionGroundFloorEnergyValue) {
			this.productionGroundFloorEnergyValue = productionGroundFloorEnergyValue;
		}
		public Long getTimestamp() {
			return timestamp;
		}
		public void setTimestamp(Long timestamp) {
			this.timestamp = timestamp;
		}

	}

	public static class Floor {
		@JsonIgnore
		private java.util.Map<String, FloorAsset> assetsMap = new HashMap<>();
		private String floorNo;

		public Collection<FloorAsset> getAssets() {
			return assetsMap.values();
		}

		public String getFloorNo() {
			return floorNo;
		}

		public void setFloorNo(String floorNo) {
			this.floorNo = floorNo;
		}

		public java.util.Map<String, FloorAsset> getAssetsMap() {
			return assetsMap;
		}

		public void setAssetsMap(java.util.Map<String, FloorAsset> assetsMap) {
			this.assetsMap = assetsMap;
		}

	}

	@JsonInclude(Include.NON_NULL)
	public static class FloorAsset {
		private String assetName;
		private List<EnergyResponseObject> data = new ArrayList<>();

		public String getAssetName() {
			return assetName;
		}

		public void setAssetName(String assetName) {
			this.assetName = assetName;
		}

		public List<EnergyResponseObject> getData() {
			return data;
		}

		public void setData(List<EnergyResponseObject> data) {
			this.data = data;
		}

	}

}
