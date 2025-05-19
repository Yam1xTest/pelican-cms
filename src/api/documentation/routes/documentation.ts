// Configuring routing for a custom method
export default {
  routes: [
    {
      method: 'GET',
      path: '/documentation/swagger.json',
      handler: 'documentation.getSwaggerJson',
    }
  ]
}