const mongoose = require('mongoose');
const connectTestDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST || 
            'mongodb://localhost:27017/test_db');
        console.log('Test DB conectada');
    } catch (error) {
        console.error('Error conectando a test DB:', error);
        process.exit(1);
    }
};

const closeTestDB = async () => {
    await mongoose.connection.close(); 
};

const clearTestDB = async () => {
    const collections = mongoose.connection.collections;
    for(const key in collections){
        await collections[key].deleteMany({});
    }
}; 

module.exports = {
    connectTestDB,
    closeTestDB,
    clearTestDB
};