package com.ge.predix.solsvc.machinedata.simulator;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ge.predix.entity.timeseries.datapoints.ingestionrequest.Body;
import com.ge.predix.entity.timeseries.datapoints.ingestionrequest.DatapointsIngestion;
import com.ge.predix.entity.util.map.Map;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants.Hygiene;
import com.ge.predix.solsvc.machinedata.simulator.vo.AQIAttributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.AQIBody;
import com.ge.predix.solsvc.machinedata.simulator.vo.AQIObjectVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.FloorAttributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.FloorBodyVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.FloorObjectVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.HygeineAtrributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.HygeineBody;
import com.ge.predix.solsvc.machinedata.simulator.vo.HygeineObjectVO;
import com.ge.predix.solsvc.restclient.impl.RestClient;

/**
 * 
 * @author predix -
 */
@Component
public class MachineDataSimulator {
	/**
     * 
     */
	static final Logger log = LoggerFactory
			.getLogger(MachineDataSimulator.class);
	private ObjectMapper mapper = new ObjectMapper();

	public MachineDataSimulator() {
		mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		// mapper.configure(SerializationFeature.INDENT_OUTPUT,true);
		mapper.setSerializationInclusion(Include.NON_NULL);

	}

	/**
     * 
     */
	@Autowired
	ApplicationProperties applicationProperties;

	@Autowired
	private MapperService mapperService;

	@Autowired
	private RestClient restClient;

	/**
	 * -
	 */
	@Scheduled(fixedDelayString = "${dataingestion.sleepTimeMillis}")
	public void run() {

		try {

			generateAndPushRandomAreaData();

			generateAndPushRandomMachineData();

			generateAndPushRandomHygieneData();
			

			//generateAndPushRandomEHSFloorData();

		} catch (Throwable e) {
			log.error("unable to run Machine DataSimulator Thread", e); //$NON-NLS-1$
		}
	}

/*	private String generateAndPushRandomEHSFloorData()
			throws IOException {
		FloorObjectVO floorObj = new FloorObjectVO();
		floorObj.setMessageId(System.currentTimeMillis());
		List<FloorBodyVO> floorBodyList = new ArrayList<>();

		String floorName = "FIRST_FLOOR_DATA";
		generateFloorData(floorBodyList, floorName);
		floorObj.setBody(floorBodyList);

		floorName = "SECOND_FLOOR_DATA";
		generateFloorData(floorBodyList, floorName);
		floorObj.setBody(floorBodyList);

		floorName = "THIRD_FLOOR_DATA";
		generateFloorData(floorBodyList, floorName);
		floorObj.setBody(floorBodyList);

		// Create DatapointsIngestion request object
		DatapointsIngestion dataPtIngest = createAllFloorDataIngestionRequest(floorObj);

		StringWriter writer = new StringWriter();
		mapper.writeValue(writer, dataPtIngest);
		System.out.println("Final JSON sending to saveTimeSeries >> "
				+ writer.toString());
		return postData(writer.toString());

	}
	*/
	@SuppressWarnings("unchecked")
	private DatapointsIngestion createAllFloorDataIngestionRequest(
			FloorObjectVO floorObj) throws JsonGenerationException,
			JsonMappingException, IOException {

		DatapointsIngestion dpIngestion = new DatapointsIngestion();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		dpIngestion.setMessageId(String.valueOf(calendar.getTimeInMillis()));
		List<Body> bodies = new ArrayList<Body>();

		// Create DataIngestion Object
		Body body = new Body();
		body.setName("ALL_FLOOR_DATA");

		List<Object> datapoints = new ArrayList<Object>();
		List<Object> assetDatapoint = new ArrayList<Object>();
		assetDatapoint.add(String.valueOf(calendar.getTimeInMillis()));
		assetDatapoint.add(10L);
		assetDatapoint.add(1L);

		datapoints.add(assetDatapoint);

		body.setDatapoints(datapoints);

		StringWriter floorDataWriter = new StringWriter();
		mapper.writeValue(floorDataWriter, floorObj);

		//

		//

		ByteBuffer floordataBuff = Charset.forName("UTF-8").encode(
				floorDataWriter.toString());

		 String allFloorJSON = new String(floordataBuff.array(), "UTF-8");
		 
		 System.out.println("FLOOR JSON ::::: "+allFloorJSON);
		 
		com.ge.predix.entity.util.map.Map map = new com.ge.predix.entity.util.map.Map();
		map.put("allfloorData", floordataBuff);

		body.setAttributes(map);
		bodies.add(body);

		dpIngestion.setBody(bodies);

		return dpIngestion;

	}

	@SuppressWarnings("unchecked")
	private DatapointsIngestion createFloorDataIngestionRequest(
			FloorObjectVO floorObj) throws JsonGenerationException, JsonMappingException, IOException {

		DatapointsIngestion dpIngestion = new DatapointsIngestion();
		// dpIngestion.setMessageId(String.valueOf(System.currentTimeMillis()));
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		dpIngestion.setMessageId(String.valueOf(calendar.getTimeInMillis()));
		List<Body> bodies = new ArrayList<Body>();

		//
		List<FloorBodyVO> floorBodyList = floorObj.getBody();
		for (FloorBodyVO floorBody : floorBodyList) {
			FloorAttributesVO floorAttr = floorBody.getAttributes();
			ArrayList<ArrayList<Long>> floorDataPts = floorBody.getDatapoints();
			String floorBodyName = floorBody.getName();

			// Create DataIngestion Object
			Body body = new Body();
			body.setName(floorBodyName);

			List<Object> datapoints = new ArrayList<Object>();
			List<Object> assetDatapoint = new ArrayList<Object>();
			assetDatapoint.add(String.valueOf(calendar.getTimeInMillis()));
			assetDatapoint.add(floorDataPts.get(0).get(1));
			assetDatapoint.add(floorDataPts.get(0).get(2));

			datapoints.add(assetDatapoint);

			body.setDatapoints(datapoints);

			com.ge.predix.entity.util.map.Map map = new com.ge.predix.entity.util.map.Map();
			StringWriter areaWriter = new StringWriter();
			mapper.writeValue(areaWriter, floorAttr.getAreaDataList());
			
			StringWriter machineWriter = new StringWriter();
			mapper.writeValue(machineWriter, floorAttr.getMachineDataList());
			
			StringWriter hygieneWriter = new StringWriter();
			mapper.writeValue(hygieneWriter, floorAttr.getHygieneDataList());
			
			//
		
			//
			
			ByteBuffer areaBuff = Charset.forName("UTF-8").encode(areaWriter.toString());
			System.out.println("AREA BUFFER:::::"+areaBuff);
			
			ByteBuffer machineBuff = Charset.forName("UTF-8").encode(machineWriter.toString());
			
			ByteBuffer hygBuff = Charset.forName("UTF-8").encode(hygieneWriter.toString());
			
			String areaJSON = new String(areaBuff.array(), "UTF-8");
			
			System.out.println("AREA JSON:::::"+areaJSON);
			
			map.put("areaData", areaBuff);
			map.put("machineData", machineBuff);
			map.put("hygieneData", hygBuff);

			body.setAttributes(map);
			bodies.add(body);

		}

		dpIngestion.setBody(bodies);

		return dpIngestion;

	}

	/*private void generateFloorData(List<FloorBodyVO> floorBodyList,
			String floorName) throws JsonProcessingException {
		FloorBodyVO firstFloorBody = new FloorBodyVO();
		firstFloorBody.setName(floorName);

		// set data points
		ArrayList<Long> datapoint = new ArrayList<>();
		datapoint.add(System.currentTimeMillis());
		datapoint.add(10l);
		datapoint.add(1l);
		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		//
		firstFloorBody.setDatapoints(datapoints);

		FloorAttributesVO firstFloorAttributes = new FloorAttributesVO();
		firstFloorAttributes.setAreaDataList(generateAreaData());
		firstFloorAttributes.setHygieneDataList(generateHygieneData());
		firstFloorAttributes.setMachineDataList(generateMachineData());

		firstFloorBody.setAttributes(firstFloorAttributes);
		floorBodyList.add(firstFloorBody);
	}
*/
	/*
	 * private void generateAndPushDataIngestionHygieneData() {
	 * DatapointsIngestion dataPtIng = new DatapointsIngestion();
	 * 
	 * Long currentTimeMillis = System.currentTimeMillis();
	 * 
	 * List<Body> bodies = new ArrayList<>();
	 * 
	 * Body body = new Body(); body.setName(value);
	 * body.setDatapoints(datapoints); body.setAttributes(value);
	 * 
	 * dataPtIng.setBody(body);
	 * dataPtIng.setMessageId(currentTimeMillis.toString());
	 * 
	 * 
	 * }
	 */

	private String generateAndPushRandomAreaData()
			throws JsonGenerationException, JsonMappingException, IOException {
		Long currentTimeMillis = System.currentTimeMillis();

		AQIObjectVO aqiObjVO = new AQIObjectVO();
		List<AQIBody> aqiBodyList = new ArrayList<>();
		
		createFloorwiseAreaBody(aqiBodyList, Constants.AREA_ASSET_FLR_0, Constants.GRND_FLOOR);
		createFloorwiseAreaBody(aqiBodyList, Constants.AREA_ASSET_FLR_1, Constants.FIRST_FLOOR);
		createFloorwiseAreaBody(aqiBodyList, Constants.AREA_ASSET_FLR_2, Constants.SECOND_FLOOR);

		aqiObjVO.setBody(aqiBodyList);
		aqiObjVO.setMessageId(currentTimeMillis);

		DatapointsIngestion dataPtIngest = createAQIDataIngestionRequest(aqiObjVO);

		StringWriter writer = new StringWriter();

		mapper.writeValue(writer, dataPtIngest);
		System.out.println("Final Area JSON sending to saveTimeSeries >> "
				+ writer.toString());
		return postData(writer.toString());
		// return writer.toString();

	}

	private AQIBody generateAreaData(int floorNo, String areaAssetName) {

		Long currentTimeMillis = System.currentTimeMillis();
		
		AQIBody aqiAreaBody = getRandomAQIDataVO(currentTimeMillis, "AQI-Area", true, areaAssetName, floorNo);

		return aqiAreaBody;
	}

	private String generateAndPushRandomMachineData()
			throws JsonGenerationException, JsonMappingException, IOException {
		Long currentTimeMillis = System.currentTimeMillis();

		AQIObjectVO aqiObjVO = new AQIObjectVO();
		List<AQIBody> aqiBodyList = new ArrayList<>();
		
		
		createFloorwiseMachineBody(aqiBodyList, Constants.MCHN_ASSET_FLR_0, Constants.GRND_FLOOR);
		createFloorwiseMachineBody(aqiBodyList, Constants.MCHN_ASSET_FLR_1, Constants.FIRST_FLOOR);
		createFloorwiseMachineBody(aqiBodyList, Constants.MCHN_ASSET_FLR_2, Constants.SECOND_FLOOR);


		aqiObjVO.setBody(aqiBodyList);
		aqiObjVO.setMessageId(currentTimeMillis);

		DatapointsIngestion dataPtIngest = createAQIDataIngestionRequest(aqiObjVO);

		StringWriter writer = new StringWriter();

		mapper.writeValue(writer, dataPtIngest);
		System.out.println("Final Machine JSON sending to saveTimeSeries >> "
				+ writer.toString());
		return postData(writer.toString());
		// return writer.toString();

	}

	private AQIBody generateMachineData(int floorNo, String machineAssetName) {

		Long currentTimeMillis = System.currentTimeMillis();
		
		AQIBody aqiAreaBody = getRandomAQIDataVO(currentTimeMillis, "AQI-Machine", false, machineAssetName, floorNo);

		return aqiAreaBody;
	
	}

	private String generateAndPushRandomHygieneData()
			throws JsonGenerationException, JsonMappingException, IOException {

		Long currentTimeMillis = System.currentTimeMillis();
		List<HygeineBody> hygBodyList = new ArrayList<>();
		
		createFloorwiseHygieneBody(hygBodyList, Constants.HYG_ASSET_FLR_0, Constants.GRND_FLOOR);
		createFloorwiseHygieneBody(hygBodyList, Constants.HYG_ASSET_FLR_1, Constants.FIRST_FLOOR);
		createFloorwiseHygieneBody(hygBodyList, Constants.HYG_ASSET_FLR_2, Constants.SECOND_FLOOR);
		
		HygeineObjectVO hygObjVO = new HygeineObjectVO();
		hygObjVO.setBody(hygBodyList);
		hygObjVO.setMessageId(currentTimeMillis);

		DatapointsIngestion dataPtIngest = createHygieneDataIngestionRequest(hygObjVO);
		StringWriter writer = new StringWriter();

		mapper.writeValue(writer, dataPtIngest);
		System.out.println("Final Hygiene JSON sending to saveTimeSeries >> "
				+ writer.toString());
		return postData(writer.toString());
		
		// return writer.toString();

	}

	private void createFloorwiseHygieneBody(List<HygeineBody> hygBodyList, String[] assetArray, int floorNo) {
		for(int i=0; i < assetArray.length; i++){
			HygeineBody hygBody = generateHygieneData(floorNo, assetArray[i]);
			hygBodyList.add(hygBody);
		}
	}
	
	private void createFloorwiseAreaBody(List<AQIBody> aqiBodyList, String[] assetArray, int floorNo) {
		for(int i=0; i < assetArray.length; i++){
			AQIBody aqiBody = generateAreaData(floorNo, assetArray[i]);
			aqiBodyList.add(aqiBody);
		}
	}
	
	private void createFloorwiseMachineBody(List<AQIBody> aqiBodyList, String[] assetArray, int floorNo) {
		for(int i=0; i < assetArray.length; i++){
			AQIBody machineBody = generateMachineData(floorNo, assetArray[i]);
			aqiBodyList.add(machineBody);
		}
	}

	private HygeineBody generateHygieneData(int floorNo, String hygAssetName) {
		Long currentTimeMillis = System.currentTimeMillis();
		
		HygeineBody hygBodyVo = createHygieneBodyVO(floorNo,currentTimeMillis, "Hygiene",hygAssetName);
		
		return hygBodyVo;
	}

	private HygeineBody createHygieneBodyVO(int floorNo,Long currentTimeMillis,
			String bodyName, String hygieneArea) {
		HygeineBody hygBodyVo = new HygeineBody();
		hygBodyVo.setName(bodyName);

		ArrayList<Long> datapoint = new ArrayList<Long>();
		datapoint.add(currentTimeMillis);
		datapoint.add(10l);
		datapoint.add(1l);

		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		hygBodyVo.setDatapoints(datapoints);

		HygeineAtrributesVO hygAttVO = new HygeineAtrributesVO();

		hygAttVO.setFloor(floorNo);
		hygAttVO.setAssetName(hygieneArea);
		hygAttVO.setHumidity(getHygeineValues(Constants.Hygiene.HUMIDITY));
		hygAttVO.setNoise(getHygeineValues(Constants.Hygiene.NOISE));
		hygAttVO.setTemperature(getHygeineValues(Constants.Hygiene.TEMPERATURE));

		hygBodyVo.setAttributes(hygAttVO);
		return hygBodyVo;
	}

	private Double getHygeineValues(Constants.Hygiene hygiene) {
		Double values = new Double(0);
		Random r = new Random();
		int minLimit = 0;
		int maxLimit = 50000;
		switch (hygiene) {
		case TEMPERATURE:
			minLimit = 20000;
			maxLimit = 51000;
			break;
		case HUMIDITY:
			minLimit = 25000;
			maxLimit = 70000;
			break;
		case NOISE:
			minLimit = 67000;
			maxLimit = 71000;
			break;

		default:
			break;
		}
		int result = r.nextInt(maxLimit - minLimit) + minLimit;
		values = (double) ((double) result / 1000d);
		return values;
	}

	/**
	 * @return String Response string
	 * @throws Exception
	 *             -
	 */
	public String runTest() throws Exception {
		List<JSONData> list = generateMockDataMap_RT();

		ObjectMapper mapper = new ObjectMapper();
		StringWriter writer = new StringWriter();

		mapper.writeValue(writer, list);
		return postData(writer.toString());

	}

	/*
	 * private MessageObject getMessageObject(EHSObjectVO message) throws
	 * JsonProcessingException { MessageObject messageObject = new
	 * MessageObject(); Long currentTimeMillis = System.currentTimeMillis();
	 * ArrayList<Long> datapoint = new ArrayList<>();
	 * datapoint.add(currentTimeMillis); datapoint.add(10l); datapoint.add(1l);
	 * messageObject.setMessageId(currentTimeMillis); for (AssetBody ehsArea :
	 * message.getBody()) { Body body = new Body();
	 * 
	 * body.setO3(getValues(Constants.Parameter.O3));
	 * body.setNH3(getValues(Constants.Parameter.NH3));
	 * body.setNO2(getValues(Constants.Parameter.NO2));
	 * body.setPB(getValues(Constants.Parameter.Pb));
	 * body.setCO2(getValues(Constants.Parameter.CO));
	 * body.setSO2(getValues(Constants.Parameter.SO2));
	 * body.setPM2_5(getValues(Constants.Parameter.PM2_5));
	 * body.setPM10(getValues(Constants.Parameter.PM10));
	 * 
	 * body.setName(ehsArea.getName()); body.getDatapoints().add(datapoint);
	 * messageObject.getBody().add(body); } return messageObject; }
	 */

	@SuppressWarnings("unchecked")
	private DatapointsIngestion createAQIDataIngestionRequest(
			AQIObjectVO inputObj)
			throws com.fasterxml.jackson.core.JsonParseException,
			com.fasterxml.jackson.databind.JsonMappingException, IOException {

		DatapointsIngestion dpIngestion = new DatapointsIngestion();
		// dpIngestion.setMessageId(String.valueOf(System.currentTimeMillis()));
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		dpIngestion.setMessageId(String.valueOf(calendar.getTimeInMillis()));
		List<Body> bodies = new ArrayList<Body>();

		//
		List<AQIBody> aqiBodies = inputObj.getBody();
		for (AQIBody aqiBody : aqiBodies) {
			AQIAttributesVO aqiAttributes = aqiBody.getAttributes();
			ArrayList<ArrayList<Long>> aqiDatapoints = aqiBody.getDatapoints();
			String aqiBodyName = aqiBody.getName();

			// Create DataIngestion Object
			Body body = new Body();
			body.setName(aqiBodyName);

			List<Object> datapoints = new ArrayList<Object>();
			List<Object> assetDatapoint = new ArrayList<Object>();
			assetDatapoint.add(String.valueOf(calendar.getTimeInMillis()));
			assetDatapoint.add(aqiDatapoints.get(0).get(1));
			assetDatapoint.add(aqiDatapoints.get(0).get(2));

			datapoints.add(assetDatapoint);

			body.setDatapoints(datapoints);

			com.ge.predix.entity.util.map.Map map = new com.ge.predix.entity.util.map.Map();
			if (aqiAttributes.getAssetName() != null) {
				map.put("assetname",
						String.valueOf(aqiAttributes.getAssetName()));
			}

			map.put("floorNo", String.valueOf(aqiAttributes.getFloor()));

			if (aqiAttributes.getCO() != null) {
				map.put("CO", String.valueOf(aqiAttributes.getCO()));
			}
			if (aqiAttributes.getNH3() != null) {
				map.put("NH3", String.valueOf(aqiAttributes.getNH3()));
			}
			if (aqiAttributes.getNO2() != null) {
				map.put("NO2", String.valueOf(aqiAttributes.getNO2()));
			}
			if (aqiAttributes.getO3() != null) {
				map.put("O3", String.valueOf(aqiAttributes.getO3()));
			}
			if (aqiAttributes.getPB() != null) {
				map.put("PB", String.valueOf(aqiAttributes.getPB()));
			}
			if (aqiAttributes.getPM10() != null) {
				map.put("PM10", String.valueOf(aqiAttributes.getPM10()));
			}
			if (aqiAttributes.getPM2_5() != null) {
				map.put("PM2_5", String.valueOf(aqiAttributes.getPM2_5()));
			}
			if (aqiAttributes.getSO2() != null) {
				map.put("SO2", String.valueOf(aqiAttributes.getSO2()));
			}

			body.setAttributes(map);
			bodies.add(body);

		}

		dpIngestion.setBody(bodies);

		return dpIngestion;

	}

	@SuppressWarnings("unchecked")
	private DatapointsIngestion createHygieneDataIngestionRequest(
			HygeineObjectVO inputObj)
			throws com.fasterxml.jackson.core.JsonParseException,
			com.fasterxml.jackson.databind.JsonMappingException, IOException {

		DatapointsIngestion dpIngestion = new DatapointsIngestion();
		// dpIngestion.setMessageId(String.valueOf(System.currentTimeMillis()));
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		dpIngestion.setMessageId(String.valueOf(calendar.getTimeInMillis()));
		List<Body> bodies = new ArrayList<Body>();

		//
		List<HygeineBody> hygBodies = inputObj.getBody();
		for (HygeineBody hygBody : hygBodies) {
			HygeineAtrributesVO hygAttributes = hygBody.getAttributes();
			ArrayList<ArrayList<Long>> aqiDatapoints = hygBody.getDatapoints();
			String aqiBodyName = hygBody.getName();

			// Create DataIngestion Object
			Body body = new Body();
			body.setName(aqiBodyName);

			List<Object> datapoints = new ArrayList<Object>();
			List<Object> assetDatapoint = new ArrayList<Object>();
			assetDatapoint.add(String.valueOf(calendar.getTimeInMillis()));
			assetDatapoint.add(aqiDatapoints.get(0).get(1));
			assetDatapoint.add(aqiDatapoints.get(0).get(2));

			datapoints.add(assetDatapoint);

			body.setDatapoints(datapoints);

			com.ge.predix.entity.util.map.Map map = new com.ge.predix.entity.util.map.Map();
			if(hygAttributes.getAssetName() != null){
			map.put("assetname", String.valueOf(hygAttributes.getAssetName()));
			}
			
			map.put("floorNo", String.valueOf(hygAttributes.getFloor()));
			
			if(hygAttributes.getHumidity() != null){
			map.put("humidity", String.valueOf(hygAttributes.getHumidity()));
			}
			if(hygAttributes.getNoise() != null){
			map.put("noise", String.valueOf(hygAttributes.getNoise()));
			}
			if(hygAttributes.getTemperature() != null){
				map.put("temperature", String.valueOf(hygAttributes.getTemperature()));
			}

			//
			//com.ge.predix.entity.util.map.Map floorMap = new com.ge.predix.entity.util.map.Map();
		
			//com.ge.predix.entity.util.map.Map firstFloorMap = new com.ge.predix.entity.util.map.Map();
			/*List<com.ge.predix.entity.util.map.Map> areaDataList = new ArrayList<>();
			com.ge.predix.entity.util.map.Map smtAreaMap = new com.ge.predix.entity.util.map.Map();
			smtAreaMap.put("name", "SMTTestArea1");

			com.ge.predix.entity.util.map.Map prdAreaMap = new com.ge.predix.entity.util.map.Map();
			prdAreaMap.put("name", "PRDGrndFlr1");

			com.ge.predix.entity.util.map.Map nrSoldMchnAreaMap = new com.ge.predix.entity.util.map.Map();
			nrSoldMchnAreaMap.put("name", "NearSolrMchn1");

			areaDataList.add(smtAreaMap);
			areaDataList.add(prdAreaMap);
			areaDataList.add(nrSoldMchnAreaMap);

			firstFloorMap.put("areaData", areaDataList);*/
			//floorMap.put("firstFloorData", groundFloorMap);
			//floorMap.put("firstFloorData", firstFloorMap);
			//floorMap.put("thirdFloorData", secondFloorMap);
			

			//

			//body.setAttributes(floorMap);
			body.setAttributes(map);
			bodies.add(body);

		}

		dpIngestion.setBody(bodies);

		return dpIngestion;

	}

	private AQIBody getRandomAQIDataVO(Long currentTimeMillis, String bodyName,
			boolean areaRequest,String areaAssetName, int floorNo){

		AQIBody aqiBodyVo = new AQIBody();

		aqiBodyVo.setName(bodyName);

		ArrayList<Long> datapoint = new ArrayList<>();
		datapoint.add(currentTimeMillis);
		datapoint.add(10l);
		datapoint.add(1l);
		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		aqiBodyVo.setDatapoints(datapoints);

		AQIAttributesVO aqiAttVO = new AQIAttributesVO();
		aqiAttVO.setAssetName(areaAssetName);
		aqiAttVO.setFloor(floorNo);
		if (areaRequest) {
			aqiAttVO.setCO(getValues(Constants.Parameter.CO));
			aqiAttVO.setO3(getValues(Constants.Parameter.O3));
			aqiAttVO.setNH3(getValues(Constants.Parameter.NH3));
			aqiAttVO.setPB(getValues(Constants.Parameter.PB));
			aqiAttVO.setPM10(getValues(Constants.Parameter.PM10));
		}

		aqiAttVO.setNO2(getValues(Constants.Parameter.NO2));
		aqiAttVO.setPM2_5(getValues(Constants.Parameter.PM2_5));
		aqiAttVO.setSO2(getValues(Constants.Parameter.SO2));

		aqiBodyVo.setAttributes(aqiAttVO);

		return aqiBodyVo;
	}

	 public Double getValues(Constants.Parameter range) {
			Double values = new Double(0);
			Random r = new Random();
			int minLimit = 0;
			int maxLimit = 50;
			switch (range) {
			case O3:
				minLimit = 10;
				maxLimit = 50;
				break;
			case NH3:
				minLimit = 10;
				maxLimit = 50;
				break;
			case NO2:
				minLimit = 10;
				maxLimit = 50;
				break;
			case PB:
				minLimit = 500;
				maxLimit = 1000;
				break;
			case CO:
				minLimit = 1000;
				maxLimit = 2000;
				break;
			case SO2:
				minLimit = 10;
				maxLimit = 50;
				break;
			case PM2_5:
				minLimit = 10;
				maxLimit = 30;
				break;
			case PM10:
				minLimit = 10;
				maxLimit = 20;
				break;

			default:
				break;
			}
			int result = r.nextInt(maxLimit - minLimit) + minLimit;

			switch (range) {
			case CO:
				values = (double) result / 1000d;
				break;
			case PB:
				values = (double) result / 1000d;
				break;

			default:
				values = (double) result;
				break;

			}

			return values;
		} 
	/*
	 * public String readEHSDataAndGenerateRandomJSON(String jsonFileName)
	 * throws Exception { // TODO: Read data from Sensor by passing current
	 * timestamp
	 * 
	 * // // Generate JSON from EHS Data AQIObjectVO ehsObj =
	 * mapperService.parse(jsonFileName); Long currentTimeMillis =
	 * System.currentTimeMillis();
	 * 
	 * AQIObjectVO updatedEHSObject = getRandomEHSObject(ehsObj,
	 * currentTimeMillis);
	 * 
	 * List<AQIBody> bodyList = updatedEHSObject.getBody();
	 * System.out.println("Body List: \n" + bodyList); System.out.println();
	 * System.out.println("--------------------------------------------------");
	 * System.out.println("Random EHSObject Data: \n" + updatedEHSObject);
	 * 
	 * System.out.println("--------------------------------------------------");
	 * System.out.println(); // ObjectMapper mapper = new ObjectMapper();
	 * StringWriter writer = new StringWriter();
	 * 
	 * mapper.writeValue(writer, bodyList); // String jsonString =
	 * mapper.writeValueAsString(bodyList); //
	 * System.out.println("jsonString >> "+jsonString); return
	 * postData(writer.toString());
	 * 
	 * Long currentTimeMillis = System.currentTimeMillis();
	 * 
	 * EHSObjectVO ehsObj = mapperService.parse(jsonFileName); EHSObjectVO
	 * updatedEHSObject = getEHSObject(ehsObj, currentTimeMillis);
	 * 
	 * ObjectMapper mapper = new ObjectMapper(); List<AssetBody> bodyList =
	 * updatedEHSObject.getBody(); System.out.println("Body List: \n" +
	 * bodyList); System.out.println();
	 * System.out.println("--------------------------------------------------");
	 * System.out.println("Random EHSObject Data: \n" + updatedEHSObject);
	 * 
	 * System.out.println("--------------------------------------------------");
	 * System.out.println(); // ObjectMapper mapper = new ObjectMapper();
	 * StringWriter writer = new StringWriter();
	 * 
	 * mapper.writeValue(writer, bodyList); // String jsonString =
	 * mapper.writeValueAsString(bodyList); //
	 * System.out.println("jsonString >> "+jsonString); return
	 * postData(writer.toString());
	 * 
	 * //return postData(mapper.writeValueAsString(ehsObj));
	 * 
	 * }
	 */

	/*
	 * private EHSObjectVO getEHSObject(EHSObjectVO message, Long
	 * currentTimeMillis){ EHSObjectVO messageObject = new EHSObjectVO();
	 * ArrayList<Long> datapoint = new ArrayList<>();
	 * datapoint.add(currentTimeMillis); datapoint.add(10l); datapoint.add(1l);
	 * messageObject.setMessageId(currentTimeMillis); for (AssetBody ehsArea :
	 * message.getBody()) { AssetBody body = new AssetBody();
	 * if(ehsArea.getO3()!= null){ body.setO3(ehsArea.getO3()); }
	 * if(ehsArea.getNH3()!= null){ body.setNH3(ehsArea.getNH3()); }
	 * if(ehsArea.getNO2()!= null){ body.setNO2(ehsArea.getNO2()); }
	 * if(ehsArea.getPB()!= null){ body.setPB(ehsArea.getPB()); }
	 * if(ehsArea.getCO2()!= null){ body.setCO2(ehsArea.getCO2()); }
	 * if(ehsArea.getSO2()!= null){ body.setSO2(ehsArea.getSO2()); }
	 * if(ehsArea.getPM2_5()!= null){ body.setPM2_5(ehsArea.getPM2_5()); }
	 * if(ehsArea.getPM10()!= null){ body.setPM10(ehsArea.getPM10()); }
	 * 
	 * body.setName(ehsArea.getName()); body.getDatapoints().add(datapoint);
	 * 
	 * messageObject.getBody().add(body);
	 * 
	 * } return messageObject; }
	 */

	/*
	 * private ArrayList<HashMap<String, Object>>
	 * pickValueFromGeneratedJson(MessageObject messageObject) {
	 * ArrayList<HashMap<String, Object>> values = new ArrayList<>(); for (Body
	 * body : messageObject.getBody()) { HashMap<String, Object> innerValue =
	 * new HashMap<>(); innerValue.put("name", body.getName());
	 * innerValue.put("o3", pickOneValue(body.getO3())); innerValue.put("nh3",
	 * pickOneValue(body.getNH3())); innerValue.put("no2",
	 * pickOneValue(body.getNO2())); innerValue.put("pb",
	 * pickOneValue(body.getPB())); innerValue.put("co2",
	 * pickOneValue(body.getCO2())); innerValue.put("so2",
	 * pickOneValue(body.getSO2())); innerValue.put("pm2_5",
	 * pickOneValue(body.getPM2_5())); innerValue.put("pm10",
	 * pickOneValue(body.getPM10())); values.add(innerValue); } return values; }
	 */
	// select one of the value from the list with random index
	private Double pickOneValue(ArrayList<Double> list) {
		int index = new Random().nextInt(list.size());
		return list.get(index);
	}

	/**
	 * @return -
	 */

	List<JSONData> generateMockDataMap_RT() {
		String machineControllerId = this.applicationProperties
				.getMachineControllerId();
		List<JSONData> list = new ArrayList<JSONData>();
		JSONData data = new JSONData();
		data.setName("Compressor-2015:CompressionRatio"); //$NON-NLS-1$
		data.setTimestamp(getCurrentTimestamp());
		data.setValue((generateRandomUsageValue(2.5, 3.0) - 1) * 65535.0 / 9.0);
		data.setDatatype("DOUBLE"); //$NON-NLS-1$
		data.setRegister(""); //$NON-NLS-1$
		data.setUnit(machineControllerId);
		list.add(data);

		data = new JSONData();
		data.setName("Compressor-2015:DischargePressure"); //$NON-NLS-1$
		data.setTimestamp(getCurrentTimestamp());
		data.setValue((generateRandomUsageValue(0.0, 23.0) * 65535.0) / 100.0);
		data.setDatatype("DOUBLE"); //$NON-NLS-1$
		data.setRegister(""); //$NON-NLS-1$
		data.setUnit(machineControllerId);
		list.add(data);

		data = new JSONData();
		data.setName("Compressor-2015:SuctionPressure"); //$NON-NLS-1$
		data.setTimestamp(getCurrentTimestamp());
		data.setValue((generateRandomUsageValue(0.0, 0.21) * 65535.0) / 100.0);
		data.setDatatype("DOUBLE"); //$NON-NLS-1$
		data.setRegister(""); //$NON-NLS-1$
		data.setUnit(machineControllerId);
		list.add(data);

		data = new JSONData();
		data.setName("Compressor-2015:MaximumPressure"); //$NON-NLS-1$
		data.setTimestamp(getCurrentTimestamp());
		data.setValue((generateRandomUsageValue(22.0, 26.0) * 65535.0) / 100.0);
		data.setDatatype("DOUBLE"); //$NON-NLS-1$
		data.setRegister(""); //$NON-NLS-1$
		data.setUnit(machineControllerId);
		list.add(data);

		data = new JSONData();
		data.setName("Compressor-2015:MinimumPressure"); //$NON-NLS-1$
		data.setTimestamp(getCurrentTimestamp());
		data.setValue(0.0);
		data.setDatatype("DOUBLE"); //$NON-NLS-1$
		data.setRegister(""); //$NON-NLS-1$
		data.setUnit(machineControllerId);
		list.add(data);

		data = new JSONData();
		data.setName("Compressor-2015:Temperature"); //$NON-NLS-1$
		data.setTimestamp(getCurrentTimestamp());
		data.setValue((generateRandomUsageValue(65.0, 80.0) * 65535.0) / 200.0);
		data.setDatatype("DOUBLE"); //$NON-NLS-1$
		data.setRegister(""); //$NON-NLS-1$
		data.setUnit(machineControllerId);
		list.add(data);

		data = new JSONData();
		data.setName("Compressor-2015:Velocity"); //$NON-NLS-1$
		data.setTimestamp(getCurrentTimestamp());
		data.setValue((generateRandomUsageValue(0.0, 0.1) * 65535.0) / 0.5);
		data.setDatatype("DOUBLE"); //$NON-NLS-1$
		data.setRegister(""); //$NON-NLS-1$
		data.setUnit(machineControllerId);
		list.add(data);

		return list;
	}

	private Timestamp getCurrentTimestamp() {
		java.util.Date date = new java.util.Date();
		Timestamp ts = new Timestamp(date.getTime());
		return ts;
	}

	private static double generateRandomUsageValue(double low, double high) {
		return low + Math.random() * (high - low);
	}

	private String postData(String content) {
		HttpClient client = null;
		try {
			HttpClientBuilder builder = HttpClientBuilder.create();
			if (this.applicationProperties.getDiServiceProxyHost() != null
					&& !"".equals(this.applicationProperties.getDiServiceProxyHost()) //$NON-NLS-1$
					&& this.applicationProperties.getDiServiceProxyPort() != null
					&& !"".equals(this.applicationProperties.getDiServiceProxyPort())) //$NON-NLS-1$
			{
				HttpHost proxy = new HttpHost(
						this.applicationProperties.getDiServiceProxyHost(),
						Integer.parseInt(this.applicationProperties
								.getDiServiceProxyPort()));
				builder.setProxy(proxy);
			}
			client = builder.build();
			String serviceURL = null;
			if (this.applicationProperties.getPredixDataIngestionURL() == null) {
				serviceURL = "http://" + this.applicationProperties.getDiServiceHost() + ":" + this.applicationProperties.getDiServicePort() + "/saveTimeSeriesData"; //$NON-NLS-1$
				URLEncoder.encode(serviceURL, "UTF-8");
			} else {
				serviceURL = this.applicationProperties
						.getPredixDataIngestionURL() + "/saveTimeSeriesData"; //$NON-NLS-1$
				URLEncoder.encode(serviceURL, "UTF-8");

			}
			log.info("Service URL : " + serviceURL); //$NON-NLS-1$
			log.info("Data : " + content);
			HttpPost request = new HttpPost(serviceURL);
			HttpEntity reqEntity = MultipartEntityBuilder
					.create()
					.addTextBody("content", content) //$NON-NLS-1$
					.addTextBody("destinationId", "TimeSeries").addTextBody("clientId", "TimeSeries") //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
					.addTextBody(
							"tenantId", this.applicationProperties.getTenantId()).build(); //$NON-NLS-1$
			request.setEntity(reqEntity);
			HttpResponse response = client.execute(request);
			log.debug("Send Data to Ingestion Service : Response Code : " + response.getStatusLine().getStatusCode()); //$NON-NLS-1$
			BufferedReader rd = new BufferedReader(new InputStreamReader(
					response.getEntity().getContent()));
			StringBuffer result = new StringBuffer();
			String line = ""; //$NON-NLS-1$
			while ((line = rd.readLine()) != null) {
				result.append(line);
			}
			log.debug("Response : " + result.toString());
			if (result.toString().startsWith("You successfully posted")) { //$NON-NLS-1$
				return "SUCCESS : " + result.toString(); //$NON-NLS-1$
			}
			return "FAILED : " + result.toString(); //$NON-NLS-1$

		} catch (Throwable e) {
			log.error("unable to post data ", e); //$NON-NLS-1$
			return "FAILED : " + e.getLocalizedMessage(); //$NON-NLS-1$
		}
	}

	/*
	 * private String postData(String content) { List<NameValuePair> parameters
	 * = new ArrayList<NameValuePair>(); parameters.add(new
	 * BasicNameValuePair("content", content)); parameters.add(new
	 * BasicNameValuePair("destinationId", "TimeSeries")); parameters.add(new
	 * BasicNameValuePair("clientId", "TimeSeries")); parameters.add(new
	 * BasicNameValuePair("tenantId",
	 * this.applicationProperties.getTenantId()));
	 * 
	 * 
	 * EntityBuilder builder = EntityBuilder.create();
	 * builder.setParameters(parameters); HttpEntity reqEntity =
	 * builder.build();
	 * 
	 * String serviceURL =
	 * this.applicationProperties.getPredixDataIngestionURL(); //$NON-NLS-1$ if
	 * (serviceURL == null) { serviceURL =
	 * this.applicationProperties.getDiServiceURL(); } if (serviceURL != null) {
	 * try(CloseableHttpResponse response = restClient.post(serviceURL,
	 * reqEntity, null, 100, 1000);) {
	 * 
	 * log.info("Service URL : " + serviceURL); //$NON-NLS-1$ log.info("Data : "
	 * +content);
	 * 
	 * log.debug("Send Data to Ingestion Service : Response Code : " +
	 * response.getStatusLine().getStatusCode()); //$NON-NLS-1$ BufferedReader
	 * rd = new BufferedReader(new
	 * InputStreamReader(response.getEntity().getContent())); StringBuffer
	 * result = new StringBuffer(); String line = ""; //$NON-NLS-1$ while ((line
	 * = rd.readLine()) != null) { result.append(line); } log.info("Response : "
	 * +result.toString()); if (result.toString().startsWith(
	 * "You successfully posted")) { //$NON-NLS-1$ return "SUCCESS : "
	 * +result.toString(); //$NON-NLS-1$ } return "FAILED : "+result.toString();
	 * //$NON-NLS-1$
	 * 
	 * } catch (IOException e) { log.error("unable to post data ", e);
	 * //$NON-NLS-1$ return "FAILED : "+e.getLocalizedMessage(); //$NON-NLS-1$ }
	 * }else{ return "Dataingestion Service URL is empty."; } }
	 */
}
