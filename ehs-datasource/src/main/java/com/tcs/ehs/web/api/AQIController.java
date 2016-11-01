package com.tcs.ehs.web.api;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.tcs.ehs.services.TimeseriesRequester;
import com.tcs.ehs.utils.AqiCalculations;
import com.tcs.ehs.utils.AqiCalculations.Floor;
import com.tcs.ehs.utils.Constants;
import com.tcs.ehs.utils.TimeSeriesAqiParser;
import com.tcs.ehs.utils.TimeUtils;
import com.tcs.ehs.utils.TimeUtils.Value;

@RestController
@RequestMapping("/api/aqi")
public class AQIController {
	@Autowired
	TimeseriesRequester timeseriesRequester;
	@Autowired
	AqiCalculations aqiCalculations;
	@Autowired
	TimeSeriesAqiParser timeSeriesAqiParser;

	@RequestMapping(value = "/demo", method = RequestMethod.GET)
	public ResponseEntity<Object> demo(@RequestHeader("Authorization") String authorization)
			throws JsonProcessingException {
		Long startTime = 1473947660000l;
		Long endTime = 1473947760000l;
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Machine,
				"0", "Heller-Machine", authorization, startTime, endTime);
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, startTime, endTime);
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/machine", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryMahine(@RequestHeader("Authorization") String authorization,
			@RequestParam Long interval) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Machine,
				authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, value.getStartTime(),
				value.getEndTime());
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/machine/{floor}", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryMahineFloor(@RequestHeader("Authorization") String authorization,
			@RequestParam Long interval, @PathVariable String floor) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Machine,
				floor, authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, value.getStartTime(),
				value.getEndTime());
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/machineWithStartTimeEndTime/{floor}", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryMahineFloorWithStartTimeEndTime(
			@RequestHeader("Authorization") String authorization, @RequestParam Long startTime,
			@RequestParam Long endTime, @PathVariable String floor) throws JsonProcessingException {
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Machine,
				floor, authorization, startTime, endTime);
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, startTime, endTime);
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/machine/{floor}/{assetName}", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryMahineFloorAsset(@RequestHeader("Authorization") String authorization,
			@RequestParam Long interval, @PathVariable String floor, @PathVariable String assetName)
			throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Machine,
				floor, assetName, authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, value.getStartTime(),
				value.getEndTime());
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/area", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryArea(@RequestHeader("Authorization") String authorization,
			@RequestParam Long interval) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Area,
				authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, value.getStartTime(),
				value.getEndTime());
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/area/{floor}", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryAreaFloor(@RequestHeader("Authorization") String authorization,
			@RequestParam Long interval, @PathVariable String floor) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Area,
				floor, authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, value.getStartTime(),
				value.getEndTime());
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/areaWithStartTimeEndTime/{floor}", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryAreaFloorWithStartTimeEndTime(
			@RequestHeader("Authorization") String authorization, @RequestParam Long startTime,
			@RequestParam Long endTime, @PathVariable String floor) throws JsonProcessingException {
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Area,
				floor, authorization, startTime, endTime);
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, startTime, endTime);
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

	@RequestMapping(value = "/area/{floor}/{assetName}", method = RequestMethod.GET)
	public ResponseEntity<Object> aqiQueryAreaFloorAsset(@RequestHeader("Authorization") String authorization,
			@RequestParam Long interval, @PathVariable String floor, @PathVariable String assetName)
			throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForAQI(Constants.QueryTagsAQI.AQI_Area,
				floor, assetName, authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = aqiCalculations.calculateAqiFloor(datapointsResponse, value.getStartTime(),
				value.getEndTime());
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}
}
