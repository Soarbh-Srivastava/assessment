import { db } from "./index";
import { Product } from "./Product";

const TOTAL = 200000;
const BATCH = 5000;
const CATEGORIES = ["Electronics", "Clothing", "Home", "Toys", "Books"];

async function seed() {
  await db.initialize();
  console.log("DB Connected. Seeding...");

  for (let batchStart = 0; batchStart < TOTAL; batchStart += BATCH) {
    const productsBatch = [];
    for(let j=0;j<BATCH;j++){
        const productNumber = batchStart + j;
        productsBatch.push({
            name: `Product ${productNumber}`,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            price: Number((Math.random() * 100).toFixed(2)),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        });
    }
    await Product.createQueryBuilder()
    .insert()
    .into(Product)
    .values(productsBatch)
    .execute();
    console.log(`Inserted ${batchStart + BATCH} products out of ${TOTAL}...`);
}

}

seed();