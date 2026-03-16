import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface HeroBannerFormValues {
  title: string;
  description?: string;
  link?: string;
  display_order: string;
  image: FileList;
}

interface HeroBanner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link?: string;
  display_order?: number;
}

export default function HeroManager() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<HeroBannerFormValues>();

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('hero_banners').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching banners:', error);
    else setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
  }, []);

  const onSubmit = async (data: HeroBannerFormValues) => {
    // 1. Upload Image to Storage
    const file = data.image[0];
    if (!file) return alert('請選擇圖片');

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return alert('圖片上傳失敗');
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

    // 2. Insert into DB
    const { error: insertError } = await supabase.from('hero_banners').insert([{
      title: data.title,
      description: data.description,
      image_url: publicUrl,
      link: data.link,
      display_order: parseInt(data.display_order) || 0,
    }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return alert('新增資料失敗');
    }

    alert('新增成功！');
    setOpen(false);
    reset();
    fetchBanners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除嗎？')) return;
    const { error } = await supabase.from('hero_banners').delete().eq('id', id);
    if (error) alert('刪除失敗');
    else fetchBanners();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">首頁輪播管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#899D5B] hover:bg-[#76894A]">新增輪播圖</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增輪播圖片</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">標題 (Alt Text)</label>
                <Input {...register('title')} required placeholder="Nature & Science" />
              </div>
              <div>
                <label className="text-sm font-medium">描述 (選填)</label>
                <Textarea {...register('description')} placeholder="簡單描述..." />
              </div>
              <div>
                <label className="text-sm font-medium">連結 (選填)</label>
                <Input {...register('link')} placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium">排序 (數字越小越前面)</label>
                <Input type="number" {...register('display_order')} defaultValue="0" />
              </div>
              <div>
                <label className="text-sm font-medium">圖片</label>
                <Input type="file" accept="image/*" {...register('image')} required />
              </div>
              <Button type="submit" className="w-full bg-[#899D5B] hover:bg-[#76894A]">儲存</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>載入中...</p> : banners.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-[16/9] bg-slate-100 relative">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>刪除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
