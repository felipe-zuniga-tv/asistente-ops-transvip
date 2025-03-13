export interface Terminal {
	id: string;
	name: string;
}

export interface PassengerData {
	id: string;
	time_scanned: number;
	destination_lat: number;
	destination_lng: number;
}

export interface Vehicle {
	vehicle_number: string
	driver?: {
		name: string
		photo: string
		hoursConnected: number
	}
	license_plate: string
	contract: string
	brand: string
	model: string
	blocked: boolean
}

// Zarpe
export interface ZarpeLocation {
	id: string;
	name: string;
	terminals: Terminal[];
}

export interface ZarpePassenger {
	booking: string
	terminal: string
	total_pax: number
	nombre: string
	comuna: string
	minutos: number
}