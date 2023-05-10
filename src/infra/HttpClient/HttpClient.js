export async function HttpClient(fetchUrl, fetchOption) {
    return fetch(fetchUrl, {
        ...fetchOption,
        headers: {
            'Content-Type': 'application/json',
            ...fetchOption.headers
        },
        body: fetchOption.body? JSON.stringify(fetchOption.body) : null
    })
        .then(async (respostaDoServidor) => {
            return {
                ok: respostaDoServidor.ok,
                body: await respostaDoServidor.json()
            }
        })
} 