# TWA Leuven

## Introduction

This project is a full-stack application with a backend and frontend. You can start the project using Docker or by manually setting up the backend and frontend.

## Table of Contents

- [TWA Leuven](#twa-leuven)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Creating .env](#creating-env)
  - [Starting the Project with Docker](#starting-the-project-with-docker)
  - [Manual Setup](#manual-setup)
    - [DataBase Setup](#database-setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Navigation and Creating New Pages](#navigation-and-creating-new-pages)
  - [Coordinate Mapping for Canvas Play City Images](#coordinate-mapping-for-canvas-play-city-images)
  - [Sources](#sources)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Node.js](https://nodejs.org/) installed on your machine.
- [WSL](https://learn.microsoft.com/en-us/windows/wsl/install#install-wsl-command) installed on your machine.
- [MySQL](https://dev.mysql.com/downloads/file/?id=52697) installed on your machine.

## Creating .env

In the root of the backend folder, create a file named `.env` with the following content:

```sh
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=twa
JWT_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
JWT_EXPIRES_HOURS=8
MAIL_USER='XXX@gmail.com'
MAIL_PASSWORD='XXXX XXXX XXXX XXXX'
ENC_KEY = 'X'
```

1. Database Setup:

Replace the placeholders for the database properties (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) with the actual credentials of your MySQL account. See [DataBase Setup](#database-setup) for details.

2. JWT Secret:

Replace the JWT_SECRET placeholder with a valid secret key. The provided template consists of X's as an example.

3. Email Setup:

Create a Gmail account if you do not have one.
Generate an 'app password' from your Gmail account settings and replace the MAIL_PASSWORD placeholder with this app password (XXXX XXXX XXXX XXXX).

4. Encryption Key:

Choose and replace the ENC_KEY placeholder with your own encryption key string for microbit encryption.

## Starting the Project with Docker

Before proceeding to the following steps, first go through [Database Setup](#database-setup).

To start the project using Docker, follow these steps:

1. Open a terminal and navigate to the root directory of the project.
2. Run the following command:

   ```sh
   docker-compose up --build
   ```

3. Open your browser and surf to `http://localhost/`.

This command will build and start the containers for both the backend and frontend.

## Manual Setup (These steps are ONLY required for when the docker setup doesn't work!!!!!)

If you prefer to set up the project manually, follow the instructions below for both the backend and frontend.

### Database Setup

1. Open WSL on your machine

2. Install packages and start up mysql-server

   ```sh
      sudo apt update
   ```

   ```sh
      sudo apt install mysql-server
   ```

   If you have restarted your PC or are running MySQL for the first time, you may need to start MySQL again by using the following command:

   ```sh
   sudo service mysql start
   ```

3. Login to MySQL using WSL:

   2. In the WSL terminal, enter the following command to login to MySQL, replacing `{username}` with your MySQL username:

      ```sh
      mysql -u {username} -p
      ```

   3. When prompted, enter your MySQL password. Note that the password will not be displayed as you type it for security reasons.

      ```sh
      Enter password: ********
      ```

   You should now be logged in to the MySQL command line interface within the WSL environment.

4. After logging in, copy and paste the contents of `db.ddl` to create the schema. You can open `db.ddl` from the root of the project and copy its contents, then paste them into the MySQL command line.

   ```sh
   mysql> <paste the contents of db.ddl here>
   ```

   > ⚠️ **Warning:** You might encounter an error message in WSL about wrong syntax for 'DELIMITER':
   >
   > ```
   > ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'DELIMITER' at line 1
   > ```
   >
   > This error is common and can be safely ignored. Proceed with entering your MySQL password as usual.

You should now have the database schema created within the MySQL database.
Alternatively, you can also set up your database through MySQL Workbench, which you can install on your machine aswell.

### Backend Setup

1. Open a terminal and navigate to the `backend` directory:

   ```sh
   cd backend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Seed the database:

   ```sh
   node util/seed.js > seed.sql
   ```

4. Start the backend server (if applicable):

   ```sh
   npm start
   ```

### Frontend Setup

1. Open a terminal and navigate to the `frontend` directory:

   ```sh
   cd frontend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Open `index.html` in your default browser using Visual Studio Code:

   - Right-click on `index.html`.
   - Select `Open In Default Browser`.

Alternatively, you can open `index.html` in your default browser by navigating to the file location and double-clicking it.
Another way is opening your browser and surfing to the url `http://localhost:52330/frontend/index.html`.

### Next Step

When everything is set up correctly, you can now log in as a teacher with the following credentials:

- Email: `twaleuvennoreply@gmail.com`
- Password: `Admin#Secure$2024`

### Navigation and Creating New Pages

This subsection explains how navigation works in your frontend using NavSim. It provides a basic guide on how to create a new page (`about.html` in this example) and integrate it into your routing setup.

1. Create a new `about-page.js` component in the folder `frontend/js/components/pages`

2. import the page component in the <head> of the `index.html` found at `frontend/` as follows: `<script src="js/components/pages/about-page.js" type="module" defer></script>`

3. In `frontend/js/navSim.js` add a new navs Enum entry: `ABOUT: "<about-page></about-page>"` see line 1 make sure that the `<about-page></about-page>` matches `customElements.define("about-page", AboutPage);` found in the `about-page.js`

4. Add the Enum to a permission ANY, LOGIN or LEERKRACHT in the function hasPermission of the securityReqs object

5. You can now switch to other components by using: `navs.switchView(navs.SAVE_WORKSHOP);`

### Coordinate Mapping for Canvas Play City Images

The Canvas Play City utilizes a coordinate mapping approach to define the positions of images within the cityscape. This process is facilitated through the use of the following website for pinpointing image coordinates:

https://programminghead.com/Projects/find-coordinates-of-image-online.html

Subsequently, the my-city component employs a collideWithPolygon function. This function is instrumental in detecting mouse clicks within the defined polygonal areas, thereby simulating collision detection with the city's buildings in a manner akin to traditional collision mechanics.

# Sources

- The documentation and code of this Github repository: https://github.com/Kekuolis/uart/tree/main . Helped us create the code for the micro:bit in our project. Our micro:bit code is inspired by this repository.
