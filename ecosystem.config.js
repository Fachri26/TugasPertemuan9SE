module.exports = {
  apps : [
    {
      name: "auth-service",
      cwd: "./auth-service", 
      script: "./src/app.js", 
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "order-service",
      cwd: "./order-service", 
      script: "./src/app.js",
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "consumer-service",
      cwd: "./consumer", 
      script: "./src/consumer.js",
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "api-gateway",
      cwd: "./api-gateway", 
      script: "./src/app.js",
      env: {
        NODE_ENV: "development",
      }
    }
  ]
}