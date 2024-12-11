import * as z from 'zod'

export const recipientFormSchema = z.object({
    email: z.string().email('Email not valid').min(1, {message: 'Important to fill email field'}),
    fullname: z.string().min(1, {message: 'Important to fill fullname field'}),
    full_address: z.string().min(1, {message: 'Important to fill full address field'}),
    phone_number: z.string().min(1, {message: 'Important to fill phone number field'}).min(7, 'Minimum phone numbers length is 7 digits'),
    postal_code: z.string().min(1, {message: 'Important to fill postal code field'}).length(5, {message: 'Minimum postal code length is 5 digits'}),
    city: z.string().min(1, {message: 'Important to fill city field'}),
    state: z.string().min(1, {message: 'Important to fill state/province field'}),
    region: z.string().min(1, {message: 'Important to fill region field'}),
})