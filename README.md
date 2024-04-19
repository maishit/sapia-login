## Clone the repo

```bash
$ git clone https://github.com/maishit/sapia-login.git 
$ cd sapia-login
$ cp .env.example .env
```

## Building and running the container

```bash
$ docker-compose up
```

## Seeding data

```bash
$ docker exec -it sapia-login npm run seed
```

## Testing login API

```bash
$ curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "hano", "password": "123456"}'
```

```json
// The response will be like:
{
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjIyODc1OWYzMGU2YjJjYjVhOTM5MmMiLCJ1c2VybmFtZSI6Imhhbm8iLCJpYXQiOjE3MTM1NDEwNDMsImV4cCI6MTcxMzU0MTA0M30.mo_GAUiicN0uNR4DLbjWPilbEi7gWt0TjhRFaeTXW08"
    },
    "message": "success",
    "code": 1000,
    "cur_time": 1713541043
}
```

## Unit Test and e2e Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
<img width="764" alt="image" src="https://github.com/maishit/sapia-login/assets/143973635/9b8c8824-a985-46e9-bf13-94f60361eaaa">

