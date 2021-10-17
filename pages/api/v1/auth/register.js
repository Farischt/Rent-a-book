import AuthController from "@/server/controllers/AuthController"

export default async (req, res) => {
  if (req.method === "POST") {
    await AuthController.register(req, res)
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
