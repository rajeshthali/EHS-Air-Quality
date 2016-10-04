package com.ge.predix.solsvc.dataingestion.handler;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.Proxy.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.http.Header;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ge.predix.entity.asset.Asset;
import com.ge.predix.entity.asset.AssetTag;
import com.ge.predix.entity.asset.TagDatasource;
import com.ge.predix.solsvc.bootstrap.ams.factories.AssetFactory;
import com.ge.predix.solsvc.dataingestion.vo.AssetObject;

/**
 * 
 * @author predix -
 */
@Component
public class AssetDataHandler extends BaseFactory {
	private static Logger log = Logger.getLogger(AssetDataHandler.class);
	@Autowired
	private AssetFactory assetFactory;
	@Autowired
	private Environment env;

	/**
	 * @return -
	 */
	public List<Asset> getAllAssets() {
		List<Header> headers = this.restClient.getOauthHttpHeaders();
		List<Asset> assets = this.assetFactory.getAllAssets(headers);
		/*
		 * if (assets != null) { for (Asset asset:assets) { log.info(
		 * "Asset Name 				: "+asset.getAssetId()); log.info(
		 * "Asset Uri 				: "+asset.getUri()); log.info(
		 * "Asset Specification 	: "+asset.getSpecification()+"\n"); } }
		 */
		return assets;
	}

	public HashMap<String, AssetObject> retriveAssetObjects(String authorization) throws JsonParseException, JsonMappingException, IOException {
		HashMap<String, AssetObject> map = new HashMap<>();
		if (authorization == null || StringUtils.isEmpty(authorization)) {
			List<Header> headers = this.restClient.getSecureTokenForClientId();
			authorization = headers.get(0).getValue();
		}

		String url = env.getProperty("user.asset.url");
		String predix_zone_id = assetRestConfig.getZoneId();

		SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
		//Sipra
		//Proxy proxy = new Proxy(Type.HTTP, new InetSocketAddress("proxy.tcs.com", 8080));
		//Proxy proxy = new Proxy(Type.HTTP, new InetSocketAddress("pitc-zscaler-aspac-bangalore3pr.proxy.corporate.ge.com", 443));
		
		//requestFactory.setProxy(proxy);
		
		RestTemplate restTemplate = new RestTemplate(requestFactory);

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		headers.add("Authorization", authorization);
		headers.add("predix-zone-id", predix_zone_id);
		HttpEntity<String> entity = new HttpEntity<String>(headers);
		ObjectMapper mapper = new ObjectMapper();
		ResponseEntity<String> result = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
		List<AssetObject> assetObjects = mapper.readValue(result.getBody(), new TypeReference<List<AssetObject>>() {
		});

		for (AssetObject assetObject : assetObjects) {
			map.put(assetObject.getMachine(), assetObject);
		}

		return map;
	}

	/**
	 * @param uuid
	 *            -
	 * @param filter
	 *            -
	 * @param value
	 *            -
	 * @param authorization
	 *            -
	 * @return -
	 */
	public Asset retrieveAsset(String uuid, String filter, String value, String authorization) {

		List<Header> headers = null;
		if (StringUtils.isEmpty(authorization)) {
			System.out.println("getting Headers");
			headers = this.restClient.getSecureTokenForClientId();
			System.out.println("headers : " + headers);
		} else {
			headers = new ArrayList<Header>();
			this.restClient.addSecureTokenToHeaders(headers, authorization);
		}
		this.restClient.addZoneToHeaders(headers, this.assetRestConfig.getZoneId());
		List<Asset> assets = null;
		try {
			// uuid = "001";
			System.out.println("uuid : " + uuid);
			System.out.println("filter : " + filter);
			System.out.println("value : " + value);
			System.out.println("ZoneId : " + assetRestConfig.getZoneId());
			// value = "/Geography/001";
			// uuid="001";
			// filter="uri";

			final String uri = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/Geography/001";
			SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
			//Sipra
			//Proxy proxy = new Proxy(Type.HTTP, new InetSocketAddress("pitc-zscaler-aspac-bangalore3pr.proxy.corporate.ge.com", 443));
			//requestFactory.setProxy(proxy);
			
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			HttpHeaders headers1 = new HttpHeaders();
			headers1.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
			headers1.add(headers.get(0).getName(), headers.get(0).getValue());
			headers1.add("predix-zone-id", this.assetRestConfig.getZoneId());
			HttpEntity<String> entity = new HttpEntity<String>(headers1);

			ResponseEntity<String> result = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
			System.out.println("data >>> " + result.getBody());

			ObjectMapper mapper = new ObjectMapper();
			List<HashMap<String, Object>> dataValue = mapper.readValue(result.getBody(), new com.fasterxml.jackson.core.type.TypeReference<List<HashMap<String, Object>>>() {
			});
			Asset asset = new Asset();
			asset.setAssetId(dataValue.get(0).get("asset_serial_id").toString());
			asset.setUri(dataValue.get(0).get("uri").toString());
			asset.setName(dataValue.get(0).get("machine").toString());
			System.out.println("Asset >>> " + mapper.writeValueAsString(new Asset()));
			assets = new ArrayList<>();
			assets.add(asset);
			// assets = this.assetFactory.getAllAssets(headers);
			// assetFactory.get
			// return assetFactory.getAsset("001", headers);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (assets != null && assets.size() > 0) {
			Asset asset = assets.get(0);

			/*
			 * log.info("Asset Name 				: "+asset.getAssetId());
			 * log.info("Asset Uri 				: "+asset.getUri()); log.info(
			 * "Asset Specification 	: "+asset.getSpecification()+"\n");
			 */
			return asset;
		}
		return null;
	}

	/**
	 * Lookup the Asset based on a Filter = Value and in the Asset find the
	 * matching Predix Machine TagDatasource Node name.
	 * 
	 * @param filter
	 *            -
	 * @param value
	 *            -
	 * @param nodeName
	 *            -
	 * @param authorization
	 *            -
	 * @return -
	 */
	@SuppressWarnings("nls")
	public Map<String, AssetTag> getTimeSeriesTag(String filter, String value, String nodeName, String authorization) {
		Map<String, AssetTag> ret = new HashMap<String, AssetTag>(1);
		for (int i = 0; i < this.retryCount; i++) {
			Asset asset = retrieveAsset(null, filter, value, authorization);
			if (asset != null) {
				@SuppressWarnings("unchecked")
				LinkedHashMap<String, AssetTag> tags = asset.getAssetTag();
				if (tags != null) {
					for (Entry<String, AssetTag> entry : tags.entrySet()) {
						AssetTag assetTag = entry.getValue();
						TagDatasource dataSource = assetTag.getTagDatasource();
						if (dataSource != null && !dataSource.getNodeName().isEmpty() && dataSource.getNodeName().equals(nodeName)) {
							ret.put(entry.getKey(), assetTag);
							return ret;
						}
					}
					log.warn("2. asset has no assetTags with matching nodeName, unable to find filter=" + filter + " = " + value + " nodeName=" + nodeName + " authorization=" + authorization);
				} else
					log.warn("3. asset has no tags, unable to find filter=" + filter + " = " + value + " nodeName=" + nodeName + " authorization=" + authorization);
			} else
				log.warn("4. asset not found, unable to find filter=" + filter + " = " + value + " nodeName=" + nodeName + " authorization=" + authorization);

		}
		return ret;
	}
}
