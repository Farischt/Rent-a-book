import axios from "axios"
import { API_BASE_URL } from "./services.config"

class BookService {
  constructor() {
    this.URI = API_BASE_URL + "/books"
  }

  async borrow(slug) {
    return slug && (await axios.post(`${this.URI}/borrow/${slug}`))
  }

  async return(slug) {
    return slug && (await axios.patch(`${this.URI}/return/${slug}`))
  }
}

export default new BookService()
