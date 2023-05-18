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
  async postInformation(ctx) {
      const token = tokenService.get(ctx)

      return HttpClient(`${process.env.NEXT_PUBLIC_URL}/session`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      
  }
}