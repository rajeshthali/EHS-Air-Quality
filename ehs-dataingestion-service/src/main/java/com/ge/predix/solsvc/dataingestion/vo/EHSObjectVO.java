package com.ge.predix.solsvc.dataingestion.vo;

import java.util.List;

public class EHSObjectVO {
	
	private String messageId;
	
	private List<AssetBody> body;

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public List<AssetBody> getBody() {
		return body;
	}

	public void setBody(List<AssetBody> body) {
		this.body = body;
	}

	public String toString() {
		return "EHSObjectVO [messageId=" + messageId + ", body=" + body + "]";
	}
	
	
}
