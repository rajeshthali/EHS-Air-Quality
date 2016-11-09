package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EnergyObjectVO {
	
	@JsonProperty("messageId")
	private Long messageId;
	
	@JsonProperty("body")
	private List<EnergyBody> body;

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public List<EnergyBody> getBody() {
		return body;
	}

	public void setBody(List<EnergyBody> body) {
		this.body = body;
	}
	
}
