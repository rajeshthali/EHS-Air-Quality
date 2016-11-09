package com.tcs.ehs.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Component;

import com.ge.predix.entity.timeseries.datapoints.queryresponse.DatapointsResponse;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Results;
import com.ge.predix.entity.timeseries.datapoints.queryresponse.Tag;
import com.ge.predix.entity.util.map.Map;
import com.tcs.ehs.utils.TimeSeriesWaterParser.Floor;

@Component
public class CommonTimeSeriesParser {

	public Collection<CommonResponseObjectCollections> parseTimeSeriesResponse(DatapointsResponse datapointsResponse) {
		java.util.Map<String, CommonResponseObjectCollections> commonCollectionMap = new HashMap<>();
		List<CommonResponseObjectCollections> responseList = new ArrayList<CommonResponseObjectCollections>();
		try {
			Tag tag = datapointsResponse.getTags().get(0);
			List<Results> results = tag.getResults();
			CommonResponseObjectCollections reponseObject = null;
			List<CommonResponseObject> responseObjectList = null;
			for (int i = 0; i < results.size(); i++) {
				Map attributes = results.get(i).getAttributes();
				if (attributes.size() > 0) {					
					//CommonResponseObjectCollections reponseObject = new CommonResponseObjectCollections();
					String assetNameStirng=null;
					if(null!=(List<String>) attributes.get("assetname")){

						assetNameStirng = ((List<String>) attributes.get("assetname")).get(0);
					}else{
						assetNameStirng = ((List<String>) attributes.get("name")).get(0);
					}

					if(commonCollectionMap.get(assetNameStirng) == null) {
						reponseObject = new CommonResponseObjectCollections();
						responseObjectList = new ArrayList<CommonResponseObject>();
					}else{
						reponseObject = commonCollectionMap.get(assetNameStirng);
						responseObjectList = reponseObject.getResponseObjects();
					}
					String floorNoStirng = ((List<String>) attributes.get("floorNo")).get(0);
					String name = ((List<String>) attributes.get("name")).get(0);
					reponseObject.setAssetName(assetNameStirng);
					reponseObject.setFloor(Integer.parseInt(floorNoStirng));
					List<Object> values = results.get(i).getValues();
					for(Object obj : values) {
						CommonResponseObject responseObject = new CommonResponseObject();
						responseObject.setProperyName(name);
						responseObject.setPropertyValue(((List<Integer>)obj).get(1));
						responseObject.setTimestamp(((List<Long>)obj).get(0));
						responseObjectList.add(responseObject);
					}
					reponseObject.setResponseObjects(responseObjectList);
					//responseList.add(reponseObject);
					commonCollectionMap.put(assetNameStirng, reponseObject);
				}

			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return commonCollectionMap.values();
	}

}
