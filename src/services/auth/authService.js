

export const authService = {
    async login ({email, senha}) {
        fetch('http://localhost:5000/login', {
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
            if(!respostaDoServidor.ok)
                throw new Error('Usuário ou senha inválidos')
            
            const body = await respostaDoServidor.json()

            console.log(body)
        })
    }
}