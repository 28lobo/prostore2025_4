
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// convert prisma object into js object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toFixed().split('.')
  return decimal ? `${int}.${decimal.padEnd(2,'0')}` : `${int}.00`
}

// Format errors 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any){
  if(error.name === "ZodError"){
    // Hande  zod error
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message)
    return fieldErrors.join('. ')
  } else if (error.name === "PrismaClientKnownRequestError" && error.code === "P2002") {
    // handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field"
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // handle other errors
    return typeof error.message === "string" ? error.message : JSON.stringify(error.message)
  }
}


// Round number to two decimal places
export function round2(value: number | string): number {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US',{
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,

})

// format the currency using the currency formatter
export function formatCurrency(amount: number | string | null): string {
  if(typeof amount === 'number'){
    return CURRENCY_FORMATTER.format(amount)
  }else if(typeof amount === 'string'){
    return CURRENCY_FORMATTER.format(Number(amount))
  }else{
    return 'NaN'
  }
}

