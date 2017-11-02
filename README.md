## Install first

- Node (6+)
- Docker
- Serverless `npm install serverless -g`
- Sequelize-cli `npm install sequelize-cli -g`

## Running the development suite

- Add `dev-itsprov.uq.edu.au` to your hosts file
- `docker-compose up --build` in the `.docker` directory
- `yarn` in the root directory to install (local) dependencies
- `sequelize db:migrate` and `sequelize db:seed` to setup the database with some data
- `yarn serve` to run the development version (via serverless-offline)
- Go to `http://dev-itsprov.uq.edu.au:4000/login`