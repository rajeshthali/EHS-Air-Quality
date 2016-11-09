package com.tcs.ehs.web.api;

import java.util.Collection;

import org.apache.log4j.Logger;
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
import com.tcs.ehs.utils.CommonResponseObjectCollections;
import com.tcs.ehs.utils.Constants;
import com.tcs.ehs.utils.TimeSeriesEnergyParser;
import com.tcs.ehs.utils.TimeSeriesEnergyParser.Floor;
import com.tcs.ehs.utils.TimeUtils;
import com.tcs.ehs.utils.TimeUtils.Value;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;

@RestController
@RequestMapping("/api/energy")
public class EnergyController {
	private Logger log = Logger.getLogger(WasteController.class);

	@Autowired
	TimeseriesRequester timeseriesRequester;

	@Autowired
	TimeSeriesEnergyParser timeSeriesParser;

	@ApiImplicitParams({ @ApiImplicitParam(name = "Authorization", value = "UAA Token along with 'Bearer'", required = true, dataType = "string", paramType = "header"),
		@ApiImplicitParam(name = "interval", value = "It is for calculating the time interval from current time. StartTime = (CURRENT_TIME - interval) and EndTime = CURRENT_TIME", required = true, dataType = "Long - Miliseconds Format", paramType = "query") })
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ResponseEntity<Object> energyQuery(@RequestHeader("Authorization") String authorization, @RequestParam Long interval) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForEnergy(Constants.QueryTagsEnergy.Energy, authorization, value.getStartTime(), value.getEndTime());
		datapointsResponse.getTags();		
		ObjectMapper mapper = new ObjectMapper();
		String response = mapper.writeValueAsString(datapointsResponse);
		log.info("Waste response -----"+response);
		Collection<CommonResponseObjectCollections> responseObjectCollectionsList = timeSeriesParser.parseTimeSeriesResponse(datapointsResponse);
		Collection<Floor> floors = timeSeriesParser.convertToEnergyData(responseObjectCollectionsList);		
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>("No Timeseriese data found", HttpStatus.NOT_FOUND);
	}

	@ApiImplicitParams({ @ApiImplicitParam(name = "Authorization", value = "UAA Token along with 'Bearer'", required = true, dataType = "string", paramType = "header"),
		@ApiImplicitParam(name = "interval", value = "It is for calculating the time interval from current time. StartTime = (CURRENT_TIME - interval) and EndTime = CURRENT_TIME", required = true, dataType = "Long - Miliseconds Format", paramType = "query") })
	@RequestMapping(value = "/{floor}", method = RequestMethod.GET)
	public ResponseEntity<Object> energyQueryFloor(@RequestHeader("Authorization") String authorization, @RequestParam Long interval,@PathVariable String floor) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		DatapointsResponse datapointsResponse = timeseriesRequester.requestForEnergy(Constants.QueryTagsEnergy.Energy, floor, authorization, value.getStartTime(), value.getEndTime());
		datapointsResponse.getTags();		
		ObjectMapper mapper = new ObjectMapper();
		String response = mapper.writeValueAsString(datapointsResponse);
		log.info("Waste response -----"+response);
		Collection<CommonResponseObjectCollections> responseObjectCollectionsList = timeSeriesParser.parseTimeSeriesResponse(datapointsResponse);
		Collection<Floor> floors = timeSeriesParser.convertToEnergyData(responseObjectCollectionsList);		
		if (floors.size() > 0)
			return new ResponseEntity<Object>(floors, HttpStatus.OK);
		else
			return new ResponseEntity<Object>("No Timeseriese data found", HttpStatus.NOT_FOUND);
	}

}
