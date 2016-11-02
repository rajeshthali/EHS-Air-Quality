package com.tcs.ehs.web.api;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
	@RequestMapping(value = "/{floor}", method = RequestMethod.GET)
	public ResponseEntity<Object> getSensorData(@RequestHeader("Authorization") String authorization, @RequestParam Long interval, @PathVariable String floor) throws JsonProcessingException {
		Value value = TimeUtils.calculateInterval(interval);
		authorization = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiJjYjRjMDUxYzdkNDE0MTEyYWE4ZjNlYzNjYTdmOGQ5YiIsInN1YiI6ImVocy1jbGllbnQiLCJzY29wZSI6WyJ0aW1lc2VyaWVzLnpvbmVzLjM5NTdmM2NkLWZkNmUtNDU0OC1iNWRiLTgwM2RlNDliMGQzYS5pbmdlc3QiLCJ1YWEucmVzb3VyY2UiLCJvcGVuaWQiLCJ1YWEubm9uZSIsInRpbWVzZXJpZXMuem9uZXMuMzk1N2YzY2QtZmQ2ZS00NTQ4LWI1ZGItODAzZGU0OWIwZDNhLnVzZXIiLCJ0aW1lc2VyaWVzLnpvbmVzLjdlMmFjMGZhLTJhNzAtNDI0NC1hYTlhLTY0ZGQ3OWM4ZTQ3Ni5xdWVyeSIsInRpbWVzZXJpZXMuem9uZXMuN2UyYWMwZmEtMmE3MC00MjQ0LWFhOWEtNjRkZDc5YzhlNDc2LmluZ2VzdCIsInRpbWVzZXJpZXMuem9uZXMuN2UyYWMwZmEtMmE3MC00MjQ0LWFhOWEtNjRkZDc5YzhlNDc2LnVzZXIiLCJ0aW1lc2VyaWVzLnpvbmVzLjM5NTdmM2NkLWZkNmUtNDU0OC1iNWRiLTgwM2RlNDliMGQzYS5xdWVyeSJdLCJjbGllbnRfaWQiOiJlaHMtY2xpZW50IiwiY2lkIjoiZWhzLWNsaWVudCIsImF6cCI6ImVocy1jbGllbnQiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjQ4OWQzZTRiIiwiaWF0IjoxNDc4MDgyOTY1LCJleHAiOjE0NzgxMjYxNjUsImlzcyI6Imh0dHBzOi8vNzJiNmRjNjUtZjE2ZC00MGJiLTliNzUtN2UyZGNkMDM2ZGQ3LnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNzJiNmRjNjUtZjE2ZC00MGJiLTliNzUtN2UyZGNkMDM2ZGQ3IiwiYXVkIjpbImVocy1jbGllbnQiLCJ0aW1lc2VyaWVzLnpvbmVzLjM5NTdmM2NkLWZkNmUtNDU0OC1iNWRiLTgwM2RlNDliMGQzYSIsInVhYSIsIm9wZW5pZCIsInRpbWVzZXJpZXMuem9uZXMuN2UyYWMwZmEtMmE3MC00MjQ0LWFhOWEtNjRkZDc5YzhlNDc2Il19.k7hoXwmR-z3pQefT47myoZQ4AInVE-FIH3_0BpzHL18ujuQBt6JxPbSthoZvbAVbJgLgDOy3Ufr-cxGFm9E18ZH8LA-CVVf8eR0UVE-3rS_fdiHqBxjgrFIVK9Ns0wxGC2NzNHlCy_3HPC3Np8g9jTaLpFbQ9BoCTIxKp_jgaBE9X1paa6KoaeFJdJ5NeX85EZncqL6_448v7EdQYXvbtU9hO7QjKCgR1TrxEfWMIcl-0yr5G0qi533C84bU8-nK3_oz37Q4RvW8BAe99-45_fjEtRlyjc1A585Af9kHikXh4BbRa3N14kY6OMMnZkFphK_vSemF12LSuXqT2EFKig";
		List<String> tagNames = Arrays.asList("Temperature:MY-APPENDER-VINAYAK","PB:MY-APPENDER-VINAYAK","O3:MY-APPENDER-VINAYAK","CO2:MY-APPENDER-VINAYAK","PM2_5:MY-APPENDER-VINAYAK","NH3:MY-APPENDER-VINAYAK","PM10:MY-APPENDER-VINAYAK","SO2:MY-APPENDER-VINAYAK");
		DatapointsResponse datapointsResponse = sensorDataService.getSensorData(tagNames, authorization, value.getStartTime(), value.getEndTime());
		datapointsResponse.getTags();		
		ObjectMapper mapper = new ObjectMapper();
		String response = mapper.writeValueAsString(datapointsResponse);
		//log.info("Sensor data response -----"+response);
		List<SensorDataResponse> sensorDataResponseList = parseSensorData(datapointsResponse);
		log.info("sensor data response :::: " + mapper.writeValueAsString(sensorDataResponseList));
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
			sensorDataResponse.setName((eachTag.getName()).split(":")[0]);
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
