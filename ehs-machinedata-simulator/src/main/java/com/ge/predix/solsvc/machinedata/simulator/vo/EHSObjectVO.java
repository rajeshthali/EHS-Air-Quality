package com.ge.predix.solsvc.machinedata.simulator.vo;

import java.util.ArrayList;
import java.util.List;

public class EHSObjectVO {
	
	private Long messageId;
	
	private List<AssetBody> body = new ArrayList<AssetBody>();

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public List<AssetBody> getBody() {
		return body;
	}

	public void setBody(List<AssetBody> body) {
		this.body = body;
	}

	@Override
	public String toString() {
		return "EHSObjectVO [messageId=" + messageId + ", body=" + body + "]";
	}

	
	
	
}
