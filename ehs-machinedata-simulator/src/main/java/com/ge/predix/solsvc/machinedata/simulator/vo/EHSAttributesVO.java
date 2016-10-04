package com.ge.predix.solsvc.machinedata.simulator.vo;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class EHSAttributesVO {
	
	@JsonProperty("smtAreaData")
	private EHSAreaDataVO smtAreaData;
	
	@JsonProperty("prodGrdData")
	private EHSAreaDataVO prodGrdData;
	
	@JsonProperty("nearSolderngMchnData")
	private EHSAreaDataVO nearSolderngMchnData;

	public EHSAreaDataVO getSmtAreaData() {
		return smtAreaData;
	}

	public void setSmtAreaData(EHSAreaDataVO smtAreaData) {
		this.smtAreaData = smtAreaData;
	}

	public EHSAreaDataVO getProdGrdData() {
		return prodGrdData;
	}

	public void setProdGrdData(EHSAreaDataVO prodGrdData) {
		this.prodGrdData = prodGrdData;
	}

	public EHSAreaDataVO getNearSolderngMchnData() {
		return nearSolderngMchnData;
	}

	public void setNearSolderngMchnData(EHSAreaDataVO nearSolderngMchnData) {
		this.nearSolderngMchnData = nearSolderngMchnData;
	}

	@Override
	public String toString() {
		return "EHSAttributesVO [smtAreaData=" + smtAreaData + ", prodGrdData="
				+ prodGrdData + ", nearSolderngMchnData="
				+ nearSolderngMchnData + "]";
	}

}
