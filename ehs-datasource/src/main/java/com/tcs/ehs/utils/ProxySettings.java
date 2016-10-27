package com.tcs.ehs.utils;

import java.net.InetSocketAddress;
import java.net.Proxy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ProxySettings {
	@Value("${proxy.host}")
	private static String HOST;
	@Value("${proxy.port}")
	private static int PORT;

	public RestTemplate applyProxy(RestTemplate restTemplate) {
		if (HOST != null && !HOST.isEmpty()) {
			SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
			InetSocketAddress address = new InetSocketAddress(HOST, PORT);
			Proxy proxy = new Proxy(Proxy.Type.HTTP, address);
			factory.setProxy(proxy);
			restTemplate.setRequestFactory(factory);
		}
		return restTemplate;
	}
}
