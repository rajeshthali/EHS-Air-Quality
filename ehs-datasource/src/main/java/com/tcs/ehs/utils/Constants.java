package com.tcs.ehs.utils;

import com.tcs.ehs.utils.Constants.Energy;
import com.tcs.ehs.utils.Constants.Waste;

public class Constants {
	public static enum QueryTagsAQI {
		AQI_Machine {
			@Override
			public String toString() {
				return "AQI-Machine";
			}
		},
		AQI_Area {
			@Override
			public String toString() {
				return "AQI-Area";
			}
		}
	}
	
	//amlesh
	public static enum QueryTagsWater {
		Water{			
		@Override
		public String toString(){
			return "Water";			
		}		
	  }
		
	}
	
	//amlesh
	public static enum QueryTagsWaste {
		Waste{			
		@Override
		public String toString(){
			return "Waste";			
		}		
	  }
		
	}
	
	public static enum QueryTagsEnergy {
		Energy{			
		@Override
		public String toString(){
			return "Energy";			
		}		
	  }
		
	}
	
	public static enum QueryTagsHygiene {
		Hygiene {
			@Override
			public String toString() {
				return "Hygiene";
			}
		}
	}

	public static enum Range {
		GOOD, SATISFACTORY, MODERATE, POOR, VERY_POOR, SEVERE
	};

	public static enum Parameter {
		PM10, PM2_5, NO2, O3, CO2, SO2, NH3, PB;
		public static String[] list() {
			Parameter[] parameter = values();
			String[] names = new String[parameter.length];

			for (int i = 0; i < parameter.length; i++) {
				names[i] = parameter[i].name();
			}

			return names;
		}
	};
	
	//amlesh
	//PH_VALUE, SUSPENDED_SOLIDS, BOD, COD, OIL_GREASE
	//["assetname","floorNo","name"]}
	public static enum Water {
		assetname {
			@Override
			public String toString() {
				return "assetname";
			}
		},
		floorNo {
			@Override
			public String toString() {
				return "floorNo";
			}
		},
		name {
			@Override
			public String toString() {
				return "name";
			}
		};	
		
		public static String[] list() {
			Water[] water = values();
			String[] names = new String[water.length];

			for (int i = 0; i < water.length; i++) {
				names[i] = water[i].toString();
			}

			return names;
		}
		
	};	
		/*,
		COD {
			@Override
			public String toString() {
				return "COD";
			}
		},
		OIL_GREASE {
				@Override
				public String toString() {
					return "OIL_GREASE";
		}			
		};*/
		
		
		/*public static String[] list() {
			Water[] water = values();
			String[] names = new String[water.length];

			for (int i = 0; i < water.length; i++) {
				names[i] = water[i].toString();
			}

			return names;
		}*/
	//};
	
	public static enum Waste {
		/*assetname {
			@Override
			public String toString() {
				return "assetname";
			}
		},*/
		floorNo {
			@Override
			public String toString() {
				return "floorNo";
			}
		},
		name {
			@Override
			public String toString() {
				return "name";
			}
		};	
		
		public static String[] list() {
			Waste[] water = values();
			String[] names = new String[water.length];

			for (int i = 0; i < water.length; i++) {
				names[i] = water[i].toString();
			}

			return names;
		}
		
	};
	
	
	public static enum Energy {
		/*assetname {
			@Override
			public String toString() {
				return "assetname";
			}
		},*/
		floorNo {
			@Override
			public String toString() {
				return "floorNo";
			}
		},
		name {
			@Override
			public String toString() {
				return "name";
			}
		};	
		
		public static String[] list() {
			Energy[] energy = values();
			String[] names = new String[energy.length];

			for (int i = 0; i < energy.length; i++) {
				names[i] = energy[i].toString();
			}

			return names;
		}
		
	};	
	

	public static enum Hygiene {
		TEMPERATURE {
			@Override
			public String toString() {
				return "temprature";
			}
		},
		HUMIDITY {
			@Override
			public String toString() {
				return "humidity";
			}
		},
		NOISE {
			@Override
			public String toString() {
				return "noise";
			}
		};
		public static String[] list() {
			Hygiene[] hygiene = values();
			String[] names = new String[hygiene.length];

			for (int i = 0; i < hygiene.length; i++) {
				names[i] = hygiene[i].toString();
			}

			return names;
		}
	};

	public static String hygieneAreas[] = new String[] { "SMT Line 1", "SMT Line 2", "Hygiene Production Ground Floor" };
	public static String aqiAreas[] = new String[] { "SMT Area", "Production Ground Floor", "Near Soldering Machine", "Heller-Machine", "Soltech-Machine", "Reflow-Ovan", "Wave-Soldering-Machine" };
}