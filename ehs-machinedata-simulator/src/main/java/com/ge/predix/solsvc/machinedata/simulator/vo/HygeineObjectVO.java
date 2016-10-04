package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;


public class HygeineObjectVO {

	@JsonProperty("messageId")
	private Long messageId;
	
	@JsonProperty("body")
	private List<HygeineBody> body;

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public List<HygeineBody> getBody() {
		return body;
	}

	public void setBody(List<HygeineBody> body) {
		this.body = body;
	}
	
	
}
