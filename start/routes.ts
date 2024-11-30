/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const CitiesApiController = () => import('#controllers/api/cities.controller')
const StationsController = () => import('#controllers/http/stations.controller')
const StationsApiController = () => import('#controllers/api/stations.controller')
const DepartmentsController = () => import('#controllers/http/departments.controller')
const DepartmentsApiController = () => import('#controllers/api/departments.controller')

// router.on('/').render('pages/start')

// Routes HTTP
router.get('/', [DepartmentsController, 'index'])
router.get('/stations/search', [StationsController, 'getFuelStationsByCity'])
router.get('/stations/:id', [StationsController, 'getFuelStationsById'])

// Routes API
router
  .group(() => {
    router.get('/departments', [DepartmentsApiController, 'index'])
    router.get('/stations/search', [StationsApiController, 'getFuelStationsByCity'])
    router.get('/stations/:id', [StationsApiController, 'getFuelStationsById'])
    router.get('/cities/search', [CitiesApiController, 'search'])
  })
  .prefix('/api')
