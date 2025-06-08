# Survey-Program

## Run program with docker:

Add these to your server/.env file

    MONGO_URI=
    PORT=8080
    JWT_SECRET=

Run line

    docker-compose up --build

## Sample Users you can login to

    (Super User)
    E-mail: superuser@gmail.com
    Password: 1234

    (Experimenter)
    E-mail: experimenter@gmail.com
    Password: 1234

    (Experimentee)
    E-mail: experimentee@gmail.com
    Password: 1234

## Script to create a new superuser account

Replace email, password, and name with your custom values

    node server/src/scripts/createUser.js <email> <password> "<name>"

## Run Program Manually:

Add these to your server/.env file

    MONGO_URI=
    PORT=8080
    JWT_SECRET=

Open terminal, go to client folder, install dependencies, and start server

    cd client
    npm install
    npm start

Open a second terminal, go to server folder, install dependencies, and start server

    cd server
    npm install
    npm run dev
