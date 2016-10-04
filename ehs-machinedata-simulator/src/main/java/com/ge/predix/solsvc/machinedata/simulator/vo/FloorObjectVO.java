package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.ArrayList;
import java.util.List;

public class FloorObjectVO {
	
	private Long messageId;
	
	private List<FloorBodyVO> body = new ArrayList<FloorBodyVO>();

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public List<FloorBodyVO> getBody() {
		return body;
	}

	public void setBody(List<FloorBodyVO> body) {
		this.body = body;
	}
	
}
