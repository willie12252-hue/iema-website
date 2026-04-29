import aboutLogo from "@/assets/about-logo.gif";
import imgTraining from "@/assets/about-training.jpeg";
import imgPromoting from "@/assets/about-promoting.jpeg";
import imgConnecting from "@/assets/about-connecting.jpeg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export default function About() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceId = "service_sbm9mb6";
    const templateId = "template_yw1vz4b";
    const publicKey = "NAblGRT4QgIAilmbZ";

    const missingKeys =
      !serviceId || serviceId.includes("__PASTE") ||
      !templateId || templateId.includes("__PASTE") ||
      !publicKey || publicKey.includes("__PASTE");

    if (missingKeys) {
      toast.error("EmailJS 尚未完成設定：請補上 Template ID 與 Public Key");
      return;
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      subject: "我對課程、認證或加入協會感興趣",
    };

    const loadingId = toast.loading("正在送出訊息...");

    try {
      await emailjs.send(serviceId, templateId, templateParams, { publicKey });
      toast.success("送出成功！我們已收到您的訊息。", { id: loadingId });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("送出失敗，請稍後再試或改用電話聯絡。", { id: loadingId });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Banner removed - it's now in App.tsx layout */}

      {/* About Content Section - Updated Layout */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Rotating Logo (Span 4) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-start sticky top-24">
              <div className="w-full max-w-[300px] aspect-square relative">
                 <img 
                   src={aboutLogo} 
                   alt="Association Logo" 
                   className="w-full h-full object-contain drop-shadow-xl"
                 />
              </div>
            </div>

            {/* Right Column: Text Content (Span 8) */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Introduction Block */}
              <div>
                <h3 className="text-primary font-medium tracking-wide mb-2 uppercase">About Us</h3>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">關於協會</h2>
                
                <h4 className="font-serif text-2xl font-semibold text-primary/90 mb-4">自然醫學．生活新選擇</h4>
                <div className="prose prose-lg text-muted-foreground leading-loose text-justify">
                  <p>
                    中華國際自然醫學協會是一個依法立案的非營利組織，致力於推廣自然醫學的整合理念與實踐。我們深耕在地，培育具備專業知識與人文關懷的自然療法從業人員與師資，推動各式自然醫學方法在生活中的應用，包括芳療、草本療法、手技療癒、能量平衡等。
                  </p>
                  <p>
                    我們相信，健康不僅是身體無病，更是身心靈合一的生活狀態，是一種與自然和諧共處的生活藝術。協會致力於讓自然醫學不再只是醫療補充選項，而是貼近人們日常、易於實踐的健康新思維。邀請您一同走進自然醫學的智慧世界，找回身體與自然對話的能力。
                  </p>
                </div>
                
                <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="font-bold text-foreground mb-1">聯絡方式</p>
                  <p className="text-primary font-serif text-xl">中華國際自然醫學協會 📞 02-2508-0218</p>
                </div>
              </div>

              {/* Block 2: Training (Text Left, Image Right) */}
              <div className="border-t border-border pt-12">
                <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h4 className="font-serif text-2xl font-semibold text-primary/90 mb-4">培育自然醫學的專業講師</h4>
                    <div className="prose prose-lg text-muted-foreground leading-loose text-justify">
                      <p>
                        協會長期投入自然醫學專業講師的培訓工作，透過系統化課程、實務操作與倫理觀念的養成，協助學員從零開始，成為能教學、能實作、也能療癒他人的專業人才。
                      </p>
                      <p>
                        我們所培育的師資，不僅懂技巧，更懂得以同理心和人本精神陪伴學習者，將療癒帶入生活每個角落。
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                      <img src={imgTraining} alt="Professional Training" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 3: Promoting (Image Left, Text Right) */}
              <div className="border-t border-border pt-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                   <div className="w-full md:w-1/3 shrink-0">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                      <img src={imgPromoting} alt="Promoting Natural Medicine" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-2xl font-semibold text-primary/90 mb-4">推廣自然醫學觀念</h4>
                    <div className="prose prose-lg text-muted-foreground leading-loose text-justify">
                      <p>
                        我們積極舉辦各式講座、實作坊與社區推廣活動，讓大眾重新理解自然醫學的核心精神——尊重身體的智慧、順應自然的節奏。
                      </p>
                      <p className="italic text-primary/80 font-serif text-xl my-6 border-l-4 border-primary pl-4">
                        「教育是最溫柔的療癒力量」
                      </p>
                      <p>
                        透過知識的傳遞與經驗的分享，讓人們學會自我照顧、自我療癒，進而提升整體社會的健康品質與生命能量。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 4: Connecting (Text Left, Image Right) */}
              <div className="border-t border-border pt-12">
                 <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h4 className="font-serif text-2xl font-semibold text-primary/90 mb-4">串聯國內療癒師</h4>
                    <div className="prose prose-lg text-muted-foreground leading-loose text-justify">
                      <p>
                        <strong className="text-foreground">串聯在地療癒力量．打造本土支持網絡！</strong><br/>
                        協會目前致力於串聯全台自然醫學工作者，打造一個專業、互助且具影響力的在地療癒網絡。我們與多位本土資深講師與實務者合作，透過課程、實作分享與跨領域交流，共同推進自然醫學在台灣的發展。
                      </p>
                      <p>
                        我們相信，本土的力量最真實，最能貼近土地與人民的需求。未來，協會將持續深耕台灣，讓自然療癒的智慧在生活中扎根茁壯，成為每個人可實踐的健康選擇。
                      </p>
                    </div>
                  </div>
                   <div className="w-full md:w-1/3 shrink-0">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                      <img src={imgConnecting} alt="Connecting Healers" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Join Us / Contact Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">加入我們 Join Us</h2>
            <p className="text-muted-foreground">成為推動自然醫學的一份子，共同創造健康的未來</p>
          </div>

          <Card className="bg-white border-none shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-bold text-primary">聯絡資訊</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>如果您對課程、認證或加入協會感興趣，歡迎透過表單或以下方式聯繫我們。</p>
                    <div className="pt-4 space-y-2">
                      <p><strong className="text-foreground">電話：</strong> 0955541548</p>
                      <p><strong className="text-foreground">Email：</strong> lp36andy@gmail.com</p>
                      <p><strong className="text-foreground">地址：</strong> 台北市中山區南京東路二段140號6樓</p>
                    </div>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">姓名</label>
                      <Input id="name" placeholder="您的姓名" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">電話</label>
                      <Input id="phone" placeholder="聯絡電話" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">諮詢內容</label>
                    <Textarea id="message" placeholder="請告訴我們您感興趣的課程或合作項目..." className="h-32" value={formData.message} onChange={handleChange} required />
                  </div>
                  <Button type="submit" className="w-full rounded-full bg-primary text-white hover:bg-primary/90">
                    送出訊息
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
