'use client'

import { useState, useEffect } from "react"
import { Icon } from "../ui/icons"
import { UploadIcon } from "lucide-react"

useState

export function FileUpload({ client, handleFileChange, inputFileRef, afterUpload, refresh, setStateMessage }) {
    const [selectedFile, setSelectedFile] = useState(inputFileRef)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        setSelectedFile(inputFileRef)
    }, [inputFileRef])

    const handleFileSelection = (event) => {
        const file = event.target.files[0]
        setSelectedFile(file)

        // Callback for parent component
        handleFileChange(file)
    }

    // CSV File - Validation + Upload
    const validateCSV = (fileData) => {
        const rows = fileData.split('\n')

        // Check if the file has at least two rows (header and data)
        if (rows.length < 2) {
            setStateMessage("Revisa la estructura del archivo CSV. Incluye un encabezado con los campos 'Nombre Completo', 'Email' y 'Password'")
            throw new Error('Revisa la estructura del archivo, debe tener un encabezado y al menos 1 fila de datos.')
        }

        const headerRow = rows[0]
        const dataRows = rows.slice(1)

        // Check the header structure and required columns
        const headerColumns = headerRow.split(',').map(col => col.trim().toLowerCase())
        const requiredColumns = ['Nombre Completo', 'Email', 'Password'] // Add the required column names here

        for (const column of requiredColumns) {
            if (!headerColumns.includes(column.toLowerCase())) {
                throw new Error(`CSV file is missing the required column: ${column}.`)
            }
        }

        // Check the format of data rows
        for (const row of dataRows) {
            const rowData = row.split(',')

            // Name
            const name = rowData[0].trim()
            if (name.length === '' || name.length < 4) {
                throw new Error('Revisa los nombre ingresados. Se requiere ingresar un mínimo de 4 caracteres para el nombre.')
            }

            // Check the format of the email column (2nd column)
            const email = rowData[1].trim()
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (!emailRegex.test(email)) {
                throw new Error(`Formato no válido para el email: ${email}`)
            }

            const password = rowData[2].trim()
            if (!validPassword(password)) {
                throw new Error('Revisa los password ingresados. Se requiere un mínimo de 8 caracteres')
            }
        }
    }

    const uploadCSVFile = async (fileData) => {
        const rows = fileData.split('\n')
        const dataRows = rows.slice(1)

        // Remove duplicates and prepare unique data for upload
        const uniqueRows = new Set()

        for (const row of dataRows) {
            const rowData = row.split(',')
            const name = rowData[0].trim()
            const email = rowData[1].trim().toLowerCase()
            const password = rowData[2].trim()
            const rowEntry = `${email}`

            if (!uniqueRows.has(rowEntry)) {
                uniqueRows.add(rowEntry)

                const newUserObject = {
                    name: name,
                    email: email,
                    password: password,
                    clientId: client.client_id,
                    clientName: client.client_name
                }
                await handleCreateNewUserAccount(newUserObject)
            } else {
                console.log("Duplicate Key Found:", rowEntry)
            }
        }
    }

    const handleUploadCSVFile = async () => {
        try {
            setUploading(true)

            const fileData = await selectedFile.text()
            validateCSV(fileData)
            await uploadCSVFile(fileData)

            refresh()
        } catch (error) {
            console.log(`[CSV USERS UPLOAD] ERROR: ${error.message}`)
            setStateMessage(error.message)
        } finally {
            setSelectedFile(null)
            setUploading(false)

            setTimeout(() => {
                setStateMessage("")
            }, 2000)

            // Callback
            afterUpload()
        }
    }

    // Markdown
    if (selectedFile) {
        if (uploading) {
            return <LoadingButton text="Subiendo..." small={true} />
        }

        return (
            <button onClick={handleUploadCSVFile} className="content-header-btn bg-btn-kyon hover:bg-btn-kyon-dark md:self-end">
                <UploadIcon className="size-4 mr-2"/> Subir archivo
            </button>
        )
    }

    return (
        <>
            <label htmlFor="users-select-csv" className="content-header-btn md:self-end">
                <Icon icon={"FileUpload"} title="Flota por Rol de Turno (CSV)" className="mr-2" />
            </label>
            <input type="file"
                id="users-select-csv"
                accept=".csv"
                className="hidden"
                onChange={handleFileSelection}
            />
        </>
    )
}