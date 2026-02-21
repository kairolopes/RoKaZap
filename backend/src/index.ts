import http from "http";
import app from "./server";

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
});
