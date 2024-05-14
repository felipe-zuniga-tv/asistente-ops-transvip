'use client'
import { useState } from 'react'
import { FileUpload } from "@/components/data/csv-file-uploader"
import FleetData from "@/components/data/fleet-table"

export default function ControlPage() {
	const [data, setData] = useState([
		{ name: 'John Doe',    email: 'john@example.com', phone: '12345678', },
		{ name: 'Jane Smith',  email: 'jane@example.com', phone: '22334455', },
		{ name: 'Bob Johnson', email: 'bob@example.com' },
		{ name: 'John Doe',    email: 'john@example.com' },
		{ name: 'Jane Smith',  email: 'jane@example.com' },
		{ name: 'Bob Johnson', email: 'bob@example.com' },
		{ name: 'John Doe',    email: 'john@example.com' },
		{ name: 'Jane Smith',  email: 'jane@example.com' },
		{ name: 'Bob Johnson', email: 'bob@example.com' },
		{ name: 'John Doe',    email: 'john@example.com' },
		{ name: 'Jane Smith',  email: 'jane@example.com' },
		{ name: 'Bob Johnson', email: 'bob@example.com' },
		{ name: 'John Doe',    email: 'john@example.com' },
		{ name: 'Jane Smith',  email: 'jane@example.com' },
		{ name: 'Bob Johnson', email: 'bob@example.com' },
	])
	const [selectedRows, setSelectedRows] = useState([])

	const handleCheckboxChange = (index) => {
		setSelectedRows((prevSelectedRows) => {
			if (prevSelectedRows.includes(index)) {
				return prevSelectedRows.filter((rowIndex) => rowIndex !== index)
			} else {
				return [...prevSelectedRows, index]
			}
		})
	}

	const handleSelectOffline = () => {
		// Example: Select all rows where the name starts with 'J'
		// console.log(data)
		const filteredIndexes = data
			.map((row, index) => (row.name.startsWith('J') ? index : null))
			.filter((index) => index !== null)
			// console.log(filteredIndexes)
		setSelectedRows(filteredIndexes)
	}

	const handleSendWhatsAppMessages = () => {
		const selectedUsers = selectedRows.map((index) => data[index])
		// Implement logic to send WhatsApp messages to selected users
		console.log('Sending WhatsApp messages to:', selectedUsers)
	}

	return (
		<section className="section-control w-full text-center mx-auto flex flex-col gap-6">
			<span className="font-bold text-2xl">Control de Flota · Tiempo Real</span>
			<div className="flex flex-col xs:flex-row gap-4 justify-center items-center w-full text-xs md:text-base">
				<div className="place-self-end_ flex flex-col gap-3 md:flex-row md:gap-5">
					<FileUpload />
					<button className="auth-btn text-base" onClick={handleSelectOffline}>Seleccionar Móviles Offline</button>
					<button className="auth-btn bg-green-500 hover:bg-green-700 text-white w-fit mx-auto" onClick={handleSendWhatsAppMessages}>Enviar WhatsApp</button>
				</div>
			</div>
			<FleetData data={data} handleCheckboxChange={handleCheckboxChange} />
		</section>
	)
}
