import { HttpClient } from "../../infra/HttpClient/HttpClient"
import { tokenService } from "../auth/tokenService"

export const api = {
  async getInformation (ctx, endPoint) {
    const token = tokenService.get(ctx)  

    return HttpClient(`${process.env.NEXT_PUBLIC_URL}/usuario/${endPoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
      }
    })
  },
  async postInformation(endPoint, infos, ctx = null) {
    const token = tokenService.get(ctx)

    return HttpClient(`${process.env.NEXT_PUBLIC_URL}/usuario/${endPoint}`, {
        method: 'POST',
        body: infos,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
      
  },
  async putInformation(endPoint, infos, ctx = null) {
      const token = tokenService.get(ctx)

      return HttpClient(`${process.env.NEXT_PUBLIC_URL}/usuario/${endPoint}`, {
          method: 'PUT',
          body: infos,
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
  }
}