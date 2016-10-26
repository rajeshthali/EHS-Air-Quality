package com.tcs.ehs.web.api;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Sarath Muraleedharan
 *
 */
@RestController
public class DemoController {
	@RequestMapping(value = "/echo", method = RequestMethod.GET)
	public ResponseEntity<Map<String, Object>> index(@RequestParam(value = "echo", defaultValue = "echo this text") String echo) {
		Map<String, Object> map = new HashMap<>();
		map.put("message", "Greetings from Predix Spring Boot! echo=" + echo + " " + (new Date()));
		return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
	}


	@RequestMapping(value = "/health", method = RequestMethod.GET)
	public ResponseEntity<Map<String, Object>> health() {
		Map<String, Object> map = new HashMap<>();
		map.put("status", "up");
		map.put("date", new Date());
		return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
	}

}
