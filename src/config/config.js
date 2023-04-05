const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    PASSWORD_SALT: Joi.string().required().description("Password salt is required"),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    DATABASE_NAME: Joi.string().required().description('Database name is required'),
    AWS_ACCESS_KEY: Joi.string().required().description('AWS access key is required'),
    AWS_SECRET_KEY: Joi.string().required().description('AWS secret key is required'),
    AZURE_CLIENT_ID:Joi.string().required().description('Azure client id is required'),
    AZURE_TENANT_ID:Joi.string().required().description('Azure tenant id is required'),
    AZURE_CLIENT_SECRET:Joi.string().required().description('AWS secret  is required'),
    AZURE_DOMAIN:Joi.string().required().description('Azure domain name is required'),
    AZURE_SUBSCRIPTION_ID:Joi.string().required().description('Azure subscription is required'),
    AWS_REGION: Joi.string().required().description("AWS region is required"),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  passwordSalt:envVars.PASSWORD_SALT,
  aws:{
    accessKey:envVars.AWS_ACCESS_KEY,
    secretKey:envVars.AWS_SECRET_KEY,
    region:envVars.AWS_REGION
  },
  azure:{
    clientId:envVars.AZURE_CLIENT_ID,
    secretKey:envVars.AZURE_CLIENT_SECRET,
    tenantId:envVars.AZURE_TENANT_ID,
    domain:envVars.AZURE_DOMAIN,
    subscription:envVars.AZURE_SUBSCRIPTION_ID
  },
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: envVars.DATABASE_NAME,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
//   email: {
//     smtp: {
//       host: envVars.SMTP_HOST,
//       port: envVars.SMTP_PORT,
//       auth: {
//         user: envVars.SMTP_USERNAME,
//         pass: envVars.SMTP_PASSWORD,
//       },
//     },
//     from: envVars.EMAIL_FROM,
//   },
};
