import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import footerLogo from "@/assets/footer-logo.gif";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border/40 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand - Replaced text with Logo Image */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex flex-col">
              <img 
                src={footerLogo} 
                alt="中華國際自然醫學協會" 
                className="w-full max-w-[280px] h-auto object-contain"
              />
            </div>
            {/* Optional: Keep slogan if it's not in the logo, but the logo seems to contain English text too.
                The uploaded logo has both Chinese and English names.
                I will remove the text duplication to match the user's request "replace information with logo".
            */}
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4 text-foreground">快速連結</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#/about" className="hover:text-primary transition-colors">關於協會</a></li>
              <li><a href="#/faculty" className="hover:text-primary transition-colors">師資陣容</a></li>
              <li><a href="#/courses" className="hover:text-primary transition-colors">專業課程</a></li>
              <li><a href="#/activities" className="hover:text-primary transition-colors">會員活動</a></li>
              <li><a href="#/academy" className="hover:text-primary transition-colors">芳療學苑</a></li>
              <li className="pt-2 mt-2 border-t border-gray-100">
              <a
  href="/#/admin/login"
  className="hover:text-primary transition-colors text-xs flex items-center gap-1 opacity-70 hover:opacity-100"
>
  管理員登入
</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="font-serif font-semibold mb-4 text-foreground">聯絡我們</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span>台北市中山區南京東路二段140號6樓</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>02-2508-0218</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>willie1225@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Facebook className="w-4 h-4 text-primary shrink-0" />
                <a href="https://www.facebook.com/profile.php?id=61556909607305" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook 粉絲專頁</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
<p>© 2026 中華國際自然醫學協會 c-ina. All rights reserved.</p>
          <p>Designed with Nature & Science.</p>
        </div>
      </div>
    </footer>
  );
}
