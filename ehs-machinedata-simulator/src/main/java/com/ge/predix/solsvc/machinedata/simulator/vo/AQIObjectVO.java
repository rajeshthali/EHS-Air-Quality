package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.ArrayList;
import java.util.List;

public class AQIObjectVO {
	
	private Long messageId;
	
	private List<AQIBody> body = new ArrayList<AQIBody>();
	
	

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public List<AQIBody> getBody() {
		return body;
	}

	public void setBody(List<AQIBody> body) {
		this.body = body;
	}

	@Override
	public String toString() {
		return "EHSObjectVO [messageId=" + messageId + ", body=" + body + "]";
	}
	

	
}
