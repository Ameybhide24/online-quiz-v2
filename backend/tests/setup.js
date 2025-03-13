const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

exports.mochaHooks = {
    beforeAll: async () => {
        await mongoose.disconnect();
        
        // Create new in-memory mongo instace for testing
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = await mongoServer.getUri();
        
        await mongoose.connect(mongoUri);

        console.log('Connected to in-memory MongoDB:', mongoose.connection.name);

        await clearDatabase();
    },

    afterAll: async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    },
};

async function clearDatabase() {
    console.log("Clearing database before all tests...");
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
}