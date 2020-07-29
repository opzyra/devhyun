import app from './src/app';
import CONFIG from './src/config';

app.listen(
  CONFIG.CTX.PORT,
  () => {
    console.log(`Server is running ! => ${CONFIG.CTX.PROJECT}`);
    console.log(`DOMAIN: ${CONFIG.CTX.DOMAIN}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`PORT: ${CONFIG.CTX.PORT}`);
  }
);
