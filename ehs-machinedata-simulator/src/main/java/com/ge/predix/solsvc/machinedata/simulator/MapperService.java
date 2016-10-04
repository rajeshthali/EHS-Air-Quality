package com.ge.predix.solsvc.machinedata.simulator;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ge.predix.solsvc.machinedata.simulator.vo.EHSObjectVO;

@Component
public class MapperService {
	@Autowired
	private ResourceLoader resourceLoader;

	public EHSObjectVO parse(String jsonFileName) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		//mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		Resource resource = resourceLoader.getResource("classpath:"+jsonFileName);
		File jsonFile = resource.getFile();
		return mapper.readValue(jsonFile, EHSObjectVO.class);
	}
}
