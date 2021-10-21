import Database from "@/server/database"

export default async (req, res) => {
  if (req.method === "GET") {
    if (typeof req.query.id !== "string") {
      res.statusCode = 400
      return res.json({ error: "bad_request" })
    }

    const asset = await Database.Asset.findByPk(req.query.id)
    if (!asset) {
      res.statusCode = 404
      return res.send()
    }

    res.statusCode = 200
    res.setHeader("Content-Type", asset.mime_type)
    res.setHeader("Cache-Control", "max-age=600")
    res.send(asset.content)
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
