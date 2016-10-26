package com.tcs.ehs.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Component;

import com.tcs.ehs.utils.TimeSeriesHygieneParser.Floor;
import com.tcs.ehs.utils.TimeSeriesHygieneParser.FloorAsset;
import com.tcs.ehs.utils.TimeSeriesHygieneParser.HygieneResponseObject;

@Component
public class HygieneCalculation {
	public static class Hygiene {
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
		private Constants.Hygiene name;
		private List<Float> values = new ArrayList<>();

		public Constants.Hygiene getName() {
			return name;
		}

		public void setName(Constants.Hygiene name) {
			this.name = name;
		}

		public List<Float> getValues() {
			return values;
		}

		public void setValues(List<Float> values) {
			this.values = values;
		}

	}

	public static class OverallHygieneResponse {

	}

	public Collection<Floor> getDashBoardValues(Collection<Floor> floors) {
		for (Floor floor : floors) {
			for (FloorAsset floorAsset : floor.getAssets()) {
				floorAsset.setData(calculateAverage(floorAsset.getData()));
			}
		}
		return floors;
	}

	public List<HygieneResponseObject> calculateAverage(List<HygieneResponseObject> list) {
		HygieneResponseObject rObject = new HygieneResponseObject();
		Float sumT = 0f;
		Float sumH = 0f;
		Float sumN = 0f;
		for (HygieneResponseObject data : list) {
			sumT += data.getTemperature();
			sumH += data.getHumidity();
			sumN += data.getNoise();
		}

		rObject.setTemperature((float) (sumT / (float) list.size()));
		rObject.setHumidity((float) (sumH / (float) list.size()));
		rObject.setNoise((float) (sumN / (float) list.size()));

		list = new ArrayList<>();
		list.add(rObject);
		return list;
	}
}
