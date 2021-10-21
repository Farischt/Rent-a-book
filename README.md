# Rent a book service

This web application was created during the advanced web development course of Efrei Paris

## Installation

First, you'll need node.js and node package manager "npm" installed : [https://nodejs.org/en/].

- Our version of node.js : v14.17.0. **Make sure to use this version of node to avoid any compatibility issue**
- Our version of npm : v7.12.1.

## Technologies

Our project uses the following technologies :

- The React framework for production Next.js for both front-end and back-end (React + Node.js running on the same server).
- A postgreSQL database.

## Getting Started

### Database Design

![Image of UML Diagram](./UML.png)

### Without docker

Install all the dependencies by running the following command :

```bash
npm install
```

Create a file named .env.local at the root of the project which should be completed with the .env.example file [here](./.env.example). The application will not work if this step is not done, because the connection to the database will not be established.

**ATTENTION**: The mailing system only works with outlook service! If you are willing to use another service, you will have to modify the constructor in the file /server/mails/index.js [here](./server/mails/index.js)

```
this.transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: CREDENTIALS.APP_EMAIL,
        pass: CREDENTIALS.APP_PASSWORD,
      },
    })
```

Go to the file /server/database.js [here](./server/database.js) and change the following line of code :

On line 18 change false to true like following:

```
const sync = true
```

This line of code creates all the tables in database.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Go back to file /server/database.js and switch back to false.

```
const sync = false
```

Reload your browser, and that's it, your database is ready !

### With docker

Coming soon

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
