import { getComposition, submitBlockComposition, validateBlockComposition } from '../controllers/atlas.controller';
import router from './atlas.route';

router.get('/', getComposition);
router.post('/submit', submitBlockComposition);
router.post('/validate', validateBlockComposition);

export default router;
