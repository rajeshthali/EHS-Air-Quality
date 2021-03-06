package com.ge.predix.solsvc.machinedata.simulator;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
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
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ge.predix.entity.timeseries.datapoints.ingestionrequest.Body;
import com.ge.predix.entity.timeseries.datapoints.ingestionrequest.DatapointsIngestion;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants.AQI;
import com.ge.predix.solsvc.machinedata.simulator.config.Constants.Water;
import com.ge.predix.solsvc.machinedata.simulator.vo.AQIAttributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.AQIBody;
import com.ge.predix.solsvc.machinedata.simulator.vo.AQIObjectVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.EnergyAtrributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.EnergyBody;
import com.ge.predix.solsvc.machinedata.simulator.vo.EnergyObjectVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.FloorAttributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.FloorBodyVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.FloorObjectVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.HygeineAtrributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.HygeineBody;
import com.ge.predix.solsvc.machinedata.simulator.vo.HygeineObjectVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.WasteAtrributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.WasteBody;
import com.ge.predix.solsvc.machinedata.simulator.vo.WasteObjectVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.WaterAtrributesVO;
import com.ge.predix.solsvc.machinedata.simulator.vo.WaterBody;
import com.ge.predix.solsvc.machinedata.simulator.vo.WaterObjectVO;
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
	
	public static float data=(float) 1.0009;
	

	/**
	 * -
	 */
	@Scheduled(fixedDelayString = "${dataingestion.sleepTimeMillis}")
	public void run() {

		try {

			generateAndPushRandomAreaData();

			generateAndPushRandomMachineData();

			generateAndPushRandomHygieneData();

			//amlesh
			generateAndPushRandomWaterData();

			generateAndPushRandomWasteData();

			generateAndPushRandomEnergyData();

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
	/*@SuppressWarnings("unchecked")
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

	}*/

	/*@SuppressWarnings("unchecked")
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

	}*/

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
		for (Constants.AQI name : Constants.AQI.values()) {
			//PM10, PM2_5,NO2, O3, CO, SO2, NH3, PB - Machine AQI
			//PM10, O3, CO, NH3, PB - AREA AQI
			if(name == AQI.PM2_5 || name == AQI.SO2 || name == AQI.NO2) {
				continue;
			}
			createFloorwiseAreaBody(aqiBodyList, Constants.AREA_ASSET_FLR_0, Constants.GRND_FLOOR, name);
			createFloorwiseAreaBody(aqiBodyList, Constants.AREA_ASSET_FLR_1, Constants.FIRST_FLOOR, name);
			createFloorwiseAreaBody(aqiBodyList, Constants.AREA_ASSET_FLR_2, Constants.SECOND_FLOOR, name);
		}
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

	private AQIBody generateAreaData(int floorNo, String areaAssetName, Constants.AQI name) {

		Long currentTimeMillis = System.currentTimeMillis();

		AQIBody aqiAreaBody = getRandomAQIDataVO(currentTimeMillis, "AQI-Area", true, areaAssetName, floorNo, name);

		return aqiAreaBody;
	}

	private String generateAndPushRandomMachineData()
			throws JsonGenerationException, JsonMappingException, IOException {
		Long currentTimeMillis = System.currentTimeMillis();

		AQIObjectVO aqiObjVO = new AQIObjectVO();
		List<AQIBody> aqiBodyList = new ArrayList<>();

		for (Constants.AQI name : Constants.AQI.values()) {
			createFloorwiseMachineBody(aqiBodyList, Constants.MCHN_ASSET_FLR_0, Constants.GRND_FLOOR,name);
			createFloorwiseMachineBody(aqiBodyList, Constants.MCHN_ASSET_FLR_1, Constants.FIRST_FLOOR,name);
			createFloorwiseMachineBody(aqiBodyList, Constants.MCHN_ASSET_FLR_2, Constants.SECOND_FLOOR,name);
		}

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

	private AQIBody generateMachineData(int floorNo, String machineAssetName, Constants.AQI name) {

		Long currentTimeMillis = System.currentTimeMillis();

		AQIBody aqiAreaBody = getRandomAQIDataVO(currentTimeMillis, "AQI-Machine", false, machineAssetName, floorNo, name);

		return aqiAreaBody;

	}

	private String generateAndPushRandomHygieneData()
			throws JsonGenerationException, JsonMappingException, IOException {

		Long currentTimeMillis = System.currentTimeMillis();
		List<HygeineBody> hygBodyList = new ArrayList<>();
		for (Constants.Hygiene name : Constants.Hygiene.values()) {
			createFloorwiseHygieneBody(hygBodyList, Constants.HYG_ASSET_FLR_0, Constants.GRND_FLOOR,name);
			createFloorwiseHygieneBody(hygBodyList, Constants.HYG_ASSET_FLR_1, Constants.FIRST_FLOOR,name);
			createFloorwiseHygieneBody(hygBodyList, Constants.HYG_ASSET_FLR_2, Constants.SECOND_FLOOR,name);
		}

		/*for (Constants.Water name : Constants.Water.values()) {
			createFloorwiseWaterBody(watBodyList, Constants.WATER_TYPE, Constants.GRND_FLOOR, name);
			createFloorwiseWaterBody(watBodyList, Constants.WATER_TYPE, Constants.FIRST_FLOOR, name);
			createFloorwiseWaterBody(watBodyList, Constants.WATER_TYPE, Constants.SECOND_FLOOR, name);
		}*/

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

	//amlesh
	private String generateAndPushRandomWaterData()
			throws JsonGenerationException, JsonMappingException, IOException {

		Long currentTimeMillis = System.currentTimeMillis();
		List<WaterBody> watBodyList = new ArrayList<>();

		for (Constants.Water name : Constants.Water.values()) {
			createFloorwiseWaterBody(watBodyList, Constants.WATER_TYPE, Constants.GRND_FLOOR, name);//2
			createFloorwiseWaterBody(watBodyList, Constants.WATER_TYPE, Constants.FIRST_FLOOR, name);//2
			createFloorwiseWaterBody(watBodyList, Constants.WATER_TYPE, Constants.SECOND_FLOOR, name);//2
		}

		WaterObjectVO waterObjVO=new WaterObjectVO();
		waterObjVO.setBody(watBodyList);
		waterObjVO.setMessageId(currentTimeMillis);


		DatapointsIngestion dataPtIngest = createWaterDataIngestionRequest(waterObjVO);
		StringWriter writer = new StringWriter();

		mapper.writeValue(writer, dataPtIngest);
		System.out.println("Final Water JSON sending to saveTimeSeries >> "
				+ writer.toString()+"----------------->>>>>>");
		return postData(writer.toString());

	}


	private String generateAndPushRandomWasteData()
			throws JsonGenerationException, JsonMappingException, IOException {

		Long currentTimeMillis = System.currentTimeMillis();
		List<WasteBody> wasteBodyList = new ArrayList<>();

		for (Constants.Waste name : Constants.Waste.values()) {
			createFloorwiseWasteBody(wasteBodyList, Constants.GRND_FLOOR, name);
			createFloorwiseWasteBody(wasteBodyList, Constants.FIRST_FLOOR, name);
			createFloorwiseWasteBody(wasteBodyList, Constants.SECOND_FLOOR, name);

		}		

		WasteObjectVO wasteObjVO=new WasteObjectVO();
		wasteObjVO.setBody(wasteBodyList);
		wasteObjVO.setMessageId(currentTimeMillis);

		DatapointsIngestion dataPtIngest = createWasteDataIngestionRequest(wasteObjVO);
		StringWriter writer = new StringWriter();

		mapper.writeValue(writer, dataPtIngest);
		System.out.println("Final Waste JSON sending to saveTimeSeries >> "
				+ writer.toString());
		return postData(writer.toString());

	}

	private String generateAndPushRandomEnergyData()
			throws JsonGenerationException, JsonMappingException, IOException {

		Long currentTimeMillis = System.currentTimeMillis();
		List<EnergyBody> energyBodyList = new ArrayList<>();

		for (Constants.Energy name : Constants.Energy.values()) {
			createFloorwiseEnergyBody(energyBodyList,Constants.GRND_FLOOR, name);
			createFloorwiseEnergyBody(energyBodyList,Constants.FIRST_FLOOR, name);
			createFloorwiseEnergyBody(energyBodyList,Constants.SECOND_FLOOR, name);
		}		

		EnergyObjectVO energyObjVO=new EnergyObjectVO();
		energyObjVO.setBody(energyBodyList);
		energyObjVO.setMessageId(currentTimeMillis);

		DatapointsIngestion dataPtIngest = createEnergyDataIngestionRequest(energyObjVO);
		StringWriter writer = new StringWriter();

		mapper.writeValue(writer, dataPtIngest);
		System.out.println("Final Hygiene JSON sending to saveTimeSeries >> "
				+ writer.toString());
		return postData(writer.toString());

	}

	private void createFloorwiseHygieneBody(List<HygeineBody> hygBodyList, String[] assetArray, int floorNo,  Constants.Hygiene name) {
		for(int i=0; i < assetArray.length; i++){
			HygeineBody hygBody = generateHygieneData(floorNo, assetArray[i], name);
			hygBodyList.add(hygBody);
		}
	}

	//amlesh
	private void createFloorwiseWaterBody(List<WaterBody> watBodyList, String[] assetArray, int floorNo, Constants.Water name) {
		for(int i=0; i < assetArray.length; i++){
			WaterBody watBody = generateWaterData(floorNo, assetArray[i], name);
			watBodyList.add(watBody);
		}
	}


	private void createFloorwiseWasteBody(List<WasteBody> wasteBodyList, int floorNo, Constants.Waste name) {
		//for(int i=0; i < assetArray.length; i++){
		WasteBody wasteBody = generateWasteData(floorNo, name);
		wasteBodyList.add(wasteBody);
		//}
	}

	private void createFloorwiseEnergyBody(List<EnergyBody> energyBodyList, int floorNo, Constants.Energy name) {
		//for(int i=0; i < assetArray.length; i++){
		EnergyBody energyBody = generateEnergyData(floorNo, name);
		energyBodyList.add(energyBody);
		//}
	}

	private void createFloorwiseAreaBody(List<AQIBody> aqiBodyList, String[] assetArray, int floorNo, Constants.AQI name) {
		for(int i=0; i < assetArray.length; i++){
			AQIBody aqiBody = generateAreaData(floorNo, assetArray[i], name);
			aqiBodyList.add(aqiBody);
		}
	}

	private void createFloorwiseMachineBody(List<AQIBody> aqiBodyList, String[] assetArray, int floorNo, Constants.AQI name) {
		for(int i=0; i < assetArray.length; i++){
			AQIBody machineBody = generateMachineData(floorNo, assetArray[i],name);
			aqiBodyList.add(machineBody);
		}
	}

	private HygeineBody generateHygieneData(int floorNo, String hygAssetName, Constants.Hygiene name) {
		Long currentTimeMillis = System.currentTimeMillis();

		HygeineBody hygBodyVo = createHygieneBodyVO(floorNo,currentTimeMillis, "Hygiene",hygAssetName, name);

		return hygBodyVo;
	}

	//amlesh
	private WaterBody generateWaterData(int floorNo, String watAssetName, Constants.Water name) {
		Long currentTimeMillis = System.currentTimeMillis();

		WaterBody watBodyVo = createWaterBodyVO(floorNo,currentTimeMillis, "Water",watAssetName, name);
		System.out.println("+++++++++++++++++"+watBodyVo.getAttributes().getName()+"========================");
		return watBodyVo;
	}

	private WasteBody generateWasteData(int floorNo, Constants.Waste name) {
		Long currentTimeMillis = System.currentTimeMillis();

		WasteBody wasteBodyVo = createWasteBodyVO(floorNo,currentTimeMillis, "Waste",name);

		return wasteBodyVo;
	}

	private EnergyBody generateEnergyData(int floorNo, Constants.Energy name) {
		Long currentTimeMillis = System.currentTimeMillis();

		EnergyBody energyBodyVo = createEnergyBodyVO(floorNo,currentTimeMillis, "Energy", name);

		return energyBodyVo;
	}

	private HygeineBody createHygieneBodyVO(int floorNo,Long currentTimeMillis,
			String bodyName, String hygieneArea, Constants.Hygiene name) {
		HygeineBody hygBodyVo = new HygeineBody();
		hygBodyVo.setName(bodyName);

		ArrayList<Long> datapoint = new ArrayList<Long>();
		datapoint.add(currentTimeMillis);
		datapoint.add(getHygeineValues(name));
		datapoint.add(1l);

		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		hygBodyVo.setDatapoints(datapoints);

		HygeineAtrributesVO hygAttVO = new HygeineAtrributesVO();

		hygAttVO.setFloor(floorNo);
		hygAttVO.setAssetName(hygieneArea);
		hygAttVO.setName(name);
		/*hygAttVO.setHumidity(getHygeineValues(Constants.Hygiene.HUMIDITY));
		hygAttVO.setNoise(getHygeineValues(Constants.Hygiene.NOISE));
		hygAttVO.setTemperature(getHygeineValues(Constants.Hygiene.TEMPERATURE));*/

		hygBodyVo.setAttributes(hygAttVO);
		return hygBodyVo;
	}

	//amlesh
	private WaterBody createWaterBodyVO(int floorNo,Long currentTimeMillis,
			String bodyName, String watAssetName, Constants.Water name) {
		WaterBody watBodyVo = new WaterBody();

		watBodyVo.setName(bodyName);
		long values=0;
		ArrayList<Long> datapoint = new ArrayList<Long>();
		
		datapoint.add(currentTimeMillis);

		values=getHWaterValues(name,currentTimeMillis);
	
	
		datapoint.add(values);
	
		datapoint.add(1l);

		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		watBodyVo.setDatapoints(datapoints);

		WaterAtrributesVO watAttVO = new WaterAtrributesVO();

		watAttVO.setFloor(floorNo);
		watAttVO.setAssetName(watAssetName);

		watAttVO.setName(name);

		watBodyVo.setAttributes(watAttVO);
		return watBodyVo;
	}


	private WasteBody createWasteBodyVO(int floorNo,Long currentTimeMillis,
			String bodyName, Constants.Waste name) {
		WasteBody wasteBodyVo = new WasteBody();

		wasteBodyVo.setName(bodyName);

		ArrayList<Long> datapoint = new ArrayList<Long>();
		datapoint.add(currentTimeMillis);

		datapoint.add(getWasteValues(name));

		datapoint.add(1l);

		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		wasteBodyVo.setDatapoints(datapoints);

		WasteAtrributesVO wasteAttVO = new WasteAtrributesVO();

		wasteAttVO.setFloor(floorNo);

		wasteAttVO.setName(name);

		wasteBodyVo.setAttributes(wasteAttVO);
		return wasteBodyVo;
	}

	private EnergyBody createEnergyBodyVO(int floorNo,Long currentTimeMillis,
			String bodyName,Constants.Energy name) {
		EnergyBody energyBodyVo = new EnergyBody();

		energyBodyVo.setName(bodyName);

		ArrayList<Long> datapoint = new ArrayList<Long>();
		datapoint.add(currentTimeMillis);

		datapoint.add(getEnergyValues(name));

		datapoint.add(1l);

		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		energyBodyVo.setDatapoints(datapoints);

		EnergyAtrributesVO energyAttVO = new EnergyAtrributesVO();

		energyAttVO.setFloor(floorNo);

		energyAttVO.setName(name);

		energyBodyVo.setAttributes(energyAttVO);
		return energyBodyVo;
	}


	private Long getHygeineValues(Constants.Hygiene hygiene) {
		Long values = new Long(0);
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
		values = (long) ((long) result / 1000L);
		return values;
	}

	//amlesh
	private Long getHWaterValues(Constants.Water name,Long currentTimeMillis) {
		Long values = new Long(0);
		Long v = new Long(0);
		int flag=0;
		Random r = new Random();
		int minLimit = 0;
		int maxLimit = 0;
		int result;
		switch (name) {
		case PH_VALUE:
			minLimit = 0;
			maxLimit = 28;
			break;
		case BOD:
			minLimit = 0;
			maxLimit = 500;
			break;
		case COD:
			minLimit = 0;
			maxLimit = 1000;
			break;
		case SUSPENDED_SOLIDS:
			minLimit = 0;
			maxLimit = 250;
			break;	
		case OIL_GREASE:
			minLimit = 0;
			maxLimit = 100;
			break;
		case KLD:
			minLimit = 0;
			maxLimit = 16;
			System.out.println("Inside KLD");
			v=getKLDWaterValues(currentTimeMillis);
			flag=1;
			break;
		default:
			log.info("----------------------kld is missing -------------------------------------------------");
			break;
		}
		result = r.nextInt(maxLimit - minLimit) + minLimit;		
		values = (long) ((long) result / 2);
		if(flag==1)
		{
			values=v;
		}
		return values;
	}
//soumya
private long getKLDWaterValues(Long currentTimeMillis)
{
	//System.out.println(System.currentTimeMillis());	
		//final long timestamp = new Date().getTime();

		// with java.util.Date/Calendar api
		final Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(currentTimeMillis);
		// here's how to get the minutes
		final int d = cal.get(Calendar.DAY_OF_WEEK);
		final int min = cal.get(Calendar.MINUTE);
		final int h = cal.get(Calendar.HOUR_OF_DAY);
		// and here's how to get the String representation
		
		//System.out.println(getValuesKLD(d, h, min));
		return getValuesKLD(d, h, min);
}
public static long getValuesKLD(int d, int h, int min) {
	
	//String data=testRead();
	System.out.println(data+" ----");
	Random r=new Random();
	long finalkld=0;
	
	float kld=data;
	/*if(h==23 && (min==59||min==58) )
	{
		data=(float) 0.02;
		kld=data;
		
	}*/
	if(kld>=8.9 || data>=8.9)
	{
		data=(float) 1.0009;
		kld=(float) 1.0009;
		System.out.println("Hello!!!!!!!!!!!!!!!!!!");
	}
	if (d == 7 || d == 1) 
	{
		
		int n=r.nextInt(10-0);
		float result=(float) (n*0.00009);
		kld=kld+result;
		finalkld=getfinalkld(kld);
	} 
	else 
	{
		if(h>6 && h<=18)
		{
		int n=r.nextInt(10-0);
		float result=(float) (n*0.0001);
		kld=kld+result;
		finalkld=getfinalkld(kld);
		}
		else
		{
			int n=r.nextInt(10-0);
			float result=(float) (n*0.00009);
			kld=kld+result;
			finalkld=getfinalkld(kld);
		}
	}
/*String finalData=Float.toString(kld);
textWrite(finalData);*/
	data=kld;
	System.out.println("data is="+data);
	return finalkld;

}
public static long getfinalkld(double kld)
{
	long finalkld;
	double fPart;
	String f;
	finalkld = (long) kld;
	fPart =  (kld - finalkld);
	System.out.println("Integer part = " + finalkld);
	f=Double.toString(fPart);
	f=f.substring(f.indexOf(".")+1,7);
	System.out.println("final fraction part is=  "+f);
	f=finalkld+f;
	finalkld=Long.parseLong(f);
	System.out.println("final long part is=  "+finalkld);
	return finalkld;
}
/*public static void textWrite(String finalData) {
	try {

		String content = finalData;

		File file = new File("Water.txt");

		// if file doesnt exists, then create it
		if (!file.exists()) {
			file.createNewFile();
		}
		
		FileWriter fw = new FileWriter(file.getAbsoluteFile());
		BufferedWriter bw = new BufferedWriter(fw);
		bw.write(content);
		bw.close();

		System.out.println("Done");

	} catch (IOException e) {
		e.printStackTrace();
	}
}
public static String testRead() {

	BufferedReader br = null;
	String sCurrentLine=null;
	try {

		

		br = new BufferedReader(new FileReader("Water.txt"));

		while ((sCurrentLine = br.readLine()) != null) {
			System.out.println("value inside fuction"+sCurrentLine);
		}
		sCurrentLine=br.readLine();
		System.out.println("just before return "+sCurrentLine);
		return sCurrentLine;
	
	
	} catch (IOException e) 
	{
		e.printStackTrace();
		return sCurrentLine;
	} finally 
	{
		try {
			if (br != null)br.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

}*/


	private Long getWasteValues(Constants.Waste name) {
		Long values = new Long(0);
		Random r = new Random();
		int minLimit = 0;
		int maxLimit = 0;
		switch (name) {
		case SOLDER_DROSS:
			minLimit = 10;
			maxLimit = 100;
			break;
		case USED_OIL:
			minLimit = 50;
			maxLimit = 1000;
			break;
		case DISCARDED_CONTAINERS:
			minLimit = 40;
			maxLimit = 500;
			break;
		default:
			break;
		}
		int result = r.nextInt(maxLimit - minLimit) + minLimit;
		values = (long) ((long) result / 10);
		return values;
	}


	private Long getEnergyValues(Constants.Energy name) {
		Long values = new Long(0);
		Random r = new Random();
		int minLimit = 0;
		int maxLimit = 0;
		switch (name) {
		case SMTLine1:
			minLimit = 0;
			maxLimit = 200;
			break;
		case SMTLine2:
			minLimit = 0;
			maxLimit = 400;
			break;
		case ProductionGroundFloor:
			minLimit = 0;
			maxLimit = 600;
			break;
		default:
			break;
		}
		int result = r.nextInt(maxLimit - minLimit) + minLimit;
		values = (long) ((long) result / 10);
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

			if(aqiAttributes.getName() != null){
				map.put("name", String.valueOf(aqiAttributes.getName()));
			}


			/*if (aqiAttributes.getCO() != null) {
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
			}*/

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

			if(hygAttributes.getName() != null){
				map.put("name", String.valueOf(hygAttributes.getName()));
			}

			/*if(hygAttributes.getHumidity() != null){
			map.put("humidity", String.valueOf(hygAttributes.getHumidity()));
			}
			if(hygAttributes.getNoise() != null){
			map.put("noise", String.valueOf(hygAttributes.getNoise()));
			}
			if(hygAttributes.getTemperature() != null){
				map.put("temperature", String.valueOf(hygAttributes.getTemperature()));
			}*/

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

	//amlesh

	@SuppressWarnings("unchecked")
	private DatapointsIngestion createWaterDataIngestionRequest(
			WaterObjectVO inputObj)
					throws com.fasterxml.jackson.core.JsonParseException,
					com.fasterxml.jackson.databind.JsonMappingException, IOException {

		DatapointsIngestion dpIngestion = new DatapointsIngestion();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		dpIngestion.setMessageId(String.valueOf(calendar.getTimeInMillis()));
		List<Body> bodies = new ArrayList<Body>();

		List<WaterBody> waterBodies = inputObj.getBody();
		for (WaterBody waterBody : waterBodies) {
			WaterAtrributesVO waterAttributes = waterBody.getAttributes();
			ArrayList<ArrayList<Long>> waterDatapoints = waterBody.getDatapoints();
			String waterBodyName = waterBody.getName();
			Body body = new Body();
			body.setName(waterBodyName);

			List<Object> datapoints = new ArrayList<Object>();
			List<Object> assetDatapoint = new ArrayList<Object>();
			assetDatapoint.add(String.valueOf(calendar.getTimeInMillis()));
			assetDatapoint.add(waterDatapoints.get(0).get(1));
			assetDatapoint.add(waterDatapoints.get(0).get(2));

			datapoints.add(assetDatapoint);

			body.setDatapoints(datapoints);

			com.ge.predix.entity.util.map.Map map = new com.ge.predix.entity.util.map.Map();
			if(waterAttributes.getAssetName() != null){
				map.put("assetname", String.valueOf(waterAttributes.getAssetName()));
			}
			map.put("floorNo", String.valueOf(waterAttributes.getFloor()));

			if(waterAttributes.getName() != null){
				map.put("name", String.valueOf(waterAttributes.getName()));
			}

			body.setAttributes(map);
			bodies.add(body);

		}

		dpIngestion.setBody(bodies);

		return dpIngestion;

	}


	//waste
	@SuppressWarnings("unchecked")
	private DatapointsIngestion createWasteDataIngestionRequest(
			WasteObjectVO inputObj)
					throws com.fasterxml.jackson.core.JsonParseException,
					com.fasterxml.jackson.databind.JsonMappingException, IOException {

		DatapointsIngestion dpIngestion = new DatapointsIngestion();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		dpIngestion.setMessageId(String.valueOf(calendar.getTimeInMillis()));
		List<Body> bodies = new ArrayList<Body>();

		List<WasteBody> wasteBodies = inputObj.getBody();
		for (WasteBody wasteBody : wasteBodies) {
			WasteAtrributesVO wasteAttributes = wasteBody.getAttributes();
			ArrayList<ArrayList<Long>> wasteDatapoints = wasteBody.getDatapoints();
			String wasteBodyName = wasteBody.getName();
			Body body = new Body();
			body.setName(wasteBodyName);

			List<Object> datapoints = new ArrayList<Object>();
			List<Object> assetDatapoint = new ArrayList<Object>();
			assetDatapoint.add(String.valueOf(calendar.getTimeInMillis()));
			assetDatapoint.add(wasteDatapoints.get(0).get(1));
			assetDatapoint.add(wasteDatapoints.get(0).get(2));

			datapoints.add(assetDatapoint);

			body.setDatapoints(datapoints);

			com.ge.predix.entity.util.map.Map map = new com.ge.predix.entity.util.map.Map();
			if(wasteAttributes.getAssetName() != null){
				map.put("assetname", String.valueOf(wasteAttributes.getAssetName()));
			}

			map.put("floorNo", String.valueOf(wasteAttributes.getFloor()));

			if(wasteAttributes.getName() != null){
				map.put("name", String.valueOf(wasteAttributes.getName()));
			}

			body.setAttributes(map);
			bodies.add(body);

		}

		dpIngestion.setBody(bodies);

		return dpIngestion;

	}


	//Energy
	@SuppressWarnings("unchecked")
	private DatapointsIngestion createEnergyDataIngestionRequest(
			EnergyObjectVO inputObj)
					throws com.fasterxml.jackson.core.JsonParseException,
					com.fasterxml.jackson.databind.JsonMappingException, IOException {

		DatapointsIngestion dpIngestion = new DatapointsIngestion();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		dpIngestion.setMessageId(String.valueOf(calendar.getTimeInMillis()));
		List<Body> bodies = new ArrayList<Body>();

		//
		List<EnergyBody> energyBodies = inputObj.getBody();
		for (EnergyBody energyBody : energyBodies) {
			EnergyAtrributesVO energyAttributes = energyBody.getAttributes();
			ArrayList<ArrayList<Long>> energyDatapoints = energyBody.getDatapoints();
			String energyBodyName = energyBody.getName();
			Body body = new Body();
			body.setName(energyBodyName);

			List<Object> datapoints = new ArrayList<Object>();
			List<Object> assetDatapoint = new ArrayList<Object>();
			assetDatapoint.add(String.valueOf(calendar.getTimeInMillis()));
			assetDatapoint.add(energyDatapoints.get(0).get(1));
			assetDatapoint.add(energyDatapoints.get(0).get(2));

			datapoints.add(assetDatapoint);

			body.setDatapoints(datapoints);

			com.ge.predix.entity.util.map.Map map = new com.ge.predix.entity.util.map.Map();
			if(energyAttributes.getAssetName() != null){
				map.put("assetname", String.valueOf(energyAttributes.getAssetName()));
			}

			map.put("floorNo", String.valueOf(energyAttributes.getFloor()));

			if(energyAttributes.getName() != null){
				map.put("name", String.valueOf(energyAttributes.getName()));
			}

			body.setAttributes(map);
			bodies.add(body);

		}

		dpIngestion.setBody(bodies);

		return dpIngestion;

	}



	private AQIBody getRandomAQIDataVO(Long currentTimeMillis, String bodyName,
			boolean areaRequest,String areaAssetName, int floorNo, Constants.AQI name){

		AQIBody aqiBodyVo = new AQIBody();

		aqiBodyVo.setName(bodyName);

		ArrayList<Long> datapoint = new ArrayList<>();
		datapoint.add(currentTimeMillis);
		datapoint.add(getValues(name));
		datapoint.add(1l);
		ArrayList<ArrayList<Long>> datapoints = new ArrayList<>();
		datapoints.add(datapoint);
		aqiBodyVo.setDatapoints(datapoints);

		AQIAttributesVO aqiAttVO = new AQIAttributesVO();
		aqiAttVO.setAssetName(areaAssetName);
		aqiAttVO.setFloor(floorNo);
		aqiAttVO.setName(name);
		/*if (areaRequest) {
			aqiAttVO.setCO(getValues(Constants.AQI.CO));
			aqiAttVO.setO3(getValues(Constants.AQI.O3));
			aqiAttVO.setNH3(getValues(Constants.AQI.NH3));
			aqiAttVO.setPB(getValues(Constants.AQI.PB));
			aqiAttVO.setPM10(getValues(Constants.AQI.PM10));
		}

		aqiAttVO.setNO2(getValues(Constants.AQI.NO2));
		aqiAttVO.setPM2_5(getValues(Constants.AQI.PM2_5));
		aqiAttVO.setSO2(getValues(Constants.AQI.SO2));*/


		aqiBodyVo.setAttributes(aqiAttVO);

		return aqiBodyVo;
	}

	
	public Long getValues(Constants.AQI aqiField) {
	    Long values = new Long(0);
		Random r = new Random();
		int minLimit = 0;
		int maxLimit = 50;
		long time=System.currentTimeMillis();
		int result=0;
		switch (aqiField) {
		case O3:
			minLimit = 10;
			maxLimit = 50;

			if(time%10==5)
				 result=get_O3('m');
			else if(time%10==4)
				 result=get_O3('p');
			else if(time%10==1)
				 result=get_O3('s');
			else if(time%10==2)
				 result=get_O3('S');
			else if(time%10==7)
				 result=get_O3('g');
			else if(time%10==3)
				 result=get_O3('g');
			else
				 result = r.nextInt(maxLimit - minLimit) + minLimit;
			
			break;
		case NH3:
			minLimit = 10;
			maxLimit = 50;
			
			
			if(time%10==2)
				 result=get_NH3('m');
			else if(time%10==7)
				 result=get_NH3('p');
			else if(time%10==9)
				 result=get_NH3('s');
			else if(time%10==0)
				 result=get_NH3('S');
			else if(time%10==1)
				 result=get_NH3('g');
			else if(time%10==3)
				 result=get_NH3('g');
			else
				 result = r.nextInt(maxLimit - minLimit) + minLimit;
			
			
			break;
		case NO2:
			minLimit = 10;
			maxLimit = 50;
			if(time%10==1)
				 result=get_NO2('m');
			else if(time%10==3)
				 result=get_NO2('p');
			else if(time%10==5)
				 result=get_NO2('s');
			else if(time%10==9)
				 result=get_NO2('S');
			else if(time%10==6)
				 result=get_NO2('g');
			else if(time%10==3)
				 result=get_NO2('g');
			else
				 result = r.nextInt(maxLimit - minLimit) + minLimit;
			break;
		
		
		case SO2:
			minLimit = 10;
			maxLimit = 50;
			
			if(time%10==2)
				 result=get_SO2('m');
			else if(time%10==5)
				 result=get_SO2('p');
			else if(time%10==7)
				 result=get_SO2('s');
			else if(time%10==1)
				 result=get_SO2('S');
			else if(time%10==4)
				 result=get_NO2('g');
			else if(time%10==3)
				 result=get_SO2('g');
			else
				 result = r.nextInt(maxLimit - minLimit) + minLimit;
			break;
		case PM2_5:
			minLimit = 10;
			maxLimit = 30;
			
			if(time%10==2)
				 result=get_PM2_5('m');
			else if(time%10==0)
				 result=get_PM2_5('p');
			else if(time%10==3)
				 result=get_PM2_5('s');
			else if(time%10==7)
				 result=get_PM2_5('S');
			else if(time%10==5)
				 result=get_PM2_5('g');
			else if(time%10==3)
				 result=get_PM2_5('g');
			else
				 result = r.nextInt(maxLimit - minLimit) + minLimit;
			
			break;
		case PM10:
			minLimit = 10;
			maxLimit = 20;
			
			if(time%10==7)
				 result=get_PM10('m');
			else if(time%10==5)
				 result=get_PM10('p');
			else if(time%10==1)
				 result=get_PM10('s');
			else if(time%10==4)
				 result=get_PM10('S');
			else if(time%10==8)
				 result=get_PM10('g');
			else if(time%10==3)
				 result=get_PM10('g');
			else
				 result = r.nextInt(maxLimit - minLimit) + minLimit;
			
			break;
		case CO:
			minLimit = 1;
			maxLimit = 2;
			result = r.nextInt(maxLimit - minLimit) + minLimit;
			if(time%10==5)
				result = r.nextInt(3 - 1)+1;
			else if (time%10==3)
				result=r.nextInt(2);
			break;
		case PB:
			minLimit = 1;
			maxLimit = 2;
			result = r.nextInt(maxLimit - minLimit);
			if(time%10==5)
				result = r.nextInt(2 - 1)+1;
			else if (time%10==6)
				result=r.nextInt(3);
			else if (time%10==7||time%10==7)
				result=r.nextInt(3);
			break;


		default:
			break;
		}
	values=(long) result;

		

		return values;
	} 

public int get_NO2(char ch) {
	int result = 0;
	Random r = new Random();
	if (ch == 'm')
		result = r.nextInt(180 - 81) + 101;
	else if (ch == 's')
		result = r.nextInt(80 - 41) + 71;
	else if (ch == 'g')

		result = r.nextInt(90);

	else if (ch == 'p')
		result = r.nextInt(280 - 181) + 181;
	else if (ch == 'v')
		result = r.nextInt(400 - 280) + 280;
	else if (ch == 'S')
		result = r.nextInt(800 - 401) + 401;

	// System.out.println("========result==="+result);
	return result;
}

public static int get_PM10(char ch) {

	int result = 0;
	Random r = new Random();
	if (ch == 'm')
		result = r.nextInt(250 - 101) + 10;
	else if (ch == 's')
		result = r.nextInt(100 - 51) + 71;
	else if (ch == 'g')
		result = r.nextInt(50);
	else if (ch == 'p')
		result = r.nextInt(280 - 181) + 181;
	else if (ch == 'S')
		result = r.nextInt(800 - 431) + 131;
	else if (ch == 'v')
		result = r.nextInt(430 - 351) + 351;
	return result;
}

public static int get_PM2_5(char ch) {

	int result = 0;
	Random r = new Random();
	if (ch == 'm')

		result = r.nextInt(130 - 61) + 41;

	else if (ch == 's')

		result = r.nextInt(60 - 31) + 31;

	else if (ch == 'g')
		result = r.nextInt(70);
	else if (ch == 'p')
		result = r.nextInt(120 - 91) + 91;
	else if (ch == 'v')
		result = r.nextInt(250 - 121) + 121;
	else if (ch == 'S')
		result = r.nextInt(800 - 431);

	return result;
}

public static int get_O3(char ch) {

	int result = 0;
	Random r = new Random();
	if (ch == 'm')
		result = r.nextInt(168 - 101) + 101;
	else if (ch == 's')
		result = r.nextInt(100 - 51) + 51;
	else if (ch == 'g')
		result = r.nextInt(50);
	else if (ch == 'p')
		result = r.nextInt(208 - 169) + 169;
	else if (ch == 'v')
		result = r.nextInt(748 - 209) + 209;
	else if (ch == 'S')
		result = r.nextInt(800);
	return result;
}

public static int get_SO2(char ch) {

	int result = 0;
	Random r = new Random();
	if (ch == 'm')
		result = r.nextInt(380 - 81) + 81;
	else if (ch == 's')
		result = r.nextInt(80 - 41) + 41;
	else if (ch == 'g')
		result = r.nextInt(40);
	else if (ch == 'p')
		result = r.nextInt(800 - 381) + 381;
	else if (ch == 'v')
		result = r.nextInt(1600 - 801) + 801;
	else if (ch == 'S')
		result = r.nextInt(2000);

	return result;
}

public static int get_NH3(char ch) {

	int result = 0;
	Random r = new Random();
	if (ch == 'm')
		result = r.nextInt(800 - 401) + 401;
	else if (ch == 's')
		result = r.nextInt(400 - 201) + 201;
	else if (ch == 'g')
		result = r.nextInt(60 - 10)+140;
	else if (ch == 'p')
		result = r.nextInt(1200 - 801) + 801;
	else if (ch == 'v')
		result = r.nextInt(1800 - 1201) + 1201;
	else if (ch == 'S')
		result = r.nextInt(1801);
	return result;
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
				return "SUCCESS ::::: " + result.toString(); //$NON-NLS-1$
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
