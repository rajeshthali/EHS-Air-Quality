
package com.tcs.ehs.config;

import java.util.Map;

/**
 * @author Sarath Muraleedharan
 *
 */
public class EventError {
	public Integer status;
	public String error;
	public String message;
	public String timeStamp;

	public EventError(int status, Map<String, Object> errorAttributes) {
		this.status = status;
		this.error = (String) errorAttributes.get("error"); //$NON-NLS-1$
		this.message = (String) errorAttributes.get("message"); //$NON-NLS-1$
		this.timeStamp = errorAttributes.get("timestamp").toString(); //$NON-NLS-1$

	}
}
