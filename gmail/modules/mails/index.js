import { Router } from 'express';
import * as controllers from './controllers';


const router = Router();

router.post('/', controllers.addMail)
router.get('/', controllers.getMails)
router.get('/watch', controllers.watchEmail)


export default router;