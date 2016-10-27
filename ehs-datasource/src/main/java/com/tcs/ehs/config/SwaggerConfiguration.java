
package com.tcs.ehs.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author Sarath Muraleedharan
 *
 */
@Configuration
public class SwaggerConfiguration extends WebMvcConfigurerAdapter {
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addRedirectViewController("/api/v2/api-docs", "/v2/api-docs"); //$NON-NLS-1$ //$NON-NLS-2$
		registry.addRedirectViewController("/api/configuration/ui", "/configuration/ui"); //$NON-NLS-1$ //$NON-NLS-2$
		registry.addRedirectViewController("/api/configuration/security", "/configuration/security"); //$NON-NLS-1$ //$NON-NLS-2$
		registry.addRedirectViewController("/api/swagger-resources", "/swagger-resources"); //$NON-NLS-1$ //$NON-NLS-2$

	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/api/**").addResourceLocations("classpath:/META-INF/resources/"); //$NON-NLS-1$ //$NON-NLS-2$
	}
}
