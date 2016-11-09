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
public class TimeSeriesWasteParser extends CommonTimeSeriesParser {

	public Collection<Floor> convertToWasteData(Collection<CommonResponseObjectCollections> list) {
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
				List<WasteResponseObject> wasteList = new ArrayList<>();
				java.util.Map<Long, WasteResponseObject> wasteMap = new TreeMap<>();
				WasteResponseObject WasteResponseObject = null;
				for(CommonResponseObject commonResponseObject : commonResponseObjectList) {
					if(wasteMap.get(commonResponseObject.getTimestamp()) == null) {
						WasteResponseObject = new WasteResponseObject();
						WasteResponseObject.setTimestamp(commonResponseObject.getTimestamp());
						wasteMap.put(commonResponseObject.getTimestamp(), WasteResponseObject);
					}else{
						WasteResponseObject = wasteMap.get(commonResponseObject.getTimestamp());
					}

					if("SOLDER_DROSS".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WasteResponseObject.setSolderDrossValue(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("USED_OIL".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WasteResponseObject.setUsedOilValue(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
					else if("DISCARDED_CONTAINERS".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WasteResponseObject.setDiscardedContainersValue(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
				}

				for(WasteResponseObject obj : wasteMap.values()) {
					wasteList.add(obj);
				}
				floorAsset.setData(wasteList);
			}
		}
		return floorMap.values();
	}
	public class ResponseObjectCollections {
		private List<WasteResponseObject> responseObjects = new ArrayList<>();
		private String name;

		public List<WasteResponseObject> getResponseObjects() {
			return responseObjects;
		}

		public void setResponseObjects(List<WasteResponseObject> responseObjects) {
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
	public static class WasteResponseObject {
		private Float solderDrossValue;
		private Float usedOilValue;
		private Float discardedContainersValue;		
		private Long timestamp;

		public Float getSolderDrossValue() {
			return solderDrossValue;
		}
		public void setSolderDrossValue(Float solderDrossValue) {
			this.solderDrossValue = solderDrossValue;
		}
		public Float getUsedOilValue() {
			return usedOilValue;
		}
		public void setUsedOilValue(Float usedOilValue) {
			this.usedOilValue = usedOilValue;
		}
		public Float getDiscardedContainersValue() {
			return discardedContainersValue;
		}
		public void setDiscardedContainersValue(Float discardedContainersValue) {
			this.discardedContainersValue = discardedContainersValue;
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
		private List<WasteResponseObject> data = new ArrayList<>();

		public String getAssetName() {
			return assetName;
		}

		public void setAssetName(String assetName) {
			this.assetName = assetName;
		}

		public List<WasteResponseObject> getData() {
			return data;
		}

		public void setData(List<WasteResponseObject> data) {
			this.data = data;
		}

	}

}
