package com.ge.predix.solsvc.machinedata.simulator.config;

public class Constants {
	
	public static int GRND_FLOOR=0;
	
	public static int FIRST_FLOOR=1;
	
	public static int SECOND_FLOOR=2;
	
	public static enum Range {
		GOOD, SATISFACTORY, MODERATE, POOR, VERY_POOR, SEVERE
	};

	public static enum Parameter {
		PM10, PM2_5,NO2, O3, CO, SO2, NH3, PB
	};
	
	public static enum Hygiene {
		TEMPERATURE, HUMIDITY, NOISE
	};

	public static String HYG_ASSET_FLR_0[] = new String[] { "SMTLine1", "SMTLine2", "ProductionGroundFloor" };
	public static String HYG_ASSET_FLR_1[] = new String[] { "SMTLine1"};
	public static String HYG_ASSET_FLR_2[] = new String[] { "SMTLine1", "SMTLine2" };
	
	public static String AREA_ASSET_FLR_0[] = new String[] { "SMTArea", "ProductionGroundFloor","NearSolderingMachine" };
	public static String AREA_ASSET_FLR_1[] = new String[] { "SMTArea", "NearSolderingMachine" };
	public static String AREA_ASSET_FLR_2[] = new String[] { "SMTArea"};

	public static String MCHN_ASSET_FLR_0[] = new String[] { "Heller-Machine", "Soltech-Machine", "Reflow-Ovan","Wave-Soldering-Machine" };
	public static String MCHN_ASSET_FLR_1[] = new String[] { "Soltech-Machine", "Reflow-Ovan","Wave-Soldering-Machine" };
	public static String MCHN_ASSET_FLR_2[] = new String[] { "Heller-Machine", "Wave-Soldering-Machine" };
	
}


