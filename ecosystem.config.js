module.exports = {
  apps : [
    {
      name: "2410511096-auth-service",
      cwd: "./auth-service", 
      script: "./src/app.js", 
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "2410511096-order-service",
      cwd: "./order-service", 
      script: "./src/app.js",
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "2410511096-consumer-service",
      cwd: "./consumer", 
      script: "./src/consumer.js",
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "2410511096-api-gateway",
      cwd: "./api-gateway", 
      script: "./src/app.js",
      env: {
        NODE_ENV: "development",
      }
    }
  ]
}