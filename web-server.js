import http from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { port, origin } from "./config/web-server.js";
import { adminBro, adminRouter } from "./adminBro.js";

let httpServer;

export const initialize = () => {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    app.use(adminBro.options.rootPath, adminRouter);
    app.use(morgan("combined"));
    app.use(express.json());
    app.use(cookieParser());
  });
};
export const close = () => {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
