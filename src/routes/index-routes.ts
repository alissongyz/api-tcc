import { Router } from "express";
import authRoutes from './auth-routes'
import userRoutes from './users-routes'
import materialRoutes from './materials-routes'

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/user", userRoutes)
routes.use("/material", materialRoutes)

export default routes;