import app from "./app";
import batch from "./batch";

batch.initialize();

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running ! => ${process.env.APP_PROJECT}`);
  console.log(`DOMAIN: ${process.env.APP_DOMAIN}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${process.env.APP_PORT}`);
});
