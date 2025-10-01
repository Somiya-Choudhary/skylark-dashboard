import { Hono } from "hono";
import { getUserData } from "../controllers/userController.mjs";
import { authMiddleware } from "../middleware/authMiddleware.mjs";

const apiRouter = new Hono();

apiRouter.use('*', authMiddleware());
apiRouter.get('/user',getUserData);


export default apiRouter;