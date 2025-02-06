"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface SimpleDialogProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	className?: string
}

interface SimpleDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }
interface SimpleDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> { }
interface SimpleDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode
}
interface SimpleDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode
}

export function SimpleDialog({ isOpen, onClose, children, className = "" }: SimpleDialogProps) {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
		return () => setIsMounted(false)
	}, [])

	if (!isMounted) return null

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50">
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black/80 animate-in fade-in-0"
				onClick={onClose}
			/>

			{/* Content */}
			<div
				className={cn(
					"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg",
					className
				)}
			>
				{children}
				<Button variant={"ghost"} onClick={onClose} className="absolute right-4 top-4 p-2 shadow-none disabled:pointer-events-none">
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</Button>
			</div>
		</div>
	)
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
		<p
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	)
} 