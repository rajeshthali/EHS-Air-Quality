package com.tcs.ehs.services;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.Header;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ge.predix.entity.timeseries.datapoints.queryrequest.DatapointsQuery;
import com.ge.predix.entity.timeseries.datapoints.queryrequest.Tag;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.ge.predix.solsvc.restclient.impl.RestClient;
import com.ge.predix.solsvc.timeseries.bootstrap.config.TimeseriesRestConfig;
import com.ge.predix.solsvc.timeseries.bootstrap.factories.TimeseriesFactory;

@Service
public class SensorDataService {
	private Logger log = Logger.getLogger(SensorDataService.class);
	@Autowired
	private TimeseriesFactory timeseriesFactory;
	
	@Autowired
	private TimeseriesRestConfig timeseriesRestConfig;

	@Autowired
	protected RestClient restClient;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	public DatapointsResponse getSensorData(List<String> tagNames, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		List<Header> headers = new ArrayList<Header>();
		restClient.addSecureTokenToHeaders(headers, auth);
		restClient.addZoneToHeaders(headers, timeseriesRestConfig.getZoneId());
		DatapointsQuery datapointsQuery = new DatapointsQuery();
		datapointsQuery.setStart(startTime);
		datapointsQuery.setEnd(endTime);
		List<Tag> tags = new ArrayList<>();
		for(String tagName : tagNames) {
			Tag tag = new Tag();
			tag.setName(tagName);
			tags.add(tag);
		}
		
		datapointsQuery.setTags(tags);
		log.info("Query : " + objectMapper.writeValueAsString(datapointsQuery));

		DatapointsResponse response = timeseriesFactory.queryForDatapoints(timeseriesRestConfig.getBaseUrl(), datapointsQuery, headers);
		response.setStart(startTime);
		response.setEnd(endTime);
		log.info("Response : " + objectMapper.writeValueAsString(response));

		return response;
	}
}
