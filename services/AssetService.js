import { API_BASE_URL } from "./services.config"

class AssetApi {
  getEncoded(assetId) {
    return `${API_BASE_URL}/assets/${encodeURIComponent(assetId)}`
  }
}

export default new AssetApi()
