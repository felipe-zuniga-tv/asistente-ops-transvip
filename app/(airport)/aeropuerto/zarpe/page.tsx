"use client";

import { useState } from "react";
import { QrScanner } from "@/components/airport/zarpe/scanner/qr-scanner";
import { Header } from "@/components/airport/zarpe/navigation/header";
import { Navigation } from "@/components/airport/zarpe/navigation/navigation-menu";
import { VehicleInput } from "@/components/airport/zarpe/vehicles/vehicle-input";
import { PassengerData, Vehicle, ZarpeLocation } from "@/lib/airport/types";
import { SharedRides } from "@/components/airport/zarpe/passengers/shared-rides";

// const AirportLocation: ZarpeLocation = {
// 	id: "aeropuerto-scl",
// 	name: "Aeropuerto SCL",
// 	terminals: [
// 		{ id: "T1", name: "Terminal Nacional" },
// 		{ id: "T2", name: "Terminal Internacional" },
// 	],
// };

export default function ZarpePage() {
	const [activeView, setActiveView] = useState('vehicles');
	const [darkMode, setDarkMode] = useState(false);

	const [scannedQr, setScannedQr] = useState<string | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [currentTerminal, setCurrentTerminal] = useState('T1');
	const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
	const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
	const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
	const [showOptimizingModal, setShowOptimizingModal] = useState(false)

	const [vehicles, setVehicles] = useState<Record<string, (Vehicle | null)[]>>({
		T1: [
			// { id: '1234', driver: { name: 'Juan Pérez', photo: 'https://i.pravatar.cc/100?img=1', hoursConnected: 5 }, license_plate: 'ABCD12', contract: 'Leasing', brand: 'Maxus', model: 'G10', blocked: false },
			// { id: '5678', driver: { name: 'María González', photo: 'https://i.pravatar.cc/100?img=2', hoursConnected: 3 }, plate: 'EFGH34', contract: 'Freelance', brand: 'Peugeot', model: 'Traveller', blocked: false },
			// { id: '9012', driver: { name: 'Carlos Rodríguez', photo: 'https://i.pravatar.cc/100?img=3', hoursConnected: 7 }, plate: 'IJKL56', contract: 'Leasing', brand: 'Maxus', model: 'G10', blocked: false },
			// { id: '3456', driver: { name: 'Ana Martínez', photo: 'https://i.pravatar.cc/100?img=4', hoursConnected: 4 }, plate: 'MNOP78', contract: 'Leasing', brand: 'Toyota', model: 'Hiace', blocked: false },
			// { id: '7890', driver: { name: 'Pedro Sánchez', photo: 'https://i.pravatar.cc/100?img=5', hoursConnected: 6 }, plate: 'QRST90', contract: 'Freelance', brand: 'Mercedes-Benz', model: 'Sprinter', blocked: false },
			null,
			null,
			null,
			null,
			null,
			null,
			null
		],
		T2: [
			{ vehicle_number: '2345', driver: { name: 'Laura Gómez', photo: 'https://i.pravatar.cc/100?img=6', hoursConnected: 2 }, license_plate: 'UVWX12', contract: 'Leasing', brand: 'Hyundai', model: 'H1', blocked: false },
			{ vehicle_number: '6789', driver: { name: 'Diego Torres', photo: 'https://i.pravatar.cc/100?img=7', hoursConnected: 5 }, license_plate: 'YZAB34', contract: 'Freelance', brand: 'Volkswagen', model: 'Crafter', blocked: false },
			{ vehicle_number: '0123', driver: { name: 'Carmen Silva', photo: 'https://i.pravatar.cc/100?img=8', hoursConnected: 3 }, license_plate: 'CDEF56', contract: 'Leasing', brand: 'Fiat', model: 'Ducato', blocked: false },
			{ vehicle_number: '4567', driver: { name: 'Javier Morales', photo: 'https://i.pravatar.cc/100?img=9', hoursConnected: 6 }, license_plate: 'GHIJ78', contract: 'Freelance', brand: 'Renault', model: 'Master', blocked: false },
			null,
			null,
			null
		]
	});

	const [passengerCount, setPassengerCount] = useState({
		shared: 30,
		lowFrequency: 20
	});

	const handleScan = async (data: string) => {
		setIsScanning(true);
		setError(null);

		try {
			const passengerData: PassengerData = {
				id: data,
				time_scanned: Date.now(),
				destination_lat: -33.455966 + (Math.random() * 0.1 - 0.05),
				destination_lng: -70.781543 + (Math.random() * 0.1 - 0.05),
			};

			const response = await fetch("/api/passengers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(passengerData),
			});

			if (!response.ok) throw new Error(await response.text());
			setScannedQr(data);
		} catch (err) {
			setError("Error al procesar el código QR. Por favor intente nuevamente.");
			console.error(err);
		} finally {
			setIsScanning(false);
		}
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle('dark');
	};

	return (
		<div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
			<div className="flex flex-col h-screen bg-orange-50 dark:bg-gray-900 overflow-hidden">
				<Header onMenuPress={() => setMenuOpen(true)} setActiveView={setActiveView} />
				<Navigation activeView={activeView} setActiveView={setActiveView} passengerCount={passengerCount} />
				<main className="flex-1 overflow-y-auto">
					{activeView === 'vehicles' && (
						<VehicleInput
							vehicles={vehicles}
							setVehicles={setVehicles}
							currentTerminal={currentTerminal}
							setCurrentTerminal={setCurrentTerminal}
							setShowAddVehicleModal={setShowAddVehicleModal}
							setVehicleToDelete={setVehicleToDelete}
							setShowDeleteConfirmModal={setShowDeleteConfirmModal}
						/>
					)}
					{activeView === 'shared' && (
						<SharedRides
								passengerCount={passengerCount}
								setPassengerCount={setPassengerCount}
								setShowOptimizingModal={setShowOptimizingModal}
						/>
					)}
					{activeView === 'qr' && <QrScanner onScan={handleScan} />}
				</main>
			</div>
		</div>
	);
}