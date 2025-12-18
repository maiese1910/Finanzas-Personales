import { analyzeFinances, getFinanceInsights } from '../controllers/aiController.js';

const router = express.Router();

router.get('/analyze/:userId', analyzeFinances);
router.get('/insights/:userId', getFinanceInsights);

export default router;
