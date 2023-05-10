import { HttpClient } from "../../infra/HttpClient/HttpClient"
import { tokenService } from "./tokenService"

export const authService = {
    async login ({email, senha}) {
        return HttpClient(`${process.env.NEXT_PUBLIC_URL}/login`, {
            method: 'POST',
            body: { email, senha }
        })
        .then(async (respostaDoServidor) => {
            if(!respostaDoServidor.ok)
                throw new Error('Usuário ou senha inválidos')
            
            const body = await respostaDoServidor.body
// console.log(body.access_token)
            tokenService.save(body.access_token)
        })
    },
    async getSession(ctx) {
        const token = tokenService.get(ctx)

        return HttpClient(`${process.env.NEXT_PUBLIC_URL}/session`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
    }
}