import AuthController from "@/server/controllers/AuthController"

export default async (req, res) => {
  if (req.method === "POST") {
    await AuthController.passwordRequest(req, res)
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
