import { Schema, model } from 'mongoose';
import type { SiteSettings } from './interface';
const localized = new Schema({ en: {type:String,default:''}, ar: {type:String,default:''} }, {_id:false});
const media = new Schema({ url: {type:String,default:''}, publicId: {type:String,default:''} }, {_id:false});
const schema = new Schema<SiteSettings>({
 singleton: {type:String,unique:true,default:'site-settings'},
 companyName: {type:localized,default:()=>({})},
 tagline: {type:localized,default:()=>({})},
 address: {type:localized,default:()=>({})},
 officeHours: {type:localized,default:()=>({})},
 footerDescription: {type:localized,default:()=>({})},
 copyright: {type:localized,default:()=>({})},
 footerQuickLinksTitle: {type:localized,default:()=>({})},
 footerServicesTitle: {type:localized,default:()=>({})},
 footerContactTitle: {type:localized,default:()=>({})},
 headerFollowTitle: {type:localized,default:()=>({})},
 whatsappCta: {type:localized,default:()=>({})},
 phone: {type:String,default:''},
 alternatePhone: {type:String,default:''},
 email: {type:String,default:''},
 whatsapp: {type:String,default:''},
 googleMapsUrl: {type:String,default:''},
 socials: {instagram: {type:String,default:''},facebook: {type:String,default:''},youtube: {type:String,default:''},linkedin: {type:String,default:''},x: {type:String,default:''}},
 logo: {type:media,default:()=>({})},
 footerLogo: {type:media,default:()=>({})},
 favicon: {type:media,default:()=>({})},
}, {timestamps:true});
export const SiteSettingsModel = model<SiteSettings>('SiteSettings',schema);
