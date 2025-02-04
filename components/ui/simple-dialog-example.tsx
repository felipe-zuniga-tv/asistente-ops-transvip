"use client"

import { useState } from "react"
import { Button } from "./button"
import {
  SimpleDialog,
  SimpleDialogHeader,
  SimpleDialogFooter,
  SimpleDialogTitle,
  SimpleDialogDescription,
} from "./simple-dialog"

export function SimpleDialogExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    // Handle confirmation logic here
    setIsOpen(false)
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Dialog
      </Button>

      <SimpleDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SimpleDialogHeader>
          <SimpleDialogTitle>
            Edit Profile Settings
          </SimpleDialogTitle>
          <SimpleDialogDescription>
            Make changes to your profile settings here. Click save when you're done.
          </SimpleDialogDescription>
        </SimpleDialogHeader>

        <div className="py-4">
          {/* Example form content */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        <SimpleDialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Save changes
          </Button>
        </SimpleDialogFooter>
      </SimpleDialog>
    </div>
  )
} 