import { promises as fs } from "fs"
import Backend from "@/server/index"
import Database from "@/server/database"

class BookController {
  //! Creates a book
  async create(req, res) {
    await Backend.parseMultipart({ req, res })
    const user = await Backend.getAuthenticatedUser({ req, res })
    if (!user) {
      res.statuCode = 401
      return res.json({ error: "unauthorized" })
    } else if (!user.admin) {
      res.statusCode = 403
      return res.json({ error: "forbidden" })
    } else if (
      typeof req.body.title !== "string" ||
      req.body.title.length === 0
    ) {
      res.statusCode = 400
      return res.json({ error: "missing_title" })
    } else if (
      typeof req.body.author !== "string" ||
      req.body.author.length === 0
    ) {
      res.statusCode = 400
      return res.json({ error: "missing_author" })
    } else if (
      typeof req.body.content !== "string" ||
      req.body.content.length === 0
    ) {
      res.statusCode = 400
      return res.json({ error: "missing_content" })
    } else if (!req.files.image || req.files.image.size === 0) {
      res.statusCode = 400
      return res.json({ error: "missing_file" })
    }

    try {
      if (await Database.Book.isConflict(req.body.title)) {
        res.statusCode = 409
        return res.json({ error: "existing_book" })
      }

      const asset = await Database.Asset.create({
        file_name: req.files.image.name,
        mime_type: req.files.image.type,
        content: await fs.readFile(req.files.image.path),
      })

      const book = Database.Book.build({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        asset_id: asset.id,
      })
      book.setSlug(req.body.title)
      await book.save()

      res.statusCode = 201
      res.json(book)
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.json({ error: "internal_server_error" })
    }
  }

  async borrow(req, res) {
    const user = await Backend.getAuthenticatedUser({ req, res })
    if (!user) {
      res.statusCode = 401
      return res.json({ error: "unauthorized" })
    } else if (typeof req.query.slug != "string") {
      res.statusCode = 400
      return res.json({ error: "missing_slug" })
    }

    try {
      const book = await Database.Book.getBySlug(req.query.slug)

      if (!book) {
        res.statusCode = 404
        return res.json({ error: "book_not_found" })
      } else if (book.user_id && book.user_id === user.id) {
        res.statusCode = 403
        return res.json({ error: "book_already_owned" })
      } else if (book.user_id) {
        res.statusCode = 403
        return res.json({ error: "unavailable_book" })
      }

      book.user_id = user.id
      await book.save()

      res.statusCode = 200
      res.json({
        success: true,
        book: book.id,
        user: book.user_id,
      })
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.json({ error: "internal_server_error" })
    }
  }
}

export default new BookController()
