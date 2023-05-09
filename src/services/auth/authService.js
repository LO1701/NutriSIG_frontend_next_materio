import { HttpClient } from "../../infra/HttpClient/HttpClient"

export const authService = {
    async login ({email, senha}) {
        return HttpClient(`${process.env.NEXT_PUBLIC_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                senha
            })
        })
        .then(async (respostaDoServidor) => {
            console.log('>>>'+respostaDoServidor.ok)
            if(!respostaDoServidor.ok)
                throw new Error('Usuário ou senha inválidos')
            
            const body = await respostaDoServidor

            console.log(body)
        })
    }
}