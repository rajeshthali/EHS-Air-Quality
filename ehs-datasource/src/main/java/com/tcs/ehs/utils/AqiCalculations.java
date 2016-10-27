package com.tcs.ehs.utils;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.tcs.ehs.utils.TimeSeriesAqiParser.ResponseObject;

@Component
public class AqiCalculations {

	@Autowired
	TimeSeriesAqiParser timeSeriesAqiParser;

	public Collection<Floor> calculateAqiFloor(DatapointsResponse datapointsResponse, Long startTime, Long endTime) {
		Collection<Floor> floors = timeSeriesAqiParser.parseFloor(datapointsResponse);
		for (Floor floor : floors) {
			for (FloorAsset floorAsset : floor.getAssets()) {
				floorAsset.setData(calculateAqi(floorAsset.getResponseObjectList(), startTime, endTime));
			}
		}
		return floors;
	}

	public OverallAqiResponse calculateAqi(List<ResponseObject> list, Long startTime, Long endTime) {
		OverallAqiResponse overallAqiResponse = new OverallAqiResponse();
		overallAqiResponse.setStartTime(startTime);
		overallAqiResponse.setEndTime(endTime);
		List<AQI> maxAqiValues = new ArrayList<>();
		List<AQI> minAqiValues = new ArrayList<>();

		ArrayList<AQI> NO2 = new ArrayList<>();
		ArrayList<AQI> SO2 = new ArrayList<>();
		ArrayList<AQI> PM2_5 = new ArrayList<>();

		ArrayList<AQI> O3 = new ArrayList<>();
		ArrayList<AQI> NH3 = new ArrayList<>();
		ArrayList<AQI> PB = new ArrayList<>();
		ArrayList<AQI> CO2 = new ArrayList<>();
		ArrayList<AQI> PM10 = new ArrayList<>();

		boolean isNO2Available = true;
		boolean isSO2Available = true;
		boolean isPM2_5Available = true;
		boolean isO3Available = true;
		boolean isNH3Available = true;
		boolean isPBAvailable = true;
		boolean isCO2Available = true;
		boolean isPM10Available = true;

		List<Long> timestamps = new ArrayList<>();
		for (int i = 0; i < list.size(); i++) {
			ResponseObject responseObject = list.get(i);
			ArrayList<AQI> values = new ArrayList<>();

			if (responseObject.getNO2() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getNO2(), Constants.Parameter.NO2));
				NO2.add(aqiValue);
				values.add(aqiValue);
			} else {
				isNO2Available = false;
			}
			if (responseObject.getNO2() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getSO2(), Constants.Parameter.SO2));
				SO2.add(aqiValue);
				values.add(aqiValue);
			} else {
				isSO2Available = false;
			}

			if (responseObject.getNO2() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getPM2_5(), Constants.Parameter.PM2_5));
				PM2_5.add(aqiValue);
				values.add(aqiValue);
			} else {
				isPM2_5Available = false;
			}

			if (responseObject.getO3() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getO3(), Constants.Parameter.O3));
				O3.add(aqiValue);
				values.add(aqiValue);
			} else {
				isO3Available = false;
			}

			if (responseObject.getNH3() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getNH3(), Constants.Parameter.NH3));
				NH3.add(aqiValue);
				values.add(aqiValue);
			} else {
				isNH3Available = false;
			}

			if (responseObject.getPB() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getPB(), Constants.Parameter.PB));
				PB.add(aqiValue);
				values.add(aqiValue);
			} else {
				isPBAvailable = false;
			}

			if (responseObject.getCO2() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getCO2(), Constants.Parameter.CO2));
				CO2.add(aqiValue);
				values.add(aqiValue);
			} else {
				isCO2Available = false;
			}

			if (responseObject.getPM10() != null) {
				AQI aqiValue = getAQIValue(getAQIValueObject(responseObject.getPM10(), Constants.Parameter.PM10));
				PM10.add(aqiValue);
				values.add(aqiValue);
			} else {
				isPM10Available = false;
			}
			try {
				AQI maxAqi = Collections.max(values, new AQIComparator());
				maxAqiValues.add(maxAqi);
			} catch (Exception e) {

			}

			try {
				AQI minAqi = Collections.min(values, new AQIComparator());
				minAqiValues.add(minAqi);
			} catch (Exception e) {

			}

			timestamps.add(responseObject.getTimestamp());
		}

		overallAqiResponse.setTimestamps(timestamps);

		GraphValues gv = null;
		if (isNO2Available) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.NO2);
			gv.setValues(getGraphValueList(NO2));
			overallAqiResponse.getSeperatedResult().add(gv);
		}
		if (isSO2Available) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.SO2);
			gv.setValues(getGraphValueList(SO2));
			overallAqiResponse.getSeperatedResult().add(gv);
		}
		if (isPM2_5Available) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.PM2_5);
			gv.setValues(getGraphValueList(PM2_5));
			overallAqiResponse.getSeperatedResult().add(gv);
		}

		if (isO3Available) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.O3);
			gv.setValues(getGraphValueList(O3));
			overallAqiResponse.getSeperatedResult().add(gv);
		}
		if (isNH3Available) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.NH3);
			gv.setValues(getGraphValueList(NH3));
			overallAqiResponse.getSeperatedResult().add(gv);
		}

		if (isPBAvailable) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.PB);
			gv.setValues(getGraphValueList(PB));
			overallAqiResponse.getSeperatedResult().add(gv);
		}

		if (isCO2Available) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.CO2);
			gv.setValues(getGraphValueList(CO2));
			overallAqiResponse.getSeperatedResult().add(gv);
		}

		if (isPM10Available) {
			gv = new GraphValues();
			gv.setName(Constants.Parameter.PM10);
			gv.setValues(getGraphValueList(PM10));
			overallAqiResponse.getSeperatedResult().add(gv);
		}

		try {
			AQI maxAqiGlobal = Collections.max(maxAqiValues, new AQIComparator());
			overallAqiResponse.setMaxAqi(maxAqiGlobal);
		} catch (Exception e) {
		}

		try {
			AQI minAqiGlobal = Collections.min(minAqiValues, new AQIComparator());
			overallAqiResponse.setMinAqi(minAqiGlobal);
		} catch (Exception e) {
		}

		overallAqiResponse.setValue(getGraphValueList(maxAqiValues));

		return overallAqiResponse;
	}

	private List<Float> getGraphValueList(List<AQI> aqiList) {
		List<Float> graphPoints = new ArrayList<>();
		for (int i = 0; i < aqiList.size(); i++) {
			graphPoints.add(aqiList.get(i).getAqiValue());
		}
		return graphPoints;
	}

	private class AQIComparator implements Comparator<AQI> {
		@Override
		public int compare(AQI o1, AQI o2) {
			return (int) (o1.getAqiValue() * 1000f - o2.getAqiValue() * 1000f);
		}
	}

	public class GraphValues {
		private Constants.Parameter name;
		private List<Float> values = new ArrayList<>();

		public Constants.Parameter getName() {
			return name;
		}

		public void setName(Constants.Parameter name) {
			this.name = name;
		}

		public List<Float> getValues() {
			return values;
		}

		public void setValues(List<Float> values) {
			this.values = values;
		}

	}

	public static class Floor {
		@JsonIgnore
		private Map<String, FloorAsset> assetsMap = new HashMap<>();
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

		public Map<String, FloorAsset> getAssetsMap() {
			return assetsMap;
		}

		public void setAssetsMap(Map<String, FloorAsset> assetsMap) {
			this.assetsMap = assetsMap;
		}

	}

	public static class FloorAsset {
		private String assetName;
		@JsonIgnore
		private List<ResponseObject> responseObjectList = new ArrayList<>();
		private OverallAqiResponse data;

		public OverallAqiResponse getData() {
			return data;
		}

		public void setData(OverallAqiResponse data) {
			this.data = data;
		}

		public String getAssetName() {
			return assetName;
		}

		public void setAssetName(String assetName) {
			this.assetName = assetName;
		}

		public List<ResponseObject> getResponseObjectList() {
			return responseObjectList;
		}

		public void setResponseObjectList(List<ResponseObject> responseObjectList) {
			this.responseObjectList = responseObjectList;
		}

	}

	public class OverallAqiResponse {
		private AQI maxAqi = new AQI();
		private AQI minAqi = new AQI();
		private List<Float> value = new ArrayList<>();
		private List<GraphValues> seperatedResult = new ArrayList<>();
		private List<Long> timestamps = new ArrayList<>();
		private Long startTime;
		private Long endTime;

		private Object attributes;

		public Object getAttributes() {
			return attributes;
		}

		public void setAttributes(Object attributes) {
			this.attributes = attributes;
		}

		public List<Long> getTimestamps() {
			return timestamps;
		}

		public void setTimestamps(List<Long> timestamps) {
			this.timestamps = timestamps;
		}

		public AQI getMaxAqi() {
			return maxAqi;
		}

		public void setMaxAqi(AQI maxAqi) {
			this.maxAqi = maxAqi;
		}

		public AQI getMinAqi() {
			return minAqi;
		}

		public void setMinAqi(AQI minAqi) {
			this.minAqi = minAqi;
		}

		public List<Float> getValue() {
			return value;
		}

		public void setValue(List<Float> value) {
			this.value = value;
		}

		public List<GraphValues> getSeperatedResult() {
			return seperatedResult;
		}

		public void setSeperatedResult(List<GraphValues> seperatedResult) {
			this.seperatedResult = seperatedResult;
		}

		public Long getStartTime() {
			return startTime;
		}

		public void setStartTime(Long startTime) {
			this.startTime = startTime;
		}

		public Long getEndTime() {
			return endTime;
		}

		public void setEndTime(Long endTime) {
			this.endTime = endTime;
		}

	}

	public class AQI {
		private Float aqiValue = 0f;
		private Constants.Parameter name;

		public Float getAqiValue() {
			return aqiValue;
		}

		public void setAqiValue(Float aqiValue) {
			this.aqiValue = aqiValue;
		}

		public Constants.Parameter getName() {
			return name;
		}

		public void setName(Constants.Parameter name) {
			this.name = name;
		}

	}

	public AQI getAQIValue(AQIValue p) {

		AQI aqi = new AQI();
		Float IHI = p.I_HI;
		Float ILO = p.I_LO;
		Float BHI = p.B_HI;
		Float BLO = p.B_LO;
		Float Cp = p.value;
		// Ip= [{(IHI - ILO)/ (BHI -BLO)} * (Cp-BLO)] + ILO
		Float Lp = (((IHI - ILO) / (BHI - BLO)) * (Cp - BLO)) + ILO;
		DecimalFormat df = new DecimalFormat("#.00");
		aqi.setAqiValue(Float.valueOf(df.format(Lp)));
		aqi.setName(p.getName());

		return aqi;
	}

	public AQIValue getAQIValueObject(Float avg, Constants.Parameter name) {
		AQIValue aqiValue = new AQIValue();
		aqiValue.setName(name);
		aqiValue.setValue(avg);
		switch (name) {
		case PM10:
			if (avg >= 0 && avg <= 50) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 50f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;

			} else if (avg >= 51 && avg <= 100) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 51f;
				aqiValue.B_HI = 100f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg >= 101 && avg <= 250) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 101f;
				aqiValue.B_HI = 250f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg >= 251 && avg <= 350) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 251f;
				aqiValue.B_HI = 350f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg >= 351 && avg <= 430) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 351f;
				aqiValue.B_HI = 430f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 430) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 430f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}

			break;
		case PM2_5:
			if (avg >= 0 && avg <= 30) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 30f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;
			} else if (avg >= 31 && avg <= 60) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 31f;
				aqiValue.B_HI = 60f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg >= 61 && avg <= 90) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 61f;
				aqiValue.B_HI = 90f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg >= 91 && avg <= 120) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 91f;
				aqiValue.B_HI = 120f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg >= 121 && avg <= 250) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 121f;
				aqiValue.B_HI = 250f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 250) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 430f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}
			break;
		case NO2:
			if (avg >= 0 && avg <= 40) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 40f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;
			} else if (avg >= 41 && avg <= 80) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 41f;
				aqiValue.B_HI = 80f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg >= 81 && avg <= 180) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 81f;
				aqiValue.B_HI = 180f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg >= 181 && avg <= 280) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 181f;
				aqiValue.B_HI = 280f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg >= 281 && avg <= 400) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 281f;
				aqiValue.B_HI = 400f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 400) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 400f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}
			break;
		case O3:
			if (avg >= 0 && avg <= 50) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 50f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;
			} else if (avg >= 51 && avg <= 100) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 51f;
				aqiValue.B_HI = 100f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg >= 101 && avg <= 168) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 101f;
				aqiValue.B_HI = 168f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg >= 169 && avg <= 208) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 169f;
				aqiValue.B_HI = 208f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg >= 209 && avg <= 748) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 209f;
				aqiValue.B_HI = 748f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 748) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 748f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}
			break;
		case CO2:
			if (avg >= 0 && avg <= 1.0) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 1.0f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;
			} else if (avg > 1.0 && avg <= 2.0) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 1.1f;
				aqiValue.B_HI = 2.0f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg > 2.0 && avg <= 10) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 2.1f;
				aqiValue.B_HI = 10f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg > 10 && avg <= 17) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 10.1f;
				aqiValue.B_HI = 17f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg > 17 && avg <= 34) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 17.1f;
				aqiValue.B_HI = 34f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 34) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 748f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}
			break;
		case SO2:
			if (avg >= 0 && avg <= 40) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 40f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;
			} else if (avg >= 41 && avg <= 80) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 41f;
				aqiValue.B_HI = 80f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg >= 81 && avg <= 380) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 81f;
				aqiValue.B_HI = 380f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg >= 381 && avg <= 800) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 381f;
				aqiValue.B_HI = 800f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg >= 801 && avg <= 1600) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 209f;
				aqiValue.B_HI = 748f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 1600) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 1600f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}
			break;
		case NH3:
			if (avg >= 0 && avg <= 200) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 200f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;
			} else if (avg >= 201 && avg <= 400) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 201f;
				aqiValue.B_HI = 400f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg >= 401 && avg <= 800) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 401f;
				aqiValue.B_HI = 800f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg >= 801 && avg <= 1200) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 801f;
				aqiValue.B_HI = 1200f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg >= 1201 && avg <= 1800) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 1201f;
				aqiValue.B_HI = 1800f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 1800) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 1800f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}
			break;
		case PB:
			// console.log(avg);
			if (avg >= 0 && avg <= 0.5) {
				aqiValue.range = Constants.Range.GOOD;
				aqiValue.B_LO = 0f;
				aqiValue.B_HI = 0.5f;
				aqiValue.I_LO = 0f;
				aqiValue.I_HI = 50f;
			} else if (avg > 0.5 && avg <= 1.0) {
				aqiValue.range = Constants.Range.SATISFACTORY;
				aqiValue.B_LO = 0.6f;
				aqiValue.B_HI = 1.0f;
				aqiValue.I_LO = 51f;
				aqiValue.I_HI = 100f;
			} else if (avg > 1.0 && avg <= 2.0) {
				aqiValue.range = Constants.Range.MODERATE;
				aqiValue.B_LO = 1.1f;
				aqiValue.B_HI = 2.0f;
				aqiValue.I_LO = 101f;
				aqiValue.I_HI = 200f;
			} else if (avg > 2.0 && avg <= 3.0) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 2.1f;
				aqiValue.B_HI = 3.0f;
				aqiValue.I_LO = 201f;
				aqiValue.I_HI = 300f;
			} else if (avg > 3.0 && avg <= 3.5) {
				aqiValue.range = Constants.Range.POOR;
				aqiValue.B_LO = 3.1f;
				aqiValue.B_HI = 3.5f;
				aqiValue.I_LO = 301f;
				aqiValue.I_HI = 400f;
			} else if (avg > 3.5) {
				aqiValue.range = Constants.Range.SEVERE;
				aqiValue.B_LO = 1800f;
				aqiValue.B_HI = 0f;
				aqiValue.I_LO = 401f;
				aqiValue.I_HI = 500f;
			}
			// console.log(aqiValue);
			break;

		default:
			break;
		}

		return aqiValue;
	}
}
