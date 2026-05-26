import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { adminRouter } from "./routes/admin.js";
import { contactRouter } from "./routes/contact.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

const origins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || origins.includes(origin)) cb(null, true);
      else cb(new Error("CORS bloqueado"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true, service: "mds-api" }));

app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);

app.listen(port, () => {
  console.log(`MDS API rodando na porta ${port}`);
});
