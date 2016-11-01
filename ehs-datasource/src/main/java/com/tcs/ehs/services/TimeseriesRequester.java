package com.tcs.ehs.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.http.Header;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ge.predix.entity.timeseries.datapoints.queryrequest.DatapointsQuery;
import com.ge.predix.entity.timeseries.datapoints.queryrequest.Filters;
import com.ge.predix.entity.timeseries.datapoints.queryrequest.Group;
import com.ge.predix.entity.timeseries.datapoints.queryrequest.Tag;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.ge.predix.entity.util.map.Map;
import com.ge.predix.solsvc.restclient.impl.RestClient;
import com.ge.predix.solsvc.timeseries.bootstrap.config.TimeseriesRestConfig;
import com.ge.predix.solsvc.timeseries.bootstrap.factories.TimeseriesFactory;
import com.tcs.ehs.utils.Constants;
import com.tcs.ehs.utils.Constants.QueryTagsHygiene;

@Service
public class TimeseriesRequester {

	private Logger log = Logger.getLogger(TimeseriesRequester.class);
	@Autowired
	private TimeseriesFactory timeseriesFactory;

	@Autowired
	private TimeseriesRestConfig timeseriesRestConfig;

	@Autowired
	protected RestClient restClient;

	@Autowired
	private ObjectMapper objectMapper;

	public DatapointsResponse requestForAQI(Constants.QueryTagsAQI tagName, Map attrMap, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		List<Header> headers = new ArrayList<Header>();
		restClient.addSecureTokenToHeaders(headers, auth);
		restClient.addZoneToHeaders(headers, timeseriesRestConfig.getZoneId());

		DatapointsQuery datapointsQuery = new DatapointsQuery();
		datapointsQuery.setStart(startTime);
		datapointsQuery.setEnd(endTime);

		Tag tag = new MyTag();

		Filters filters = new Filters();
		filters.setAttributes(attrMap);
		if (attrMap != null)
			tag.setFilters(filters);

		List<Group> groups = new ArrayList<>();
		MyGroup group = new MyGroup();
		group.setName("attribute");
		group.setAttributes(Arrays.asList(Constants.Water.list()));
		groups.add(group);
		tag.setGroups(groups);
		tag.setName(tagName.toString());
		//stag.setAggregations(null);
		List<Tag> tags = new ArrayList<>();
		tags.add(tag);
		datapointsQuery.setTags(tags);
		log.info("Query : " + objectMapper.writeValueAsString(datapointsQuery));

		DatapointsResponse response = timeseriesFactory.queryForDatapoints(timeseriesRestConfig.getBaseUrl(), datapointsQuery, headers);
		response.setStart(startTime);
		response.setEnd(endTime);
		log.info("Response : " + objectMapper.writeValueAsString(response));

		return response;
	}

	
	
	
	
	public DatapointsResponse requestForAQI(Constants.QueryTagsAQI tagName, String floorNo, String assetName, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		Map attrMap = new Map();
		attrMap.put("floorNo", floorNo);
		attrMap.put("assetname", assetName);
		return requestForAQI(tagName, attrMap, auth, startTime, endTime);
	}

	public DatapointsResponse requestForAQI(Constants.QueryTagsAQI tagName, String floorNo, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		Map attrMap = new Map();
		attrMap.put("floorNo", floorNo);
		return requestForAQI(tagName, attrMap, auth, startTime, endTime);
	}

	public DatapointsResponse requestForAQI(Constants.QueryTagsAQI tagName, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		Map attrMap = null;
		return requestForAQI(tagName, attrMap, auth, startTime, endTime);
	}

	public DatapointsResponse requestForHygiene(Constants.QueryTagsHygiene tagName, Map attrMap, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		/*List<Header> headers = new ArrayList<Header>();
		restClient.addSecureTokenToHeaders(headers, auth);
		restClient.addZoneToHeaders(headers, timeseriesRestConfig.getZoneId());

		DatapointsQuery datapointsQuery = new DatapointsQuery();
		datapointsQuery.setStart(startTime);
		datapointsQuery.setEnd(endTime);

		Tag tag = new MyTag();

		Filters filters = new Filters();
		filters.setAttributes(attrMap);
		if (attrMap != null)
			tag.setFilters(filters);

		List<Group> groups = new ArrayList<>();
		MyGroup group = new MyGroup();
		group.setName("attribute");
		group.setAttributes(Arrays.asList(Constants.Hygiene.list()));
		groups.add(group);
		tag.setGroups(groups);
		tag.setName(tagName.toString());
		tag.setAggregations(null);
		List<Tag> tags = new ArrayList<>();
		tags.add(tag);
		datapointsQuery.setTags(tags);
		log.info("Query : " + objectMapper.writeValueAsString(datapointsQuery));

		DatapointsResponse response = timeseriesFactory.queryForDatapoints(timeseriesRestConfig.getBaseUrl(), datapointsQuery, headers);
		response.setStart(startTime);
		response.setEnd(endTime);
		log.info("Response : " + objectMapper.writeValueAsString(response));

		return response;*/
		List<Header> headers = new ArrayList<Header>();
		restClient.addSecureTokenToHeaders(headers, auth);
		restClient.addZoneToHeaders(headers, timeseriesRestConfig.getZoneId());

		DatapointsQuery datapointsQuery = new DatapointsQuery();
		datapointsQuery.setStart(startTime);
		datapointsQuery.setEnd(endTime);

		Tag tag = new MyTag();

		Filters filters = new Filters();
		filters.setAttributes(attrMap);
		if (attrMap != null)
			tag.setFilters(filters);

		List<Group> groups = new ArrayList<>();
		MyGroup group = new MyGroup();
		group.setName("attribute");
		group.setAttributes(Arrays.asList(Constants.Water.list()));
		groups.add(group);
		tag.setGroups(groups);
		tag.setName(tagName.toString());
		tag.setAggregations(null);
		List<Tag> tags = new ArrayList<>();
		tags.add(tag);
		datapointsQuery.setTags(tags);
		log.info("Query : " + objectMapper.writeValueAsString(datapointsQuery));

		DatapointsResponse response = timeseriesFactory.queryForDatapoints(timeseriesRestConfig.getBaseUrl(), datapointsQuery, headers);
		response.setStart(startTime);
		response.setEnd(endTime);
		log.info("Response : " + objectMapper.writeValueAsString(response));
		return response;
	}

	public DatapointsResponse requestForHygiene(Constants.QueryTagsHygiene tagName, String floorNo, String assetName, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		Map attrMap = new Map();
		attrMap.put("floorNo", floorNo);
		attrMap.put("assetname", assetName);
		return requestForHygiene(tagName, attrMap, auth, startTime, endTime);
	}

	public DatapointsResponse requestForHygiene(Constants.QueryTagsHygiene tagName, String floorNo, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		Map attrMap = new Map();
		attrMap.put("floorNo", floorNo);
		return requestForHygiene(tagName, attrMap, auth, startTime, endTime);
	}

	public DatapointsResponse requestForHygiene(Constants.QueryTagsHygiene tagName, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		Map attrMap = new Map();
		return requestForHygiene(tagName, attrMap, auth, startTime, endTime);
	}
	
	    //amlesh
		public DatapointsResponse requestForWater(Constants.QueryTagsWater tagName, Map attrMap, String auth, Long startTime, Long endTime) throws JsonProcessingException {
			List<Header> headers = new ArrayList<Header>();
			restClient.addSecureTokenToHeaders(headers, auth);
			restClient.addZoneToHeaders(headers, timeseriesRestConfig.getZoneId());

			DatapointsQuery datapointsQuery = new DatapointsQuery();
			datapointsQuery.setStart(startTime);
			datapointsQuery.setEnd(endTime);

			Tag tag = new MyTag();

			Filters filters = new Filters();
			filters.setAttributes(attrMap);
			if (attrMap != null)
				tag.setFilters(filters);

			List<Group> groups = new ArrayList<>();
			MyGroup group = new MyGroup();
			group.setName("attribute");
			group.setAttributes(Arrays.asList(Constants.Water.list()));
			groups.add(group);
			tag.setGroups(groups);
			tag.setName(tagName.toString());
			tag.setAggregations(null);
			List<Tag> tags = new ArrayList<>();
			tags.add(tag);
			datapointsQuery.setTags(tags);
			log.info("Query : " + objectMapper.writeValueAsString(datapointsQuery));

			DatapointsResponse response = timeseriesFactory.queryForDatapoints(timeseriesRestConfig.getBaseUrl(), datapointsQuery, headers);
			response.setStart(startTime);
			response.setEnd(endTime);
			log.info("Response : " + objectMapper.writeValueAsString(response));

			return response;
		}
	
		public DatapointsResponse requestForWater(Constants.QueryTagsWater tagName, String floorNo, String assetName, String auth, Long startTime, Long endTime) throws JsonProcessingException {
			Map attrMap = new Map();
			attrMap.put("floorNo", floorNo);
			attrMap.put("assetname", assetName);
			return requestForWater(tagName, attrMap, auth, startTime, endTime);
		}

		public DatapointsResponse requestForWater(Constants.QueryTagsWater tagName, String floorNo, String auth, Long startTime, Long endTime) throws JsonProcessingException {
			Map attrMap = new Map();
			attrMap.put("floorNo", floorNo);
			return requestForWater(tagName, attrMap, auth, startTime, endTime);
		}

		public DatapointsResponse requestForWater(Constants.QueryTagsWater tagName, String auth, Long startTime, Long endTime) throws JsonProcessingException {
			Map attrMap = new Map();
			return requestForWater(tagName, attrMap, auth, startTime, endTime);
		}
		
	
	//amlesh
	/*public DatapointsResponse requestForWater(Constants.QueryTagsWater tagName, String auth, Long startTime, Long endTime) throws JsonProcessingException {
		Map attrMap = new Map();
		return requestForWater(tagName, attrMap, auth, startTime, endTime);
	}*/

	@JsonInclude(Include.NON_NULL)
	class MyTag extends Tag {

	}

	@JsonInclude(Include.NON_NULL)
	class MyGroup extends Group {
		private static final long serialVersionUID = 1L;
		private List<Object> attributes = new ArrayList<>();

		public List<Object> getAttributes() {
			return attributes;
		}

		public void setAttributes(List<Object> attributes) {
			this.attributes = attributes;
		}

		@Override
		public void setValues(List<Object> values) {
			super.setValues(null);
		}

		@Override
		public List<Object> getValues() {
			return null;
		}
	}

}
