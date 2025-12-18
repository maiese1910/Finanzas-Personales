import { analyzeFinances, getFinanceInsights } from '../controllers/aiController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/analyze/:userId', analyzeFinances);
router.get('/insights/:userId', getFinanceInsights);

export default router;
