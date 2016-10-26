package com.tcs.ehs.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

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
public class TimeSeriesWaterParser {

	@SuppressWarnings("unchecked")
	private Float getValue(List<Object> attributes, String key) {Float value = null;
	try {
		value = (Float) attributes.get(1);
	} catch (Exception e) {
	}
	return value;}

	@SuppressWarnings("unchecked")
	private Long getValue(List<Object> values) {
		Long value = null;
		try {
			value = ((List<Long>) values.get(0)).get(0);
		} catch (Exception e) {
		}
		return value;
	}

	//amlesh
	@SuppressWarnings("unchecked")
	private Integer getValue1(List<Object> values) {
		Integer value = null;
		try {
			value = ((List<Integer>) values.get(0)).get(1);
		} catch (Exception e) {
		}
		return value;
	}
	
	public Object parseForResponse(List<ResponseObjectCollections> list) {
		List<Object> returnList = new ArrayList<>();
		for (int j = 0; j < list.size(); j++) {
			List<WaterResponseObject> innerList = list.get(j).getResponseObjects();
			java.util.Map<String, Object> innerMap = new HashMap<>();
			/*List<Long> timestamps = new ArrayList<>();*/
			List<Float> pHValue = new ArrayList<>();
			/*List<Float> noise = new ArrayList<>();
			List<Float> temprature = new ArrayList<>();*/
			for (int i = 0; i < innerList.size(); i++) {
				
				/*timestamps.add(innerList.get(i).getTimestamp());
				humidity.add(innerList.get(i).getHumidity());
				noise.add(innerList.get(i).getNoise());
				temprature.add(innerList.get(i).getTemperature());*/
			}
			innerMap.put("PH_VALUE", pHValue);
			/*innerMap.put("humidity", humidity);
			innerMap.put("noise", noise);
			innerMap.put("temprature", temprature);*/
//			innerMap.put("name", list.get(j).getName());
			returnList.add(innerMap);
		}
		return returnList;
	}

	/*public List<ResponseObjectCollections> parse(DatapointsResponse datapointsResponse) {
		List<ResponseObjectCollections> responseObjectCollections = new ArrayList<>();
		try {
			for (int j = 0; j < datapointsResponse.getTags().size(); j++) {
				ResponseObjectCollections responseObjectCollectionsObject = new ResponseObjectCollections();
				Tag tag = datapointsResponse.getTags().get(j);
				List<WaterResponseObject> list = new ArrayList<WaterResponseObject>();

				List<Results> results = tag.getResults();
				for (int i = 0; i < results.size(); i++) {

					WaterResponseObject responseObject = new WaterResponseObject();

					Map attributes = results.get(i).getAttributes();
					List<Object> values = results.get(i).getValues();

					responseObject.setName(getValue(attributes, "name"));
					responseObject.setHumidity(getValue(attributes, "humidity"));
					responseObject.setNoise(getValue(attributes, "noise"));

					responseObject.setTimestamp(getValue(values));
					list.add(responseObject);
				}
				Collections.sort(list, new Comparator<WaterResponseObject>() {
					public int compare(WaterResponseObject r1, WaterResponseObject r2) {
						return (int) (r1.getTimestamp() - r2.getTimestamp());
					}
				});

				responseObjectCollectionsObject.setName(tag.getName());
				responseObjectCollectionsObject.setResponseObjects(list);
				responseObjectCollections.add(responseObjectCollectionsObject);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return responseObjectCollections;

	}*/

	public Collection<com.tcs.ehs.utils.TimeSeriesWaterParser.Floor> parseFloor(DatapointsResponse datapointsResponse) {
		java.util.Map<String, Floor> floorMap = new HashMap<>();
		try {
			Tag tag = datapointsResponse.getTags().get(0);
			List<Results> results = tag.getResults();
			for (int i = 0; i < results.size(); i++) {
				Map attributes = results.get(i).getAttributes();
				//List values = results.get(i).getValues();
				if (attributes.size() > 0) {
					String assetNameStirng = ((ArrayList<String>) attributes.get("assetname")).get(0);
					String floorNoStirng = ((ArrayList<String>) attributes.get("floorNo")).get(0);
					String name = ((ArrayList<String>) attributes.get("name")).get(0);

					Floor floor = floorMap.get(floorNoStirng);
					if (floor == null) {
						floor = new Floor();
						floor.setFloorNo(floorNoStirng);
						floorMap.put(floorNoStirng, floor);
					}
					FloorAsset floorAsset = floor.getAssetsMap().get(assetNameStirng);
					if (floorAsset == null) {
						floorAsset = new FloorAsset();
						floorAsset.setAssetName(assetNameStirng);
						floor.getAssetsMap().put(assetNameStirng, floorAsset);
					}

					WaterResponseObject responseObject = new WaterResponseObject();

					List<Object> values = results.get(i).getValues();
					
					//Map attributes = results.get(i).getAttributes();
					
					//responseObject.setName(name);
					
					responseObject.setValue(getValue1(values));
					responseObject.setName(name);

					//responseObject.setName(getValue(values, "name"));
				/*	responseObject.setHumidity(getValue(attributes, "humidity"));
					responseObject.setNoise(getValue(attributes, "noise"));*/
					responseObject.setTimestamp(getValue(values));
					floorAsset.getData().add(responseObject);
				}

			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return floorMap.values();
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
		//private Integer name;
		/*private Float humidity;
		private Float noise;*/
		
		
		
		private String name;
		private Integer value;
		
		private Long timestamp;

		public Integer getValue() {
			return value;
		}

		public void setValue(Integer value) {
			this.value = value;
		}

		
		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public Long getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(Long timestamp) {
			this.timestamp = timestamp;
		}
		/*public Float getTemperature() {
			return pHValue;
		}*/

		/*public void setTemperature(Float temperature) {
			this.temperature = temperature;
		}

		public Float getHumidity() {
			return humidity;
		}

		public void setHumidity(Float humidity) {
			this.humidity = humidity;
		}

		public Float getNoise() {
			return noise;
		}

		public void setNoise(Float noise) {
			this.noise = noise;
		}*/
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
