"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X } from "lucide-react"
import { cn } from '@/utils/ui'
import { Button } from "./button"
import { createPortal } from "react-dom"

interface SimpleDialogProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	className?: string
	hideCloseButton?: boolean
}

interface SimpleDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }
interface SimpleDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> { }
interface SimpleDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode
}
interface SimpleDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode
}

export function SimpleDialog({ 
	isOpen, 
	onClose, 
	children, 
	className = "",
	hideCloseButton = false 
}: SimpleDialogProps) {
	const [isMounted, setIsMounted] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const dialogRef = useRef<HTMLDivElement>(null)
	const previousActiveElement = useRef<Element | null>(null)

	// Handle mounting state
	useEffect(() => {
		setIsMounted(true)
		return () => setIsMounted(false)
	}, [])

	// Handle visibility state for animations
	useEffect(() => {
		if (isOpen) {
			setIsVisible(true)
			// Store focus and lock scroll
			previousActiveElement.current = document.activeElement
			document.body.classList.add('overflow-hidden')
		} else {
			const timer = setTimeout(() => setIsVisible(false), 200)
			// Restore scroll
			document.body.classList.remove('overflow-hidden')
			return () => clearTimeout(timer)
		}
	}, [isOpen])

	// Focus first focusable element when dialog opens
	useEffect(() => {
		if (isOpen && dialogRef.current) {
			const focusableElements = dialogRef.current.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			) as NodeListOf<HTMLElement>
			
			if (focusableElements.length > 0) {
				focusableElements[0].focus()
			}
		}
		
		// Restore focus when dialog closes
		return () => {
			if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
				(previousActiveElement.current as HTMLElement).focus()
			}
		}
	}, [isOpen])

	// Handle escape key press
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Escape' && isOpen) {
			onClose()
		}
	}, [isOpen, onClose])

	// Add and remove event listeners for escape key
	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, handleKeyDown])

	// Focus trap implementation
	const handleTabKey = useCallback((e: KeyboardEvent) => {
		if (e.key !== 'Tab' || !dialogRef.current) return
		
		const focusableElements = dialogRef.current.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		) as NodeListOf<HTMLElement>
		
		if (focusableElements.length === 0) return
		
		const firstElement = focusableElements[0]
		const lastElement = focusableElements[focusableElements.length - 1]
		
		if (e.shiftKey && document.activeElement === firstElement) {
			e.preventDefault()
			lastElement.focus()
		} else if (!e.shiftKey && document.activeElement === lastElement) {
			e.preventDefault()
			firstElement.focus()
		}
	}, [])

	// Add and remove event listeners for focus trapping
	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleTabKey)
		}
		return () => {
			document.removeEventListener('keydown', handleTabKey)
		}
	}, [isOpen, handleTabKey])

	if (!isMounted) return null

	if (!isOpen && !isVisible) return null

	const dialogContent = (
		<div 
			className="fixed inset-0 z-50"
			role="dialog"
			aria-modal="true"
			aria-labelledby="dialog-title"
		>
			{/* Overlay */}
			<div
				className={cn(
					"fixed inset-0 bg-black/80 transition-opacity duration-200",
					isOpen ? "opacity-100" : "opacity-0"
				)}
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Content */}
			<div
				ref={dialogRef}
				className={cn(
					"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg transition-all duration-200 sm:rounded-lg",
					isOpen 
						? "opacity-100 scale-100" 
						: "opacity-0 scale-95",
					className
				)}
			>
				{children}
				{!hideCloseButton && (
					<Button 
						variant={"ghost"} 
						onClick={onClose} 
						className="absolute right-4 top-4 p-2 shadow-none disabled:pointer-events-none"
						aria-label="Close dialog"
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</Button>
				)}
			</div>
		</div>
	)

	// Use portal to render at document body level
	return createPortal(dialogContent, document.body)
}

export function SimpleDialogHeader({
	className = "",
	...props
}: SimpleDialogHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col space-y-1.5 text-center sm:text-left",
				className
			)}
			{...props}
		/>
	)
}

export function SimpleDialogFooter({
	className = "",
	...props
}: SimpleDialogFooterProps) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
				className
			)}
			{...props}
		/>
	)
}

export function SimpleDialogTitle({
	className = "",
	...props
}: SimpleDialogTitleProps) {
	return (
		<h2
			id="dialog-title"
			className={cn(
				"text-lg font-semibold leading-none tracking-tight",
				className
			)}
			{...props}
		/>
	)
}

export function SimpleDialogDescription({
	className = "",
	...props
}: SimpleDialogDescriptionProps) {
	return (
		<div
			id="dialog-description"
			className={cn("text-sm text-muted-foreground", className)}
			aria-describedby="dialog-description"
			{...props}
		/>
	)
} 