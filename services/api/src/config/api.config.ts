import { registerAs } from '@nestjs/config';

export default registerAs('api', () => {
  const port = Number(process.env.API_PORT) || 3000;
  const host = process.env.API_HOST || 'localhost';

  return {
    port: port,
    url: `http://${host}:${port}`,
  };
});
