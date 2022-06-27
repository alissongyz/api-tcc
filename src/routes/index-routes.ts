import { Router } from "express";
import authRoutes from './auth-routes'
import userRoutes from './users-routes'
import materialRoutes from './materials-routes'
import OrderRoutes from './Order-routes'
import medicinesRoutes from './medicines-routes'

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/user", userRoutes)
routes.use("/material", materialRoutes)
routes.use("/order", OrderRoutes)
routes.use("/medicines", medicinesRoutes)

export default routes;