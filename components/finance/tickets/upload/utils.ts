// Format a date string for display
export function formatDate(dateString: string): string {
	try {
		console.log("Date string to parse:", dateString);
		
		let date: Date;
		
		// Check if the string matches the DD/MM/YYYYThh:mm:ss pattern
		const customFormatRegex = /^(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2}):(\d{2})$/;
		const match = dateString.match(customFormatRegex);
		
		if (match) {
			// If it matches the custom format, parse it manually
			const [_, day, month, year, hours, minutes, seconds] = match;
			date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
		} else {
			// Otherwise treat it as a standard format (ISO)
			date = new Date(dateString);
		}
		
		// Check if date is valid before formatting
		if (isNaN(date.getTime())) {
			console.error('Invalid date string:', dateString);
			return 'Fecha no disponible';
		}
		
		return date.toLocaleString('es-CL', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	} catch (err) {
		console.error('Error formatting date:', err);
		return 'Fecha no disponible';
	}
} 