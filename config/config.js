const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "suppersecret",
    mongoUri: process.env.MONGODB_URI ||
      process.env.MONGO_HOST ||
      "mongodb+srv://emma2:9V8X3Q86aCUQVvhi@cluster0.pe3wy.mongodb.net/marketplace?retryWrites=true&w=majority"
  }
  
  export default config