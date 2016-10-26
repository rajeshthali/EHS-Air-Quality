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
public class TimeSeriesHygieneParser {

	@SuppressWarnings("unchecked")
	private Float getValue(Map attributes, String key) {
		Float value = null;
		try {
			value = Float.parseFloat(((ArrayList<String>) attributes.get(key)).get(0));
		} catch (Exception e) {
		}
		return value;
	}

	@SuppressWarnings("unchecked")
	private Long getValue(List<Object> values) {
		Long value = null;
		try {
			value = ((List<Long>) values.get(0)).get(0);
		} catch (Exception e) {
		}
		return value;
	}

	public Object parseForResponse(List<ResponseObjectCollections> list) {
		List<Object> returnList = new ArrayList<>();
		for (int j = 0; j < list.size(); j++) {
			List<HygieneResponseObject> innerList = list.get(j).getResponseObjects();
			java.util.Map<String, Object> innerMap = new HashMap<>();
			List<Long> timestamps = new ArrayList<>();
			List<Float> humidity = new ArrayList<>();
			List<Float> noise = new ArrayList<>();
			List<Float> temprature = new ArrayList<>();
			for (int i = 0; i < innerList.size(); i++) {
				timestamps.add(innerList.get(i).getTimestamp());
				humidity.add(innerList.get(i).getHumidity());
				noise.add(innerList.get(i).getNoise());
				temprature.add(innerList.get(i).getTemperature());
			}
			innerMap.put("timestamps", timestamps);
			innerMap.put("humidity", humidity);
			innerMap.put("noise", noise);
			innerMap.put("temprature", temprature);
			innerMap.put("name", list.get(j).getName());
			returnList.add(innerMap);
		}
		return returnList;
	}

	public List<ResponseObjectCollections> parse(DatapointsResponse datapointsResponse) {
		List<ResponseObjectCollections> responseObjectCollections = new ArrayList<>();
		try {
			for (int j = 0; j < datapointsResponse.getTags().size(); j++) {
				ResponseObjectCollections responseObjectCollectionsObject = new ResponseObjectCollections();
				Tag tag = datapointsResponse.getTags().get(j);
				List<HygieneResponseObject> list = new ArrayList<HygieneResponseObject>();

				List<Results> results = tag.getResults();
				for (int i = 0; i < results.size(); i++) {

					HygieneResponseObject responseObject = new HygieneResponseObject();

					Map attributes = results.get(i).getAttributes();
					List<Object> values = results.get(i).getValues();

					responseObject.setTemperature(getValue(attributes, "temperature"));
					responseObject.setHumidity(getValue(attributes, "humidity"));
					responseObject.setNoise(getValue(attributes, "noise"));

					responseObject.setTimestamp(getValue(values));
					list.add(responseObject);
				}
				Collections.sort(list, new Comparator<HygieneResponseObject>() {
					public int compare(HygieneResponseObject r1, HygieneResponseObject r2) {
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

	}

	public Collection<Floor> parseFloor(DatapointsResponse datapointsResponse) {
		java.util.Map<String, Floor> floorMap = new HashMap<>();
		try {
			Tag tag = datapointsResponse.getTags().get(0);
			List<Results> results = tag.getResults();
			for (int i = 0; i < results.size(); i++) {
				Map attributes = results.get(i).getAttributes();
				if (attributes.size() > 0) {
					String assetNameStirng = ((ArrayList<String>) attributes.get("assetname")).get(0);
					String floorNoStirng = ((ArrayList<String>) attributes.get("floorNo")).get(0);

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

					HygieneResponseObject responseObject = new HygieneResponseObject();

					List<Object> values = results.get(i).getValues();

					responseObject.setTemperature(getValue(attributes, "temperature"));
					responseObject.setHumidity(getValue(attributes, "humidity"));
					responseObject.setNoise(getValue(attributes, "noise"));
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
		private List<HygieneResponseObject> responseObjects = new ArrayList<>();
		private String name;

		public List<HygieneResponseObject> getResponseObjects() {
			return responseObjects;
		}

		public void setResponseObjects(List<HygieneResponseObject> responseObjects) {
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
	public static class HygieneResponseObject {
		private Float temperature;
		private Float humidity;
		private Float noise;
		private Long timestamp;

		public Long getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(Long timestamp) {
			this.timestamp = timestamp;
		}

		public Float getTemperature() {
			return temperature;
		}

		public void setTemperature(Float temperature) {
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
		private List<HygieneResponseObject> data = new ArrayList<>();

		public String getAssetName() {
			return assetName;
		}

		public void setAssetName(String assetName) {
			this.assetName = assetName;
		}

		public List<HygieneResponseObject> getData() {
			return data;
		}

		public void setData(List<HygieneResponseObject> data) {
			this.data = data;
		}

	}

}
