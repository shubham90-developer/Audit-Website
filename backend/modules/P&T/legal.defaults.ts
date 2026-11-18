type Kind = 'privacy-policy' | 'terms-and-conditions'
const localized = (en: string, ar: string) => ({ en, ar })
export const defaultLegalPage = (kind: Kind) => {
  const privacy = kind === 'privacy-policy'
  const names = privacy
    ? [['Information We Collect', 'المعلومات التي نجمعها'], ['How We Use Your Information', 'كيف نستخدم معلوماتك'], ['Sharing of Information', 'مشاركة المعلومات'], ['Data Retention', 'الاحتفاظ بالبيانات'], ['Data Security', 'أمن البيانات'], ['Your Rights', 'حقوقك'], ['Cookies', 'ملفات تعريف الارتباط'], ['Third-Party Links', 'روابط الأطراف الثالثة'], ['Changes to This Policy', 'التغييرات على هذه السياسة']]
    : [['Acceptance of Terms', 'قبول الشروط'], ['Our Services', 'خدماتنا'], ['Use of Website', 'استخدام الموقع'], ['Intellectual Property', 'الملكية الفكرية'], ['Disclaimer', 'إخلاء المسؤولية'], ['Limitation of Liability', 'حدود المسؤولية'], ['Third-Party Links', 'روابط الأطراف الثالثة'], ['Changes to Terms', 'تغييرات الشروط'], ['Contact Us', 'اتصل بنا']]
  return {
    kind,
    heroTitle: localized(privacy ? 'Privacy Policy' : 'Terms & Conditions', privacy ? 'سياسة الخصوصية' : 'الشروط والأحكام'),
    heroDescription: localized(privacy ? 'Learn how we collect, use, protect, and manage your personal information when you visit our website or use our services.' : 'Please review the terms governing your use of our website and services.', privacy ? 'تعرف على كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها وإدارتها.' : 'يرجى مراجعة الشروط التي تحكم استخدام موقعنا وخدماتنا.'),
    heroImage: { en: { url: '', publicId: '' }, ar: { url: '', publicId: '' } },
    intro: localized(privacy ? 'We respect your privacy. This is sample policy text; replace it with your approved legal wording.' : 'These are sample terms; replace them with your approved legal wording before publication.', privacy ? 'نحترم خصوصيتك. هذا نص تجريبي ويجب استبداله بصياغة قانونية معتمدة.' : 'هذه شروط تجريبية ويجب استبدالها بصياغة قانونية معتمدة.'),
    sidebarTitle: localized('ON THIS PAGE', 'في هذه الصفحة'),
    sections: names.map(([en, ar], order) => ({ title: localized(en, ar), body: localized('Replace with your approved content.', 'استبدل هذا النص بالمحتوى المعتمد.'), bullets: [], order })),
  }
}
