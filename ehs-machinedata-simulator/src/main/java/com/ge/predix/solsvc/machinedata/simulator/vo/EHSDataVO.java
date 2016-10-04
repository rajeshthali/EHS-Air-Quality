package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class EHSDataVO {
	
	@JsonProperty("messageId")
	private String messageId;
	
	@JsonProperty("body")
	private List<EHSBody> body;

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public List<EHSBody> getBody() {
		return body;
	}

	public void setBody(List<EHSBody> body) {
		this.body = body;
	}

	@Override
	public String toString() {
		return "EHSDataVO [messageId=" + messageId + ", body=" + body + "]";
	}
	
}
