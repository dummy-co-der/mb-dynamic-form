import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import formSchemaRoute from "./routes/form-schema";
import submissionsRoute from "./routes/submissions";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Backend is running in TypeScript!" });
});

app.use("/api/form-schema", formSchemaRoute);
app.use("/api/submissions", submissionsRoute);
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});


app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
