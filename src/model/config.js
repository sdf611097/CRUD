function getFromEnvOrDefault(env, defaultValue) {
    env = env.toUpperCase();
    return process.env[env] ? process.env[env] : defaultValue;
}

//avoid maximum Line Length
const host = 'postgresql-9-6-6.cwzsvit5sayh.us-east-1.rds.amazonaws.com';

const configs = {
    // DB
    // Warning! We should never expose every connection info in git records.
    DB_HOST: getFromEnvOrDefault('DB_HOST', host),
    DB_PORT: getFromEnvOrDefault('DB_PORT', '5432'),
    DB_USERNAME: getFromEnvOrDefault('DB_USERNAME', 'demo_username'),
    DB_PASSWORD: getFromEnvOrDefault('DB_PASSWORD', 'demo_password'),
    DB_NAME: getFromEnvOrDefault('DB_NAME', 'crud'),
};
module.exports = configs;
