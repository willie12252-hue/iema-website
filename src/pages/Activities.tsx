// src/pages/Activities.tsx - Refactored to fetch from Supabase
import activitySeminar from "@/assets/activity-seminar.jpeg";
import activityOnline from "@/assets/activity-online-v2.jpg";
import activityWorkshop from "@/assets/activity-workshop-v2.jpg";
import activityTraining from "@/assets/activity-training.jpeg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Calendar, MapPin, Ticket, User, Phone, Mail, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tag: string;
  type: string;
  date?: string;
  location?: string;
  fee?: string;
  registration_info?: string;
  registration_link?: string;
  show_registration?: boolean;
  gallery_images?: string[];
}

// Fallback data
const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    title: "自然醫學研討會",
    show_registration: true,
    date: "2026-09-01",
    location: "台北市中山區南京東路二段140號6樓",
    fee: "會員免費 / 非會員 $500",
    registration_info: "請密切關注官網公告或加入官方 LINE 獲取最新消息",
    description: "協會不定期舉辦自然醫學研討會，邀請各領域專業講師與專家學者，分享最新的自然療癒研究與臨床實踐成果。研討會涵蓋芳療、草本療法、能量療癒、整合醫學等多元主題，讓會員能掌握國際趨勢並與專業社群交流互動。我們致力於打造一個知識與經驗共享的平台，無論是想精進專業技能，還是想認識志同道合的夥伴，都能在研討會中獲得啟發與靈感。",
    image_url: activitySeminar,
    tag: "研討會",
    type: "seminar"
  },
  {
    id: '2',
    title: "名師線上講座",
    show_registration: false,
    date: "2026-04-10",
    location: "Zoom 線上會議室",
    fee: "會員專屬免費參加",
    registration_info: "活動前一週於會員群組發布會議連結",
    description: "為了突破地域與時間的限制，協會特別開設會員專屬的線上名師講座，邀請具有影響力的自然醫學專家，深入解析療癒案例、實用技巧與健康趨勢。透過即時互動，會員可以在線上向講師提問，獲得第一手專業建議。無論身處何地，只要一台電腦或手機，就能參與最前沿的自然醫學知識饗宴，持續為您的專業養成增添能量。",
    image_url: activityOnline,
    tag: "線上講座",
    type: "other"
  },
  {
    id: '3',
    title: "自然療癒體驗工作坊",
    show_registration: true,
    date: "2026-03-14",
    location: "台北市中山區南京東路二段140號6樓",
    fee: "材料費 $300 (含精油、基底油、滾珠瓶)",
    registration_info: "請致電 0955541548 或私訊粉專報名",
    description: "我們相信，親身體驗是學習自然醫學最直接的方式。協會定期舉辦各式療癒體驗工作坊，涵蓋芳療調香、草本應用、手技放鬆、能量平衡及冥想靜心等課程，並由經驗豐富的師資帶領，讓會員透過實作感受自然療癒的力量。課程設計兼具專業性與趣味性，不僅增進健康知識，也能在溫暖的互動中找到生活靈感與療癒之道。",
    image_url: activityWorkshop,
    tag: "工作坊",
    type: "workshop"
  },
  {
    id: '4',
    title: "會員專屬研習活動",
    show_registration: false,
    date: "2026-04-15",
    location: "台北市中山區南京東路二段140號6樓",
    fee: "會員優惠價 $3,000 (原價 $6,000)",
    registration_info: "限會員報名，名額 20 人，額滿為止",
    description: "協會特別為會員規劃進階研習課程，協助提升專業技能與實務經驗。研習內容涵蓋自然醫學理論、臨床案例分享、專業技術培訓等，由資深講師親自授課，確保內容紮實並貼近業界需求。會員可優先報名並享有專屬優惠，還能獲得研習證書，作為專業養成的最佳佐證。透過這些研習活動，我們期望每一位會員都能成為自然醫學推廣的種子，共同開創健康新未來。",
    image_url: activityTraining,
    tag: "專業研習",
    type: "other"
  }
];

export default function Activities() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error("Failed to fetch activities:", error);
          setActivities(defaultActivities);
          setGalleryImages([activitySeminar, activityWorkshop, activityTraining, activityOnline]);
        } else if (data && data.length > 0) {
          setActivities(data as ActivityItem[]);
          
          // Collect gallery images
          const allImages = (data as ActivityItem[]).flatMap(a => a.gallery_images || []);
          if (allImages.length > 0) {
            setGalleryImages(allImages);
          } else {
             // Fallback to main images if no gallery
             setGalleryImages((data as ActivityItem[]).map((a) => a.image_url));
          }
        } else {
          setActivities(defaultActivities);
          setGalleryImages([activitySeminar, activityWorkshop, activityTraining, activityOnline]);
        }
      } catch (err) {
        console.error("Exception fetching activities:", err);
        setActivities(defaultActivities);
        setGalleryImages([activitySeminar, activityWorkshop, activityTraining, activityOnline]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayList = activities.length > 0 ? activities : (loading ? [] : defaultActivities);
  const displayGallery = galleryImages.length > 0 ? galleryImages : [activitySeminar, activityWorkshop, activityTraining, activityOnline];

  if (loading && activities.length === 0) {
      return (
        <div className="w-full min-h-screen bg-[#FDFCF8] py-16 flex justify-center items-center">
            <p>載入活動中...</p>
        </div>
      );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-center font-serif text-4xl md:text-5xl font-bold text-foreground mb-16 tracking-wider">
          會員活動
        </h1>

        <div className="space-y-24">
          {/* Gallery Section */}
          <div className="mb-24">
            <h2 className="font-serif text-3xl font-bold text-center text-foreground mb-8">
              過往精采活動回顧
            </h2>
            <Carousel
              plugins={[
                Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
              ]}
              className="w-full max-w-4xl mx-auto"
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {displayGallery.map((img, i) => (
                  <CarouselItem key={i} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="overflow-hidden rounded-xl aspect-[4/3] shadow-md group">
                        <img 
                          src={img} 
                          alt={`Activity Highlight ${i+1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white/80 hover:bg-white text-[#899D5B]" />
              <CarouselNext className="hidden md:flex -right-12 bg-white/80 hover:bg-white text-[#899D5B]" />
            </Carousel>
          </div>

          {displayList.map((item, index) => {
            const fallbackImage =
              item.type === "seminar"
                ? activitySeminar
                : item.type === "workshop"
                ? activityWorkshop
                : activityOnline;
            const imageSrc = item.image_url || fallbackImage;

            return (
            <div 
              key={index} 
              className={`flex flex-col gap-8 md:gap-16 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                  <img 
                    src={imageSrc} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary hover:bg-white border-none shadow-sm backdrop-blur-sm text-base px-4 py-1">
                      {item.tag || '活動'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {item.title}
                </h2>
                <div className="w-20 h-1 bg-[#899D5B] rounded-full" />
                <p className="text-muted-foreground text-lg leading-loose text-justify whitespace-pre-line">
                  {item.description}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full border-[#899D5B] text-[#899D5B] hover:bg-[#899D5B] hover:text-white transition-all group">
                      了解更多 <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-serif font-bold text-[#899D5B] mb-2">{item.title}</DialogTitle>
                      <DialogDescription className="text-base text-muted-foreground">
                        {item.tag}詳細資訊與報名方式
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-[#899D5B] mt-1 shrink-0" />
                          <div>
                            <h4 className="font-bold text-foreground">活動時程</h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {/* Schedule is now a single date, maybe format nicely */}
                              <li>{item.date ? format(new Date(item.date), 'yyyy/MM/dd') : '待定'}</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-[#899D5B] mt-1 shrink-0" />
                          <div>
                            <h4 className="font-bold text-foreground">活動地點</h4>
                            <p className="text-sm text-muted-foreground mt-1">{item.location || '待定'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Ticket className="w-5 h-5 text-[#899D5B] mt-1 shrink-0" />
                          <div>
                            <h4 className="font-bold text-foreground">費用與資格</h4>
                            <p className="text-sm text-muted-foreground mt-1">{item.fee || '請洽協會'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2">
                        <h4 className="font-bold text-foreground mb-2 text-sm">報名方式</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.registration_info || '請聯繫協會報名'}
                        </p>
                        {item.registration_link && (
                           <Button asChild className="mt-3 w-full bg-[#899D5B] hover:bg-[#76894A] text-white">
                              <a href={item.registration_link} target="_blank" rel="noopener noreferrer">
                                 前往報名連結
                              </a>
                           </Button>
                        )}
                      </div>

                      {/* Registration Flow & Form (Only for specific activities) */}
                      {item.show_registration && !item.registration_link && (
                        <div className="mt-6 border-t border-border/50 pt-6">
                          <h4 className="font-serif font-bold text-lg text-[#899D5B] mb-4">線上報名流程</h4>
                          
                          {/* Flowchart */}
                          <div className="flex items-center justify-between mb-8 relative">
                            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-10" />
                            {[
                              { step: "1", label: "填寫表單" },
                              { step: "2", label: "專人確認" },
                              { step: "3", label: "完成繳費" },
                              { step: "4", label: "報名成功" }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center bg-white px-2">
                                <div className="w-8 h-8 rounded-full bg-[#899D5B]/10 text-[#899D5B] flex items-center justify-center font-bold text-sm mb-1 border-2 border-[#899D5B]">
                                  {step.step}
                                </div>
                                <span className="text-xs text-muted-foreground">{step.label}</span>
                              </div>
                            ))}
                          </div>

                          {/* Form */}
                          <div className="space-y-4">
                            <h4 className="font-serif font-bold text-lg text-[#899D5B] mb-2">立即預約報名</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${index}`} className="text-xs">姓名</Label>
                                <div className="relative">
                                  <User className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                                  <Input id={`name-${index}`} placeholder="您的姓名" className="pl-9" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`phone-${index}`} className="text-xs">電話</Label>
                                <div className="relative">
                                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                                  <Input id={`phone-${index}`} placeholder="聯絡電話" className="pl-9" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`email-${index}`} className="text-xs">Email</Label>
                              <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                                <Input id={`email-${index}`} type="email" placeholder="email@example.com" className="pl-9" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`note-${index}`} className="text-xs">備註 / 期望場次</Label>
                              <div className="relative">
                                <FileText className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                <Textarea id={`note-${index}`} placeholder="請註明您想參加的日期或特殊需求..." className="pl-9 min-h-[80px]" />
                              </div>
                            </div>
                            <Button className="w-full bg-[#899D5B] hover:bg-[#76894A] text-white rounded-full mt-2">
                              送出報名申請
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-2">
                              * 送出後將由專人與您聯繫確認場次與繳費細節
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {!item.show_registration && !item.registration_link && (
                      <div className="flex justify-end">
                        <Button className="bg-[#899D5B] hover:bg-[#76894A] text-white rounded-full">
                          聯繫協會報名
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )})}
        </div>

        {/* Benefits Section */}
        <div className="mt-32">
          <Card className="bg-[#899D5B]/5 border-none shadow-none">
            <CardContent className="p-12 text-center max-w-4xl mx-auto">
              <h3 className="font-serif text-3xl font-bold text-[#899D5B] mb-6">
                會員專屬權益與報名優惠
              </h3>
              <p className="text-muted-foreground text-lg leading-loose">
                加入我們的大家庭，就能優先參與協會主辦的活動，不論是線上講座、實體課程、體驗工作坊或研討會，都有專屬的報名優惠與保留名額。我們希望會員們在每一次學習與交流中，都能感受到被照顧與陪伴。如果您目前還不是會員，也歡迎參與活動，只是無法享有這些貼心的專屬福利。誠摯邀請您成為我們的會員，一起在自然醫學的路上，相伴前行、彼此成長。
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-[#899D5B] hover:bg-[#76894A] text-white rounded-full px-8 text-lg shadow-lg hover:shadow-xl transition-all">
                  立即加入會員
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
