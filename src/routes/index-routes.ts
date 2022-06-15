import { Router } from "express";
import authRoutes from './auth-routes'
import userRoutes from './users-routes'

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/user", userRoutes)

export default routes;