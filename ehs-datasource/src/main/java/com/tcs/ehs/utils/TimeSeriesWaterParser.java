package com.tcs.ehs.utils;

import java.math.BigDecimal;
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
import com.tcs.ehs.utils.AqiCalculations.OverallAqiResponse;

@Component
public class TimeSeriesWaterParser extends CommonTimeSeriesParser {

	public Collection<Floor> convertToWaterData(Collection<CommonResponseObjectCollections> list) {
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
				List<WaterResponseObject> waterList = new ArrayList<>();
				java.util.Map<Long, WaterResponseObject> waterMap = new TreeMap<>();
				WaterResponseObject WaterResponseObject = null;
				for(CommonResponseObject commonResponseObject : commonResponseObjectList) {
					if(waterMap.get(commonResponseObject.getTimestamp()) == null) {
						WaterResponseObject = new WaterResponseObject();
						WaterResponseObject.setTimestamp(commonResponseObject.getTimestamp());
						waterMap.put(commonResponseObject.getTimestamp(), WaterResponseObject);
					}else{
						WaterResponseObject = waterMap.get(commonResponseObject.getTimestamp());
					}
					if("PH_VALUE".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WaterResponseObject.setpHValue(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("SUSPENDED_SOLIDS".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WaterResponseObject.setSuspendedSolids(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
					else if("BOD".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WaterResponseObject.setBod(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
					else if("COD".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WaterResponseObject.setCod(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
					else if("OIL_GREASE".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						WaterResponseObject.setOilGrease(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
					else if("KLD".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						
						Double kld=null;
						String f=commonResponseObject.getPropertyValue().toString();
						char i=f.charAt(0);
						String i1=String.valueOf(i);
						System.out.println("first charecter==  "+ commonResponseObject.getPropertyValue());
						String j=f.substring(1);
						System.out.println("string from second charecter="+j);
						String Str_Final=i1+"."+j;
						System.out.println("string from second charecter=========== "+Str_Final);
						kld=Double.parseDouble(Str_Final)-1.0;
						kld=round(kld,3);
						System.out.println("Final result ==  "+kld);
						WaterResponseObject.setKld(kld);
						System.out.println("KLD:::::::::::::---------------"+kld+"--------------");
						System.out.println("KLD:::::::::::::---------------"+(commonResponseObject.getPropertyValue()-1.0f)+"--------------");
						
						
					}
				}
				for(WaterResponseObject obj : waterMap.values()) {
					waterList.add(obj);
				}
				floorAsset.setData(waterList);
			}
		}
		return floorMap.values();
	}
	
	public static double round(double d, int decimalPlace) {
        BigDecimal bd = new BigDecimal(Double.toString(d));
        bd = bd.setScale(decimalPlace, BigDecimal.ROUND_HALF_UP);
        return bd.doubleValue();
    }
	public class ResponseObjectCollections {
		private List<WaterResponseObject> responseObjects = new ArrayList<>();
		private String name;

		public List<WaterResponseObject> getResponseObjects() {
			return responseObjects;
		}

		public void setResponseObjects(List<WaterResponseObject> responseObjects) {
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
	public static class WaterResponseObject {
		private Float pHValue;
		private Float suspendedSolids;
		private Float bod;
		private Float cod;
		private Float oilGrease;
		private Double kld;
		private Long timestamp;
		
		public Double getKld() {
			return kld;
		}

		public void setKld(Double kld) {
			this.kld = kld;
		}

		public Float getSuspendedSolids() {
			return suspendedSolids;
		}

		public void setSuspendedSolids(Float suspendedSolids) {
			this.suspendedSolids = suspendedSolids;
		}

		public Float getBod() {
			return bod;
		}

		public void setBod(Float bod) {
			this.bod = bod;
		}

		public Float getCod() {
			return cod;
		}

		public void setCod(Float cod) {
			this.cod = cod;
		}

		public Float getOilGrease() {
			return oilGrease;
		}

		public void setOilGrease(Float oilGrease) {
			this.oilGrease = oilGrease;
		}

		public Float getpHValue() {
			return pHValue;
		}

		public Long getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(Long timestamp) {
			this.timestamp = timestamp;
		}

		public void setpHValue(Float pHValue) {
			this.pHValue = pHValue;
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
		private List<WaterResponseObject> data = new ArrayList<>();

		public String getAssetName() {
			return assetName;
		}

		public void setAssetName(String assetName) {
			this.assetName = assetName;
		}

		public List<WaterResponseObject> getData() {
			return data;
		}

		public void setData(List<WaterResponseObject> data) {
			this.data = data;
		}

	}

}
