'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

interface PersonalInfoStepProps {
  data: {
    firstName: string
    lastName: string
    email: string
  }
  onChange: (data: {
    firstName: string
    lastName: string
    email: string
  }) => void
  onNext: () => void
  onBack: () => void
  translations: {
    title: string
    description: string
    firstName: string
    lastName: string
    email: string
    continue: string
    back: string
    validation: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export function PersonalInfoStep({
  data,
  onChange,
  onNext,
  onBack,
  translations
}: PersonalInfoStepProps) {
  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: translations.validation.firstName,
    }),
    lastName: z.string().min(2, {
      message: translations.validation.lastName,
    }),
    email: z.string().email({
      message: translations.validation.email,
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onChange(values)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">{translations.title}</h2>
        <p className="text-muted-foreground text-center">
          {translations.description}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.firstName}</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.lastName}</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.email}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full bg-transvip hover:bg-transvip-dark h-10 text-white hover:text-white"
            >
              <ArrowLeftIcon className="w-4 h-4" /> {translations.back}
            </Button>
            <Button type="submit" className="w-full h-10">
              {translations.continue} <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 