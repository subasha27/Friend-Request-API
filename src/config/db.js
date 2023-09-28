const { default: mongoose } = require("mongoose")

const mongoURI = 'mongodb+srv://subash:atlas123@cluster0.yujnvsk.mongodb.net/userCrud?retryWrites=true&w=majority';


const connectDB = async () => {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };
  
  module.exports = connectDB;