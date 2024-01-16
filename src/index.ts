import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import createApolloGraphqlServer from "./graphql";

async function init() {
  const PORT = Number(process.env.PORT) || 8000;
  const app = express();

  app.use(cors());
  app.use(express.json());
  
  app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
  });
  app.use("/graphql", expressMiddleware(await createApolloGraphqlServer()));
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}

init();
