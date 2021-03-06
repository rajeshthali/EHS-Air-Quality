package com.tcs.ehs.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Results;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Tag;
import com.ge.predix.entity.util.map.Map;
import com.tcs.ehs.utils.AqiCalculations.Floor;
import com.tcs.ehs.utils.AqiCalculations.FloorAsset;
import com.tcs.ehs.utils.AqiCalculations.GraphValues;
import com.tcs.ehs.utils.AqiCalculations.OverallAqiResponse;
import com.tcs.ehs.utils.TimeSeriesAqiParser.ResponseObject;
import com.tcs.ehs.utils.TimeSeriesHygieneParser.HygieneResponseObject;

@Component
public class TimeSeriesAqiParser extends CommonTimeSeriesParser{
	@Autowired
	AqiCalculations aqiCalculations;

	private Float getValue(Map attributes, String key) {
		Float value = null;
		try {
			value = Float.parseFloat(((ArrayList<String>) attributes.get(key)).get(0));
		} catch (Exception e) {
		}
		return value;
	}

	private Long getValue(List<Object> values) {
		Long value = null;
		try {
			value = ((List<Long>) values.get(0)).get(0);
		} catch (Exception e) {
		}
		return value;
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

					ResponseObject responseObject = new ResponseObject();

					List<Object> values = results.get(i).getValues();

					responseObject.setNO2(getValue(attributes, "NO2"));
					responseObject.setPM2_5(getValue(attributes, "PM2_5"));
					responseObject.setPB(getValue(attributes, "PB"));
					responseObject.setO3(getValue(attributes, "O3"));
					responseObject.setCO2(getValue(attributes, "CO2"));
					responseObject.setSO2(getValue(attributes, "SO2"));
					responseObject.setNH3(getValue(attributes, "NH3"));
					responseObject.setPM10(getValue(attributes, "PM10"));
					responseObject.setTimestamp(getValue(values));
					floorAsset.getResponseObjectList().add(responseObject);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return floorMap.values();
	}

	public List<ResponseObject> parse(DatapointsResponse datapointsResponse) {

		List<ResponseObject> list = new ArrayList<ResponseObject>();
		try {
			Tag tag = datapointsResponse.getTags().get(0);
			List<Results> results = tag.getResults();
			for (int i = 0; i < results.size(); i++) {

				ResponseObject responseObject = new ResponseObject();

				Map attributes = results.get(i).getAttributes();
				List<Object> values = results.get(i).getValues();

				responseObject.setNO2(getValue(attributes, "NO2"));
				responseObject.setPM2_5(getValue(attributes, "PM2_5"));
				responseObject.setPB(getValue(attributes, "PB"));
				responseObject.setO3(getValue(attributes, "O3"));
				responseObject.setCO2(getValue(attributes, "CO2"));
				responseObject.setSO2(getValue(attributes, "SO2"));
				responseObject.setNH3(getValue(attributes, "NH3"));
				responseObject.setPM10(getValue(attributes, "PM10"));

				responseObject.setTimestamp(getValue(values));
				list.add(responseObject);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		Collections.sort(list, new Comparator<ResponseObject>() {
			public int compare(ResponseObject r1, ResponseObject r2) {
				return (int) (r1.getTimestamp() - r2.getTimestamp());
			}
		});
		return list;

	}

	public List<AqiResponseObjectCollections> parseFromMultipleTags(DatapointsResponse datapointsResponse) {
		List<AqiResponseObjectCollections> responseObjectCollections = new ArrayList<>();
		try {
			for (int j = 0; j < datapointsResponse.getTags().size(); j++) {
				AqiResponseObjectCollections responseObjectCollectionsObject = new AqiResponseObjectCollections();
				Tag tag = datapointsResponse.getTags().get(j);
				List<ResponseObject> list = new ArrayList<ResponseObject>();

				List<Results> results = tag.getResults();
				for (int i = 0; i < results.size(); i++) {

					ResponseObject responseObject = new ResponseObject();

					Map attributes = results.get(i).getAttributes();
					List<Object> values = results.get(i).getValues();

					responseObject.setNO2(getValue(attributes, "NO2"));
					responseObject.setPM2_5(getValue(attributes, "PM2_5"));
					responseObject.setPB(getValue(attributes, "PB"));
					responseObject.setO3(getValue(attributes, "O3"));
					responseObject.setCO2(getValue(attributes, "CO2"));
					responseObject.setSO2(getValue(attributes, "SO2"));
					responseObject.setNH3(getValue(attributes, "NH3"));
					responseObject.setPM10(getValue(attributes, "PM10"));

					responseObject.setTimestamp(getValue(values));
					list.add(responseObject);

				}

				Collections.sort(list, new Comparator<ResponseObject>() {
					public int compare(ResponseObject r1, ResponseObject r2) {
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

	public class AqiResponseObjectCollections {
		private List<ResponseObject> responseObjects = new ArrayList<>();
		private String name;

		public List<ResponseObject> getResponseObjects() {
			return responseObjects;
		}

		public void setResponseObjects(List<ResponseObject> responseObjects) {
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
	public class ResponseObject {
		private Long timestamp;
		private Float NO2;
		private Float PM2_5;
		private Float PB;
		private Float O3;
		private Float CO2;
		private Float SO2;
		private Float NH3;
		private Float PM10;

		public Long getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(Long timestamp) {
			this.timestamp = timestamp;
		}

		public Float getNO2() {
			return NO2;
		}

		public void setNO2(Float nO2) {
			NO2 = nO2;
		}

		public Float getPM2_5() {
			return PM2_5;
		}

		public void setPM2_5(Float pM2_5) {
			PM2_5 = pM2_5;
		}

		public Float getSO2() {
			return SO2;
		}

		public void setSO2(Float sO2) {
			SO2 = sO2;
		}

		public Float getPB() {
			return PB;
		}

		public void setPB(Float pB) {
			PB = pB;
		}

		public Float getO3() {
			return O3;
		}

		public void setO3(Float o3) {
			O3 = o3;
		}

		public Float getCO2() {
			return CO2;
		}

		public void setCO2(Float cO2) {
			CO2 = cO2;
		}

		public Float getNH3() {
			return NH3;
		}

		public void setNH3(Float nH3) {
			NH3 = nH3;
		}

		public Float getPM10() {
			return PM10;
		}

		public void setPM10(Float pM10) {
			PM10 = pM10;
		}

	}

	public List<OverallAqiResponse> parseForResponse(List<AqiResponseObjectCollections> list, Long startTime, Long endTime) {
		List<OverallAqiResponse> returnList = new ArrayList<>();
		for (int j = 0; j < list.size(); j++) {
			OverallAqiResponse calculateAqiMachine = aqiCalculations.calculateAqi(list.get(j).getResponseObjects(), startTime, endTime);
			List<java.util.Map<String, Object>> attributes = new ArrayList<>();
			try {
				for (int i = 0; i < calculateAqiMachine.getSeperatedResult().size(); i++) {
					GraphValues graphValues = calculateAqiMachine.getSeperatedResult().get(i);
					java.util.Map<String, Object> map = new HashMap<String, Object>();
					Float maxValue = Collections.max(graphValues.getValues(), new FloatComparator());
					map.put(graphValues.getName().toString(), maxValue);
					attributes.add(map);
				}
			} catch (Exception e) {
			}
			calculateAqiMachine.setAttributes(attributes);

			// for the dash board we do not need the seperatedResult (its for
			// plotting graphs), values and timestamps
			calculateAqiMachine.setSeperatedResult(new ArrayList<>());
			calculateAqiMachine.setValue(new ArrayList<>());
			calculateAqiMachine.setTimestamps(new ArrayList<>());

			returnList.add(calculateAqiMachine);
		}
		return returnList;
	}
	
	
	public Collection<Floor> convertToAqiData(Collection<CommonResponseObjectCollections> list) {
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
				List<ResponseObject> aqiList = new ArrayList<>();
				java.util.Map<Long, ResponseObject> aqiMap = new TreeMap<>();
				ResponseObject aqiObject = null;
				for(CommonResponseObject commonResponseObject : commonResponseObjectList) {
					
					if(aqiMap.get(commonResponseObject.getTimestamp()) == null) {
						aqiObject = new ResponseObject();
						aqiObject.setTimestamp(commonResponseObject.getTimestamp());
						aqiMap.put(commonResponseObject.getTimestamp(), aqiObject);
					}else{
						aqiObject = aqiMap.get(commonResponseObject.getTimestamp());
					}
					if("PM10".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setPM10(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("O3".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setO3(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("CO".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setCO2(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("PB".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setPB(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("NH3".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setNH3(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("PM2_5".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setPM2_5(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("NO2".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setNO2(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}else if("SO2".equalsIgnoreCase(commonResponseObject.getProperyName())) {
						aqiObject.setSO2(Float.valueOf(commonResponseObject.getPropertyValue().toString()));
					}
				}
				
				for(ResponseObject obj : aqiMap.values()) {
					aqiList.add(obj);
				}
				
				floorAsset.setResponseObjectList(aqiList);
				}
		}
		return floorMap.values();
	}

	static class FloatComparator implements Comparator<Float> {
		@Override
		public int compare(Float f1, Float f2) {
			return (int) (f1 * 1000f - f2 * 1000f);
		}
	}
}
