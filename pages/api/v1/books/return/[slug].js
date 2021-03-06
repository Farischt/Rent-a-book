import BookController from "@/server/controllers/BookController"

export default async (req, res) => {
  if (req.method === "PATCH") {
    await BookController.return(req, res)
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
