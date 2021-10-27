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

      const book = Database.Book.build({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
      })

      book.setSlug(req.body.title)
      await book.save()

      await Database.BookPicture.create({
        file_name: req.files.image.name,
        mime_type: req.files.image.type,
        content: await fs.readFile(req.files.image.path),
        book_id: book.id,
      })

      res.statusCode = 201
      res.json(book)
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.json({ error: "internal_server_error" })
    }
  }

  //! Borrow a book
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
      }

      //! Change with is book available method
      const { count } = await Database.Loan.findAndCountAll({
        where: {
          book_id: book.id,
          deposit_date: null,
        },
      })
      if (count === 1) {
        res.statusCode = 403
        return res.json({ error: "book_not_available" })
      }

      await Database.Loan.create({
        user_id: user.id,
        book_id: book.id,
        loan_date: Date.now(),
        due_date: Date.now() + 7 * 86400000,
      })

      res.statusCode = 200
      res.json({
        success: true,
        book: book.id,
        user: user.id,
      })
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.json({ error: "internal_server_error" })
    }
  }

  //! Returns a book
  async return(req, res) {
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
      }

      const loan = await Database.Loan.findOne({
        where: {
          user_id: user.id,
          book_id: book.id,
          deposit_date: null,
        },
      })

      if (!loan) {
        res.statusCode = 404
        return res.json({ error: "loan_not_found" })
      }

      loan.deposit_date = Date.now()

      const loanDate = new Date(loan.loan_date)
      const depositDate = Date.now()

      console.log(depositDate - loanDate.getTime())

      if (depositDate - loanDate.getTime() < 0) {
        //! Handle case were user returned the book late
        console.log(depositDate - loanDate.getTime() < 0)
      }

      loan.save()
      res.statusCode = 200
      res.json({
        success: true,
      })
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.json({ error: "internal_server_errors" })
    }
  }
}

export default new BookController()
