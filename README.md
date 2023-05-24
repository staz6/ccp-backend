# ccp-backend
Back-end repository of our Centralized cloud platform FYP.

- Allow user to login and regsiter to the app
- Allow user to manage and deploy AWS resources from the platform
- Allow user to manage and deploy Azure resources from the platform
- Recommend user best resources according to his price range and requirments

The app allows use to manage our different cloud services provider from one platform

<a href="https://the-example-app-nodejs.herokuapp.com/" target="_blank"><img src="https://images.contentful.com/qz0n5cdakyl9/4GZmvrdodGM6CksMCkkAEq/700a527b8203d4d3ccd3c303c5b3e2aa/the-example-app.png" alt="Screenshot of the example app"/></a>

## Requirements

* Node 18
* Git
* insomnia or postman (to test the api's)

## Setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/staz6/ccp-backend.git
```

```bash
npm install
```

```bash
npm run dev
```

## Env files

The app require .env file to get the enviornment variables and run.

```
# Port number
PORT=3002

# URL of the Mongo DB
MONGODB_URL=''
DATABASE_NAME=CCP
# Password salt
PASSWORD_SALT=verysecretsalt


AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=

AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_DOMAIN=
AZURE_SUBSCRIPTION_ID=
AZURE_TENANT_ID=

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
#SMTP_HOST=email-server
#SMTP_PORT=587
#SMTP_USERNAME=email-server-username
#SMTP_PASSWORD=email-server-password
#EMAIL_FROM=support@yourapp.com
```

