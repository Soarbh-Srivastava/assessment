import 'dotenv/config'
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Product } from "./Product";

const app = express();
app.use(cors());
app.use(express.json()); 

export const db = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true, 
  entities: [Product],
});

app.get("/api/products", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const { category, cursor } = req.query as { category?: string; cursor?: string };

    const query = Product.createQueryBuilder("p")
      .orderBy("p.createdAt", "DESC")
      .addOrderBy("p.id", "DESC")
      .limit(limit);

    if (category) query.andWhere("p.category = :category", { category });

    if (cursor) {
      const { createdAt, id } = JSON.parse(Buffer.from(cursor, "base64").toString());
      query.andWhere("(p.createdAt, p.id) < (:createdAt, :id)", { createdAt, id });
    }

    const products = await query.getMany();

    let nextCursor = null;
    if (products.length === limit) {
      const last = products[products.length - 1];
      nextCursor = Buffer.from(JSON.stringify({ createdAt: last.createdAt, id: last.id })).toString("base64");
    }

    res.json({ data: products, nextCursor });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).json({ error: "Bad Request or Invalid Cursor" });
  }
});

db.initialize().then(() => {
  app.listen(3000, () => console.log("Server running on port 3000"));
});