export interface AccessToken{
    id: number,
    first_name: string ,
    last_name: string,
    email: string,
    img: string | null,
    company: string | null,
    address: string | null,
    isAdmin: boolean| null,
    createdAt: Date | null,
    updatedAt: Date | null,
    iat: Date,
    exp: Date
  }