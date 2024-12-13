export interface Terminal {
	id: string;
	name: string;
}

export interface ZarpeLocation {
	id: string;
	name: string;
	terminals: Terminal[];
}

export interface PassengerData {
	id: string;
	time_scanned: number;
	destination_lat: number;
	destination_lng: number;
}

export interface Vehicle {
	id: string;
	driver: {
		name: string;
		photo: string;
		hoursConnected: number;
	};
	plate: string;
	contract: string;
	brand: string;
	model: string;
	blocked: boolean;
}