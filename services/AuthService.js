import axios from "axios"
import { API_BASE_URL } from "./services.config"

class AuthService {
  constructor() {
    this.URI = API_BASE_URL + "/auth"
  }

  async login(credentials) {
    return (
      credentials &&
      credentials.email &&
      credentials.password &
        (await axios.post(`${this.URI}/login`, credentials))
    )
  }

  async register(data) {
    return (
      data &&
      data.first_name &&
      data.last_name &&
      data.email &&
      data.password &&
      data.repeatPassword &&
      (await axios.post(`${this.URI}/register`, data))
    )
  }

  async logout() {
    return await axios.post(`${this.URI}/logout`)
  }
}

export default new AuthService()
