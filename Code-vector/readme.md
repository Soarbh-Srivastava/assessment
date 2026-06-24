# CodeVector Product Catalog API

A high-performance backend built to handle concurrent updates and fast pagination across a dataset of 200,000+ products. 

## 🚀 Live Demo
* **Frontend UI:** [Insert Frontend URL]
* **Backend API:** [Insert Render API URL]

## 🛠️ Tech Stack
* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL (Hosted on Render)
* **ORM:** TypeORM
* **Frontend:** React, Vite, Tailwind CSS

## 🧠 Core Architectural Decisions

### 1. Cursor-Based Pagination (Tuple Comparison)
Traditional `OFFSET` pagination causes data duplication or skipped items when rows are inserted or deleted during a user's session. To solve this, this API uses **Keyset/Cursor Pagination**.
* The API returns a Base64 encoded cursor containing the `createdAt` and `id` of the last item.
* The subsequent query uses PostgreSQL tuple comparison: `WHERE (createdAt, id) < (cursorDate, cursorId)`.
* This guarantees stable pagination regardless of concurrent database writes.

### 2. Compound Indexing
To ensure the cursor pagination remains lightning-fast across hundreds of thousands of rows, the `Product` entity utilizes compound B-Tree indexes:
* `@Index(["createdAt", "id"])` for standard chronological browsing.
* `@Index(["category", "createdAt", "id"])` for category-filtered browsing.

### 3. Fast Batch Seeding
Generating 200,000 records via sequential inserts is highly inefficient. The included `seed.ts` script utilizes memory chunking and TypeORM's QueryBuilder to execute bulk `INSERT` statements in batches of 5,000, completing the seeding process in seconds.

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd <your-repo-folder>
npm install