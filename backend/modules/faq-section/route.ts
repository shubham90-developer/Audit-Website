import { Router } from 'express'
import { upload } from '../../middlewares/upload'
import { getFaqSection, updateFaqSection } from './controller'
const router = Router()
router.get('/', getFaqSection)
// IMPORTANT: add your existing admin auth middleware to PUT before deploying.
router.put('/', upload.fields([{ name: 'backgroundImageEn', maxCount: 1 }, { name: 'backgroundImageAr', maxCount: 1 }]), updateFaqSection)
export const faqSectionRouter = router
