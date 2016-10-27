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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.tcs.ehs.services.TimeseriesRequester;
import com.tcs.ehs.utils.Constants;
import com.tcs.ehs.utils.HygieneCalculation;
import com.tcs.ehs.utils.TimeSeriesHygieneParser;
import com.tcs.ehs.utils.TimeSeriesHygieneParser.Floor;
import com.tcs.ehs.utils.TimeSeriesWaterParser;
import com.tcs.ehs.utils.TimeUtils;
import com.tcs.ehs.utils.TimeUtils.Value;
import com.tcs.ehs.utils.WaterCalculation;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;

@RestController
@RequestMapping("/api/water")
public class WaterController {
	@Autowired
	TimeseriesRequester timeseriesRequester;
	@Autowired
	TimeSeriesWaterParser timeSeriesWaterParser;
	@Autowired
	WaterCalculation hygieneCalculation;

	@ApiImplicitParams({ @ApiImplicitParam(name = "Authorization", value = "UAA Token along with 'Bearer'", required = true, dataType = "string", paramType = "header"),
			@ApiImplicitParam(name = "interval", value = "It is for calculating the time interval from current time. StartTime = (CURRENT_TIME - interval) and EndTime = CURRENT_TIME", required = true, dataType = "Long - Miliseconds Format", paramType = "query") })
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ResponseEntity<Object> waterQuery(@RequestHeader("Authorization") String authorization, @RequestParam Long interval) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForWater(Constants.QueryTagsWater.Water, authorization, value.getStartTime(), value.getEndTime());
		datapointsResponse.getTags();		
		ObjectMapper mapper = new ObjectMapper();
		String response = mapper.writeValueAsString(datapointsResponse);
		Collection<com.tcs.ehs.utils.TimeSeriesWaterParser.Floor> floors = timeSeriesWaterParser.parseFloor(datapointsResponse);
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>("No Timeseriese data found", HttpStatus.NOT_FOUND);
	}

	/*@RequestMapping(value = "/{floor}", method = RequestMethod.GET)
	public ResponseEntity<Object> hygieneQueryFloor(@RequestHeader("Authorization") String authorization, @RequestParam Long interval, @PathVariable String floor) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForWater(Constants.QueryTagsWater.Water, floor, authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = timeSeriesWaterParser.parseFloor(datapointsResponse);
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>("No Timeseriese data found", HttpStatus.NOT_FOUND);
	}

	@RequestMapping(value = "/{floor}/{assetName}", method = RequestMethod.GET)
	public ResponseEntity<Object> hygieneiQueryFloorAsset(@RequestHeader("Authorization") String authorization, @RequestParam Long interval, @PathVariable String floor, @PathVariable String assetName)
			throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForWater(Constants.QueryTagsWater.Water, floor, assetName, authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = timeSeriesWaterParser.parseFloor(datapointsResponse);
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>("No Timeseriese data found", HttpStatus.NOT_FOUND);
	}

	@RequestMapping(value = "/dashboard/{floor}/{assetName}", method = RequestMethod.GET)
	public ResponseEntity<Object> hygieneiQueryFloorAssetDashBoard(@RequestHeader("Authorization") String authorization, @RequestParam Long interval, @PathVariable String floor,
			@PathVariable String assetName) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForWater(Constants.QueryTagsWater.Water, floor, assetName, authorization, value.getStartTime(), value.getEndTime());
		Collection<Floor> floors = timeSeriesWaterParser.parseFloor(datapointsResponse);
		//floors = hygieneCalculation.getDashBoardValues(floors);
		if (floors.size() > 0) {
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		} else
			return new ResponseEntity<Object>("No Timeseriese data found", HttpStatus.NOT_FOUND);
	}*/

}