package com.tcs.ehs.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Component;

import com.tcs.ehs.utils.TimeSeriesHygieneParser.Floor;
import com.tcs.ehs.utils.TimeSeriesHygieneParser.FloorAsset;
import com.tcs.ehs.utils.TimeSeriesHygieneParser.HygieneResponseObject;
import com.tcs.ehs.utils.TimeSeriesWaterParser.WaterResponseObject;

@Component
public class WaterCalculation {
	public static class Water {
		private Float value;
		private Constants.Hygiene name;

		public Float getValue() {
			return value;
		}

		public void setValue(Float value) {
			this.value = value;
		}

		public Constants.Hygiene getName() {
			return name;
		}

		public void setName(Constants.Hygiene name) {
			this.name = name;
		}

	}

	public class GraphValues {
		private Constants.Water name;
		private List<Float> values = new ArrayList<>();

		public Constants.Water getName() {
			return name;
		}

		public void setName(Constants.Water name) {
			this.name = name;
		}

		public List<Float> getValues() {
			return values;
		}

		public void setValues(List<Float> values) {
			this.values = values;
		}

	}

	public static class OverallWaterResponse {

	}

	/*public Collection<Floor> getDashBoardValues(Collection<Floor> floors) {
		for (Floor floor : floors) {
			for (FloorAsset floorAsset : floor.getAssets()) {
				floorAsset.setData(calculateAverage(floorAsset.getData()));
			}
		}
		return floors;
	}*/

	/*public List<WaterResponseObject> calculateAverage(List<WaterResponseObject> list) {
		WaterResponseObject rObject = new WaterResponseObject();
		Float sumT = 0f;
		Float sumH = 0f;
		Float sumN = 0f;
		for (WaterResponseObject data : list) {
			sumT += data.getpHValue();
			sumH += data.getHumidity();
			sumN += data.getNoise();
		}

		rObject.setpHValue((float) (sumT / (float) list.size()));
		rObject.setHumidity((float) (sumH / (float) list.size()));
		rObject.setNoise((float) (sumN / (float) list.size()));

		list = new ArrayList<>();
		list.add(rObject);
		return list;
	}*/
}
