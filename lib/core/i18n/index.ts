import type { Language } from '@/types/core/i18n';

export const translations = {
  'es-CL': {
    branches: {
      selectLanguage: 'Selecciona tu idioma',
      title: 'Bienvenido a Transvip',
      description: 'Indícame dónde te encuentras para comenzar tu reserva',
      bookService: 'Reservar Servicio',
      branchLocationPrefix: 'Estoy en'
    },
    steps: {
      language: {
        title: 'Selecciona tu idioma',
        description: 'Elige tu idioma preferido para continuar',
        continue: 'Continuar'
      },
      personal: {
        title: 'Información Personal',
        description: 'Por favor ingresa tus datos personales',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo Electrónico',
        continue: 'Continuar',
        back: 'Volver',
        validation: {
          firstName: 'El nombre debe tener al menos 2 caracteres.',
          lastName: 'El apellido debe tener al menos 2 caracteres.',
          email: 'Por favor ingresa un correo electrónico válido.'
        },
        placeholders: {
          firstName: 'Tu nombre',
          lastName: 'Tu apellido',
          email: 'correo@ejemplo.com'
        }
      },
      travel: {
        title: 'Información de Viaje',
        description: 'Por favor ingresa tus datos de contacto y vuelo de regreso',
        country: 'País',
        countryCode: 'Código de País',
        phoneNumber: 'Número de Teléfono',
        returnDate: 'Fecha de tu vuelo de regreso',
        returnTime: 'Hora de despegue de tu vuelo de regreso',
        returnDateTime: 'Fecha y Hora de Regreso',
        selectDate: 'Selecciona una fecha',
        selectTime: 'Selecciona una hora',
        hourPlaceholder: 'Hora',
        minutePlaceholder: 'Minuto',
        selectCountry: 'Selecciona un país',
        searchCountry: 'Buscar país...',
        noCountryFound: 'País no encontrado',
        continue: 'Continuar',
        back: 'Volver',
        validation: {
          phoneNumber: 'El número de teléfono debe tener al menos 6 dígitos.',
          returnDateTime: 'Por favor selecciona una fecha y hora.',
          returnDateRequired: 'Por favor selecciona una fecha.',
          returnTimeRequired: 'Por favor selecciona una hora.',
          countryRequired: 'Selecciona un código de país.',
          phoneNumberRequired: 'El número de teléfono debe tener al menos 6 dígitos.',
          phoneNumberInvalid: 'Por favor ingresa un número de teléfono válido.'
        }
      },
      accommodation: {
        title: 'Detalles de Alojamiento',
        description: 'Por favor ingresa dónde te hospedarás',
        name: 'Nombre del Alojamiento',
        placeholder: 'Hotel, Hostal o Dirección',
        continue: 'Continuar',
        back: 'Volver',
        validation: {
          name: 'El nombre del alojamiento debe tener al menos 3 caracteres.'
        }
      },
      confirmation: {
        title: '¡Gracias!',
        description: 'Tu información ha sido enviada exitosamente',
        personalInfo: 'Información Personal',
        contactInfo: 'Información de Contacto',
        returnFlight: 'Fecha y Hora de vuelo de Regreso',
        accommodation: 'Alojamiento',
        notSpecified: 'No especificado',
        redirecting: 'Redirigiendo a la página principal...'
      }
    },
    success: {
      title: '¡Éxito!',
      description: 'Tu información ha sido enviada exitosamente.'
    },
    error: {
      title: 'Error',
      description: 'Hubo un error al enviar tu información.'
    }
  },
  'en-US': {
    branches: {
      selectLanguage: 'Select your language',
      title: 'Welcome to Transvip',
      description: 'Indicate where you are to start your booking',
      bookService: 'Book Service',
      branchLocationPrefix: "I'm in"
    },
    steps: {
      language: {
        title: 'Select your language',
        description: 'Choose your preferred language to continue',
        continue: 'Continue'
      },
      personal: {
        title: 'Personal Information',
        description: 'Please enter your personal details',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        continue: 'Continue',
        back: 'Back',
        validation: {
          firstName: 'First name must be at least 2 characters.',
          lastName: 'Last name must be at least 2 characters.',
          email: 'Please enter a valid email address.'
        },
        placeholders: {
          firstName: 'Your first name',
          lastName: 'Your last name',
          email: 'email@example.com'
        }
      },
      travel: {
        title: 'Travel Information',
        description: 'Please enter your contact and return flight details',
        country: 'Country',
        countryCode: 'Country Code',
        phoneNumber: 'Phone Number',
        returnDate: 'Departure Date of your return flight',
        returnTime: 'Departure Time of your return flight',
        returnDateTime: 'Return Date & Time',
        selectDate: 'Pick a date',
        selectTime: 'Pick a time',
        selectCountry: 'Select a country',
        searchCountry: 'Search country...',
        noCountryFound: 'Country not found',
        hourPlaceholder: 'Hour',
        minutePlaceholder: 'Minute',
        continue: 'Continue',
        back: 'Back',
        validation: {
          phoneNumber: 'Phone number must be at least 6 digits.',
          returnDateTime: 'Please select a date and time.',
          returnDateRequired: 'Please select a date.',
          returnTimeRequired: 'Please select a time.',
          countryRequired: 'Select a country code.',
          phoneNumberRequired: 'Phone number must be at least 6 digits.',
          phoneNumberInvalid: 'Please enter a valid phone number.'
        }
      },
      accommodation: {
        title: 'Accommodation Details',
        description: "Please enter where you'll be staying",
        name: 'Accommodation Name',
        placeholder: 'Hotel, Hostel or Address',
        continue: 'Continue',
        back: 'Back',
        validation: {
          name: 'Accommodation name must be at least 3 characters.'
        }
      },
      confirmation: {
        title: 'Thank You!',
        description: 'Your information has been submitted successfully',
        personalInfo: 'Personal Information',
        contactInfo: 'Contact Information',
        returnFlight: 'Return Flight Date & Time',
        accommodation: 'Accommodation',
        notSpecified: 'Not specified',
        redirecting: 'Redirecting to home page...'
      }
    },
    success: {
      title: 'Success!',
      description: 'Your information has been submitted successfully.'
    },
    error: {
      title: 'Error',
      description: 'There was an error submitting your information.'
    }
  },
  'de-DE': {
    branches: {
      selectLanguage: 'Sprache auswählen',
      title: 'Willkommen bei Transvip',
      description: 'Indikieren Sie, wo Sie sind, um Ihre Buchung zu beginnen',
      bookService: 'Service buchen',
      branchLocationPrefix: 'Ich bin in'
    },
    steps: {
      language: {
        title: 'Sprache auswählen',
        description: 'Wählen Sie Ihre bevorzugte Sprache aus',
        continue: 'Weiter'
      },
      personal: {
        title: 'Persönliche Informationen',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein',
        firstName: 'Vorname',
        lastName: 'Nachname',
        email: 'E-Mail',
        continue: 'Weiter',
        back: 'Zurück',
        validation: {
          firstName: 'Der Vorname muss mindestens 2 Zeichen lang sein.',
          lastName: 'Der Nachname muss mindestens 2 Zeichen lang sein.',
          email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
        },
        placeholders: {
          firstName: 'Ihr Vorname',
          lastName: 'Ihr Nachname',
          email: 'email@beispiel.de'
        }
      },
      travel: {
        title: 'Reiseinformationen',
        description: 'Bitte geben Sie Ihre Kontaktdaten und Rückflugdetails ein',
        country: 'Land',
        countryCode: 'Ländervorwahl',
        phoneNumber: 'Telefonnummer',
        returnDate: 'Rückreisedatum',
        returnTime: 'Abflugzeit Ihres Rückflugs',
        hourPlaceholder: 'Stunde',
        minutePlaceholder: 'Minute',
        returnDateTime: 'Rückreisedatum und -zeit',
        selectDate: 'Datum auswählen',
        selectTime: 'Zeit auswählen',
        selectCountry: 'Ländervorwahl auswählen',
        searchCountry: 'Land suchen...',
        noCountryFound: 'Land nicht gefunden',
        continue: 'Weiter',
        back: 'Zurück',
        validation: {
          phoneNumber: 'Die Telefonnummer muss mindestens 6 Ziffern haben.',
          returnDateTime: 'Bitte wählen Sie ein Datum und eine Uhrzeit aus.',
          returnDateRequired: 'Bitte wählen Sie ein Datum aus.',
          returnTimeRequired: 'Bitte wählen Sie eine Uhrzeit aus.',
          countryRequired: 'Wählen Sie eine Ländervorwahl aus.',
          phoneNumberRequired: 'Die Telefonnummer muss mindestens 6 Ziffern haben.',
          phoneNumberInvalid: 'Bitte geben Sie eine gültige Telefonnummer ein.'
        }
      },
      accommodation: {
        title: 'Unterkunftsdetails',
        description: 'Bitte geben Sie an, wo Sie übernachten werden',
        name: 'Name der Unterkunft',
        placeholder: 'Hotel, Hostel oder Adresse',
        continue: 'Weiter',
        back: 'Zurück',
        validation: {
          name: 'Der Name der Unterkunft muss mindestens 3 Zeichen lang sein.'
        }
      },
      confirmation: {
        title: 'Vielen Dank!',
        description: 'Ihre Informationen wurden erfolgreich übermittelt',
        personalInfo: 'Persönliche Informationen',
        contactInfo: 'Kontaktinformationen',
        returnFlight: 'Rückflugdatum und -zeit',
        accommodation: 'Unterkunft',
        notSpecified: 'Nicht angegeben',
        redirecting: 'Weiterleitung zur Startseite...'
      }
    },
    success: {
      title: 'Erfolg!',
      description: 'Ihre Informationen wurden erfolgreich übermittelt.'
    },
    error: {
      title: 'Fehler',
      description: 'Beim Übermitteln Ihrer Informationen ist ein Fehler aufgetreten.'
    }
  },
  'pt-BR': {
    branches: {
      selectLanguage: 'Selecione seu idioma',
      title: 'Bem-vindo à Transvip',
      description: 'Indique onde você está para começar sua reserva',
      bookService: 'Reservar Serviço',
      branchLocationPrefix: 'Estou em'
    },
    steps: {
      language: {
        title: 'Selecione seu Idioma',
        description: 'Escolha seu idioma preferido para continuar',
        continue: 'Continuar'
      },
      personal: {
        title: 'Informações Pessoais',
        description: 'Por favor, insira seus dados pessoais',
        firstName: 'Nome',
        lastName: 'Sobrenome',
        email: 'E-mail',
        continue: 'Continuar',
        back: 'Voltar',
        validation: {
          firstName: 'O nome deve ter pelo menos 2 caracteres.',
          lastName: 'O sobrenome deve ter pelo menos 2 caracteres.',
          email: 'Por favor, insira um endereço de e-mail válido.'
        },
        placeholders: {
          firstName: 'Seu nome',
          lastName: 'Seu sobrenome',
          email: 'email@exemplo.com'
        }
      },
      travel: {
        title: 'Informações de Viagem',
        description: 'Por favor, insira seus dados de contato e detalhes do voo de retorno',
        country: 'País',
        countryCode: 'Código do País',
        phoneNumber: 'Número de Telefone',
        returnDate: 'Data de voo de retorno',
        returnTime: 'Hora de voo de retorno',
        returnDateTime: 'Data e Hora de Retorno',
        selectDate: 'Selecione uma data',
        selectTime: 'Selecione uma hora',
        hourPlaceholder: 'Hora',
        minutePlaceholder: 'Minuto',
        selectCountry: 'Selecione um país',
        searchCountry: 'Buscar país...',
        noCountryFound: 'País não encontrado',
        continue: 'Continuar',
        back: 'Voltar',
        validation: {
          phoneNumber: 'O número de telefone deve ter pelo menos 6 dígitos.',
          returnDateTime: 'Por favor, selecione uma data e um horário.',
          returnDateRequired: 'Por favor, selecione uma data.',
          returnTimeRequired: 'Por favor, selecione uma hora.',
          countryRequired: 'Selecione um código de país.',
          phoneNumberRequired: 'O número de telefone deve ter pelo menos 6 dígitos.',
          phoneNumberInvalid: 'Por favor, insira um número de telefone válido.'
        }
      },
      accommodation: {
        title: 'Detalhes da Hospedagem',
        description: 'Por favor, insira onde você ficará hospedado',
        name: 'Nome da Hospedagem',
        placeholder: 'Hotel, Hostel ou Endereço',
        continue: 'Continuar',
        back: 'Voltar',
        validation: {
          name: 'O nome da hospedagem deve ter pelo menos 3 caracteres.'
        }
      },
      confirmation: {
        title: 'Obrigado!',
        description: 'Suas informações foram enviadas com sucesso',
        personalInfo: 'Informações Pessoais',
        contactInfo: 'Informações de Contato',
        returnFlight: 'Data e Hora de voo de Retorno',
        accommodation: 'Hospedagem',
        notSpecified: 'Não especificado',
        redirecting: 'Redirecionando para a página inicial...'
      }
    },
    success: {
      title: 'Sucesso!',
      description: 'Suas informações foram enviadas com sucesso.'
    },
    error: {
      title: 'Erro',
      description: 'Houve um erro ao enviar suas informações.'
    }
  }
} as const

// export type Language = keyof typeof translations; // Moved to @types/core/i18n.ts
// export type Translation = typeof translations[Language]; // Moved to @types/core/i18n.ts

export function getTranslation(language: Language) {
  return translations[language];
} 