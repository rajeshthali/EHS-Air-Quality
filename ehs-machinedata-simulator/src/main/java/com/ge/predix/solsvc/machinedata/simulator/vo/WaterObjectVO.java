package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WaterObjectVO {


	@JsonProperty("messageId")
	private Long messageId;
	
	@JsonProperty("body")
	private List<WaterBody> body;

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public List<WaterBody> getBody() {
		return body;
	}

	public void setBody(List<WaterBody> body) {
		this.body = body;
	}
	

}
