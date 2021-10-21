import { API_BASE_URL } from "./services.config"

class AssetApi {
  getEncoded(assetId) {
    return `${API_BASE_URL}/assets/books/${encodeURIComponent(assetId)}`
  }

  getProfilePicture(assetId) {
    return `${API_BASE_URL}/assets/users/${encodeURIComponent(assetId)}`
  }
}

export default new AssetApi()
