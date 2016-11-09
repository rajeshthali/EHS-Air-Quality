package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WasteObjectVO {
	
	@JsonProperty("messageId")
	private Long messageId;
	
	@JsonProperty("body")
	private List<WasteBody> body;

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public List<WasteBody> getBody() {
		return body;
	}

	public void setBody(List<WasteBody> body) {
		this.body = body;
	}
	

}
