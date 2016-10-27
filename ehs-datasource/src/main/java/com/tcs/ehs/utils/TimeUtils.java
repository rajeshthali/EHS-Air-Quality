package com.tcs.ehs.utils;

import java.util.Calendar;
import java.util.Date;

public class TimeUtils {

	public static Value calculateInterval(Long interval) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		Long currentTime = calendar.getTimeInMillis();
		Long startTime = currentTime - interval;
		Long endTime = currentTime;

		return new Value(startTime, endTime);
	}

	public static class Value {

		private Long startTime;
		private Long endTime;

		public Value(Long startTime, Long endTime) {
			super();
			this.startTime = startTime;
			this.endTime = endTime;
		}

		public Long getStartTime() {
			return startTime;
		}

		public void setStartTime(Long startTime) {
			this.startTime = startTime;
		}

		public Long getEndTime() {
			return endTime;
		}

		public void setEndTime(Long endTime) {
			this.endTime = endTime;
		}

	}
}
