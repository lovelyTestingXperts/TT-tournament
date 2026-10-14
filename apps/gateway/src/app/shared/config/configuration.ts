export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),

  mongoUri: process.env.MONGO_URI,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

  notificationRetentionDays: parseInt(process.env.NOTIFICATION_RETENTION_DAYS ?? '10', 10),
});