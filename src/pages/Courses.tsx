// src/pages/Courses.tsx - Refactored to fetch from Supabase
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import courseEmotional from "@/assets/course-emotional-optimized.jpg";
import courseInsight from "@/assets/course-insight-optimized.jpg";
import courseIna from "@/assets/course-ina.png";
import courseChemical from "@/assets/course-chemical.png";
import courseLoveLight from "@/assets/course-lovelight.png";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Course as CourseType } from "@/lib/supabase";

// Fallback data
const defaultCourses: CourseType[] = [
  {
    id: '1',
    title: "情緒芳療師認證課程",
    description: `• 覺察情緒並找回平靜的力量。
• 協助做情緒芳療諮詢，帶領情緒芳療紓壓活動。
• 學會如何自行調製情緒用油並帶領疏導情緒，未來成為助人工作者最好的工具。`,
    link: "https://forms.gle/nEruGs4ezaghMqxf8",
    image_url: courseEmotional,
    button_text: "課程報名表單"
  },
  {
    id: '2',
    title: "芳療洞悉諮詢師課程",
    description: "透過課程輕鬆學會，如何運用芳療洞悉卡做牌卡解析及植物能量的運用，我們獨家運用投射概念去分析牌卡圖像，再加上多年的實務操作經驗，整合出讓大家能消化吸收並立刻可以上手的課程，讓您成為專業“芳療洞悉諮詢師”",
    link: "https://school.cuclass.com/classDetail?storeId=36110&teacherId=19360&courseId=4510&courseType=1",
    image_url: courseInsight,
    button_text: "查看線上課程"
  },
  {
    id: '3',
    title: "INA整體芳療證照課程 | 從基礎理論到專業應用",
    description: "想學芳療卻不知從哪開始？《INA整體芳療證照課程》帶你從基礎理論出發，系統學習精油知識、配方設計與實務應用。適合初學者、健康愛好者及專業從業人員，搭配線上教學、實務練習，三個月內不限次數重複觀看，學習無壓力。完成課程可彈性加購證照考試，取得INA認可專業證書，踏上芳療專業之路，將植物的療癒力帶進生活與職涯！",
    link: "https://school.cuclass.com/classDetail?storeId=36110&teacherId=19360&courseId=4242&courseType=1",
    image_url: courseIna,
    button_text: "查看線上課程"
  },
  {
    id: '4',
    title: "精油化學解密—讓配方更精準、更安全、更有效！",
    description: "學芳療卻總搞不懂為什麼這樣配油才有效？《精油化學解密》幫你一次釐清精油背後的化學邏輯，從分子結構、成分類型，到功效與配方設計原理，建立真正有根據的芳療專業力。課程內容深入淺出，搭配140頁講義與專屬LINE群組討論，讓你不再害怕化學。無論是芳療師、調香師、自學者，或希望為自己與他人設計安全有效配方的人，都適合加入這堂永久觀看的線上課程！",
    link: "https://school.cuclass.com/classDetail?storeId=36110&teacherId=19360&courseId=4713&courseType=1",
    image_url: courseLoveLight,
    button_text: "查看線上課程"
  },
  {
    id: '5',
    title: "《Φως του Έρωτα®️愛之光・金星轉化旅程》",
    description: "是一門源自引導者靈魂記憶與深度療癒實修的獨立系統課程。融合能量引導與潛意識技術，陪伴學員走出情感困頓、自我懷疑與內在匱乏，修復關係創傷。透過溫柔深層的練習與支持性空間，重新連結自我價值，重建愛與信任的能力，真實改變人際與親密關係的模式，找回靈魂原初的力量。",
    link: "https://prettygalaxy.com/product/love/",
    image_url: courseChemical,
    button_text: "查看線上課程"
  }
];

export default function Courses() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error("Failed to fetch courses:", error);
          setCourses(defaultCourses);
        } else if (data && data.length > 0) {
          setCourses(data as CourseType[]);
        } else {
          setCourses(defaultCourses);
        }
      } catch (error) {
        console.error("Exception fetching courses:", error);
        setCourses(defaultCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const displayList = courses.length > 0 ? courses : (loading ? [] : defaultCourses);

  if (loading && courses.length === 0) {
      return (
        <div className="w-full min-h-screen bg-[#F9F9F9] py-16 flex justify-center items-center">
            <p>載入課程中...</p>
        </div>
      );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-center font-serif text-4xl font-bold text-foreground mb-16 tracking-wider">
          專業課程
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayList.map((course, index) => (
            <Card key={index} className="flex flex-col h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white">
              {/* Image Container - Using 4:3 aspect ratio as seen in typical course grids */}
              <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
                {/* Fallback gray background if image fails to load, or as a placeholder style */}
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-serif font-medium tracking-wide">了解更多詳情</span>
                </div>
              </div>

              <CardHeader className="pt-6 pb-2">
                <CardContent className="p-0">
                  <h3 className="font-serif text-xl font-bold text-foreground line-clamp-2 min-h-[3.5rem] mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="w-12 h-1 bg-primary/30 rounded-full mb-4" />
                </CardContent>
              </CardHeader>

              <CardContent className="flex-grow pb-6">
                 <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line line-clamp-5">
                   {course.description}
                 </p>
              </CardContent>

              <CardFooter className="pt-0 pb-6">
                <Button 
                  asChild 
                  className="w-full bg-[#899D5B] hover:bg-[#76894A] text-white rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <a href={course.link || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    {course.button_text || '查看詳情'} <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
