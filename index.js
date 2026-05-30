const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");


    const database = client.db("kindredPawsDB");
    const petsCollection = database.collection("pets");

    app.post('/api/pets', async (req, res) => {
      try {
        const newPet = req.body;

        if (!newPet.name || !newPet.species || !newPet.location) {
          return res.status(400).json({ message: "Missing required fields (Name, Species, or Location)" });
        }

        if (newPet.adoptionFee) {
          newPet.adoptionFee = parseFloat(newPet.adoptionFee) || 0;
        }

        const result = await petsCollection.insertOne(newPet);
        res.status(201).json({
          success: true,
          message: "Pet recorded safely!",
          insertedId: result.insertedId
        });
      } catch (error) {
        console.error("Database insert error:", error);
        res.status(500).json({ message: "Internal Server Error saving pet listing" });
      }
    });


  } catch (error) {
    console.error("Database connection error:", error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('KindredPaws Server is running smoothly with CommonJS!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});