import * as z from 'zod'

export const loginFormSchema = z.object({
    email: z.string().min(1, {
        message: 'Email field is required!'
    }).email('Email not valid'),
    password: z.string().min(7, {message: 'Minimum password length is 7 characters!'})
})

export const authFormSchema = z.object({
    fullname: z.optional(z.string({required_error: 'Fullname field is required!'}).min(3, {message: 'Minimum fullname length is 3 characters!'}).refine((value: string) => (/^[A-Za-z\s]+$/).test(value), 'Fullname just only receive text, not numbers or unique characters!')),
    username: z.optional(z.string({required_error: 'Username field is required'}).min(3, {message: 'Minimum username length is 3 characters!'}).refine((value: string) => (/^[A-Za-z]+$/).test(value), 'Username just only receive text, not numbers or unique characters!')),
    email: z.string().min(1, {message: 'Email field is required!'}).email('Email not valid'),
    password: z.string().min(1, {message: 'Password field is required!'}).min(7, {message: 'Minimum password length is 7 characters!'}),
    passwordConfirmation: z.optional(z.string().min(1, {message: 'Password confirmation field is required'}).min(7, {message: 'Minimum password confirmation length is 7 characters!'}))
}).superRefine((schema, ctx) => {
    if(schema.passwordConfirmation) {
        if(schema.passwordConfirmation !== schema.password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Password confirmation not match with password',
                path: ['passwordConfirmation']
            })
        }
    }
})