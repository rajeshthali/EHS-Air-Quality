package com.tcs.ehs.web.api;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Results;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Tag;
import com.tcs.ehs.services.SensorDataService;
import com.tcs.ehs.utils.SensorDataResponse;
import com.tcs.ehs.utils.SensorDataValues;
import com.tcs.ehs.utils.TimeSeriesWaterParser.ResponseObjectCollections;
import com.tcs.ehs.utils.TimeUtils;
import com.tcs.ehs.utils.TimeUtils.Value;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;

@RestController
@RequestMapping("/api/sensorData")
public class SensorDataController {

	private Logger log = Logger.getLogger(SensorDataController.class);
	@Autowired
	SensorDataService sensorDataService;

	@ApiImplicitParams({
			@ApiImplicitParam(name = "Authorization", value = "UAA Token along with 'Bearer'", required = true, dataType = "string", paramType = "header"),
			@ApiImplicitParam(name = "interval", value = "It is for calculating the time interval from current time. StartTime = (CURRENT_TIME - interval) and EndTime = CURRENT_TIME", required = true, dataType = "Long - Miliseconds Format", paramType = "query") })
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ResponseEntity<Object> getSensorData(@RequestHeader("Authorization") String authorization,
			@RequestParam Long interval) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		List<String> tagNames = Arrays.asList("Temperature:MY-APPENDER-VINAYAK","PB:MY-APPENDER-VINAYAK","O3:MY-APPENDER-VINAYAK","CO2:MY-APPENDER-VINAYAK","PM2_5:MY-APPENDER-VINAYAK","NH3:MY-APPENDER-VINAYAK","PM10:MY-APPENDER-VINAYAK","SO2:MY-APPENDER-VINAYAK");
		DatapointsResponse datapointsResponse = sensorDataService.getSensorData(tagNames, authorization, value.getStartTime(), value.getEndTime());
		datapointsResponse.getTags();		
		ObjectMapper mapper = new ObjectMapper();
		String response = mapper.writeValueAsString(datapointsResponse);
		log.info("Sensor data response -----"+response);
		List<SensorDataResponse> sensorDataResponseList = parseSensorData(datapointsResponse);
		if (sensorDataResponseList.size() > 0)
			return new ResponseEntity<Object>(sensorDataResponseList, HttpStatus.OK);
		else
			return new ResponseEntity<Object>("No Timeseriese data found", HttpStatus.NOT_FOUND);
	}

	private List<SensorDataResponse> parseSensorData(DatapointsResponse datapointsResponse) {
		List<SensorDataResponse> responseList = new ArrayList<SensorDataResponse>();
		List<Tag> tags = datapointsResponse.getTags();
		//List<Results> results = tag.getResults();
		for(Tag eachTag : tags) {
			SensorDataResponse sensorDataResponse =  new SensorDataResponse();
			sensorDataResponse.setName(eachTag.getName());
			Results result = eachTag.getResults().get(0);
			List<Object> sensorValues = result.getValues();
			List<SensorDataValues> sensorDataValuesList = new ArrayList<SensorDataValues>();
			for(Object obj : sensorValues) {
				SensorDataValues sensorDataValues =  new SensorDataValues();
				sensorDataValues.setSensorValue(((List<Integer>)obj).get(1));
				sensorDataValues.setTimeStamp(((List<Long>)obj).get(0));
				sensorDataValues.setDataQuality(((List<Integer>)obj).get(2));
				sensorDataValuesList.add(sensorDataValues);
			}
			sensorDataResponse.setSensorDataValues(sensorDataValuesList);
			responseList.add(sensorDataResponse);
		}
		
		return responseList;
	}

}
