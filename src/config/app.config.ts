export const AppConfig = (): IAppConfig => {
  const port = parseInt(process.env.PORT || "3000");
  return {
    port,
    env: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET || "urna",
    salts: parseInt(process.env.SALTS || "5"),
    frontEndUrl: process.env.FRONTEND_URL || "http://localhost:4200",
    url: process.env.URL || `http://localhost:${port}`,
    email: {
      address: process.env.EMAIL_ADDRESS,
      password: process.env.EMAIL_PASSWORD,
    },
  };
};

interface IAppConfig {
  port: number;
  env: string;
  jwtSecret: string;
  salts: number;
  frontEndUrl: string;
  url: string;
  email: {
    address: string;
    password: string;
  };
}
