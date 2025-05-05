# Brev.ly

<p align="center"> 
  <a href="https://www.figma.com/design/38Z1s9VnoA1kB4xPv1IQBd/Encurtador-de-Links--Community-?node-id=0-1&m=dev&t=k6jeOmvV7h9NzLTt-1">
    <img alt="Figma Badge" src="https://img.shields.io/badge/Figma-%23F24E1E?style=flat&logo=figma&logoColor=%23FFFFFF">
  </a>
</p>

<p align="center">
 <a href="#-about">About</a> •
 <a href="#-features">Features</a> • 
 <a href="#-technologies">Technologies</a> • 
 <a href="#-how-to-run">How to Run</a>
</p>

<br/>

## 📑 About

Brev.ly is a FullStack URL shortening application, developed as part of my **Pós Tech Developer 360** postgraduate course at **Rocketseat**. The project aims to create a platform that allows the registration, listing, and removal of shortened links, as well as generating reports with the number of accesses for each link. The application also ensures the correct redirection of shortened links to their original URLs, providing a practical and efficient solution to optimize link sharing and monitor the generated traffic.

<br/>

## 🚀 Features

- **Shortened link registration:** allows the user to quickly and easily create short links from long URLs.

- **Link listing:** displays all the shortened links registered in the system for easy access and viewing.

- **Link removal:** provides the option to delete shortened links simply and efficiently.

- **Access reports:** generates reports with the number of accesses for each link, which can be exported to CSV format for detailed analysis.

- **Redirection:** ensures that shortened links correctly redirect users to the original URLs.

<br/>

## 🛠 Technologies

**Front-end:**

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sentry](https://sentry.io/welcome/)

<br/>

**Back-end:**

- [Node.js](https://nodejs.org/en)
- [Fastify](https://fastify.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle](https://orm.drizzle.team/)
- [Scalar](https://scalar.com/)
- [Cloudflare](https://www.cloudflare.com/)

<br/>

**Others:**

- [Docker](https://www.docker.com/)

<br/>

## 📦 How to Run

To run the application, make sure you have [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) and [pnpm](https://pnpm.io/) installed.

### Server

1. Navigate to the server folder:

```bash
cd server
```

2. Install the dependencies using pnpm:

```bash
pnpm install
```

3. Build and start the containers:

```bash
docker-compose up --build -d
```

4. Then, run the following inside the app container:

```bash
pnpm run db:migrate
```

These command apply the database migrations using Drizzle and PostgreSQL.

Your server should now be running on the defined port (default is 3333).

<hr />

To run the tests, follow these steps:

1. Make sure you have the .env.test file configured with the correct environment variables for testing.

2. Run the following command to start the Docker containers for testing:

```bash
pnpm run docker:test
```

3. Once the containers are up and running, execute the following command to run the tests:

```bash
pnpm run test
```

<br/>

### Web App

To run the front-end of the application, follow these steps:

1. Navigate to the web folder:

```bash
cd web
```

2. Install the dependencies using pnpm:

```bash
pnpm install
```

3. Then, run the development server:

```bash
pnpm run dev
```

This will start the front-end and you will be able to access the application locally. By default, it will be available on port 4000, unless configured otherwise.

<hr />

Run the following command to execute the tests:

```bash
pnpm run test
```
