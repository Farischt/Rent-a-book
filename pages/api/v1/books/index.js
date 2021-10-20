import BookController from "@/server/controllers/BookController"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  if (req.method === "POST") {
    await BookController.create(req, res)
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
