export interface User{
    id: number|null,
    first_name: string|null,
    last_name: string | null,
    email: string | null,
    phone_no: number | null,
    address: string | null,
    city: string | null,
    country: string | null,
    pincode: number | null,
    img: string | null,
    company: string | null,
    position: string | null,
    isAdmin: boolean | null,
    createdAt: Date | null,
    updatedAt: Date | null
}