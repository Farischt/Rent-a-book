import { API_BASE_URL } from "./services.config"

class AssetApi {
  getEncodedBookPicture(assetId) {
    return `${API_BASE_URL}/assets/books/${encodeURIComponent(assetId)}`
  }

  getEncodedProfilePicture(assetId) {
    return `${API_BASE_URL}/assets/users/${encodeURIComponent(assetId)}`
  }
}

export default new AssetApi()
