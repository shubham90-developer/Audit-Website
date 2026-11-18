import type { Request, Response } from 'express';
import { SiteSettingsModel } from './model';
import { uploadBuffer, deleteFromCloudinary } from '../../middlewares/upload';
const defaults = {"singleton": "site-settings", "companyName": {"en": "Ahmed Al Mazroei Auditing & Accounting", "ar": "أحمد المزروعي للتدقيق والمحاسبة"}, "tagline": {"en": "Auditing & Accounting", "ar": "التدقيق والمحاسبة"}, "address": {"en": "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi", "ar": "أبوظبي، الخالدية، شارع المدينة، مبنى سي شيل 19، مكتب M-02"}, "officeHours": {"en": "UAE business hours", "ar": "ساعات العمل في الإمارات"}, "footerDescription": {"en": "Professional audit, tax and accounting services in the UAE.", "ar": "خدمات التدقيق والضرائب والمحاسبة في الإمارات."}, "copyright": {"en": "© 2026. All rights reserved.", "ar": "© ٢٠٢٦. جميع الحقوق محفوظة."}, "footerQuickLinksTitle": {"en": "Quick Links", "ar": "روابط سريعة"}, "footerServicesTitle": {"en": "Our Services", "ar": "خدماتنا"}, "footerContactTitle": {"en": "Contact Us", "ar": "اتصل بنا"}, "headerFollowTitle": {"en": "FOLLOW US", "ar": "تابعونا"}, "whatsappCta": {"en": "Chat with us anytime", "ar": "تواصل معنا في أي وقت"}, "phone": "+97156 742 3428", "alternatePhone": "+971 52 178 6209", "email": "info@almazroeiaudit.com", "whatsapp": "+971521786209", "googleMapsUrl": "", "socials": {"instagram": "", "facebook": "", "youtube": "", "linkedin": "", "x": ""}};
const getOrCreate = () => SiteSettingsModel.findOneAndUpdate({singleton:'site-settings'},{$setOnInsert:defaults},{upsert:true,returnDocument:'after',setDefaultsOnInsert:true});
export const getSettings = async (_req:Request,res:Response) => {
 try { const data=await getOrCreate(); res.json({success:true,data}); }
 catch { res.status(500).json({success:false,message:'Unable to fetch settings'}); }
};
const localizedKeys = ["companyName", "tagline", "address", "officeHours", "footerDescription", "copyright", "footerQuickLinksTitle", "footerServicesTitle", "footerContactTitle", "headerFollowTitle", "whatsappCta"] as const;
const stringKeys = ["phone", "alternatePhone", "email", "whatsapp", "googleMapsUrl"] as const;
export const updateSettings = async (req:Request,res:Response) => {
 try {
  const current=await getOrCreate();
  if(!current) throw new Error('Settings not found');
  const input = typeof req.body.data==='string' ? JSON.parse(req.body.data) : req.body;
  const update:Record<string,unknown>={};
  for(const key of localizedKeys) if(input[key]!==undefined){
   if(typeof input[key]?.en!=='string'||typeof input[key]?.ar!=='string') return res.status(400).json({success:false,message:`Invalid ${key}`});
   update[key]=input[key];
  }
  for(const key of stringKeys) if(input[key]!==undefined){
   if(typeof input[key]!=='string') return res.status(400).json({success:false,message:`Invalid ${key}`});
   update[key]=input[key];
  }
  if(input.socials!==undefined){
   if(!input.socials || typeof input.socials.instagram!=='string' || typeof input.socials.facebook!=='string' || typeof input.socials.youtube!=='string' || typeof input.socials.linkedin!=='string' || typeof input.socials.x!=='string') return res.status(400).json({success:false,message:'Invalid socials'});
   update.socials=input.socials;
  }
  const files=req.files as Record<string,Express.Multer.File[]>|undefined;
  const uploaded:{publicId:string}[]=[];
  try {
   for(const field of ['logo','footerLogo','favicon'] as const){
    const file=files?.[field]?.[0]; if(!file) continue;
    if(!file.mimetype.startsWith('image/')) return res.status(400).json({success:false,message:'Only images allowed'});
    const result=await uploadBuffer(file.buffer,'audit/site-settings','image');
    uploaded.push(result); update[field]=result;
   }
   const data=await SiteSettingsModel.findOneAndUpdate({singleton:'site-settings'},{$set:update},{returnDocument:'after',runValidators:true});
   for(const field of ['logo','footerLogo','favicon'] as const) if(update[field]&&current[field]?.publicId) await deleteFromCloudinary(current[field].publicId,'image').catch(()=>undefined);
   res.json({success:true,message:'Settings updated',data});
  }catch(e){ await Promise.all(uploaded.map(x=>deleteFromCloudinary(x.publicId,'image').catch(()=>undefined))); throw e; }
 }catch { res.status(500).json({success:false,message:'Unable to update settings'}); }
};
