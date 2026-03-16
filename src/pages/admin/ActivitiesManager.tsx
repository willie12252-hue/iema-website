import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import activitySeminar from "@/assets/activity-seminar.jpeg";
import activityOnline from "@/assets/activity-online-v2.jpg";
import activityWorkshop from "@/assets/activity-workshop-v2.jpg";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface ActivityFormValues {
  title: string;
  description: string;
  tag: string;
  type: string;
  date?: string;
  location?: string;
  fee?: string;
  registration_info?: string;
  registration_link?: string;
  show_registration: string;
  image: FileList;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  tag: string;
  type: string;
  image_url: string;
  date?: string;
  location?: string;
  fee?: string;
  registration_info?: string;
  registration_link?: string;
  show_registration?: boolean;
}

export default function ActivitiesManager() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<ActivityFormValues>();
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
  } = useForm<ActivityFormValues>();

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching activities:', error);
    else setActivities(data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivities();
  }, []);

  const onSubmit = async (data: ActivityFormValues) => {
    // 1. Upload Image to Storage
    const file = data.image[0];
    if (!file) return alert('請選擇圖片');

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `activities/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return alert('圖片上傳失敗');
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

    // 2. Insert into DB
    const { error: insertError } = await supabase.from('activities').insert([{
      title: data.title,
      description: data.description,
      tag: data.tag,
      type: data.type,
      image_url: publicUrl,
      // Optional details
      date: data.date ? new Date(data.date).toISOString() : null,
      location: data.location,
      fee: data.fee,
      registration_info: data.registration_info,
      registration_link: data.registration_link,
      show_registration: data.show_registration === 'true',
    }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return alert('新增資料失敗');
    }

    alert('新增成功！');
    setOpen(false);
    reset();
    fetchActivities();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除嗎？')) return;
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error);
      alert(`刪除失敗：${error.message ?? '請稍後再試'}`);
    } else {
      await fetchActivities();
      alert('已刪除活動');
    }
  };

  const openEditDialog = (activity: Activity) => {
    setEditingActivity(activity);
    resetEdit({
      title: activity.title,
      description: activity.description,
      tag: activity.tag,
      type: activity.type,
      date: activity.date ? activity.date.substring(0, 10) : undefined,
      location: activity.location,
      fee: activity.fee,
      registration_info: activity.registration_info,
      registration_link: activity.registration_link,
      show_registration: activity.show_registration ? 'true' : 'false',
      // 編輯時圖片不是必填，因此不預先帶入
      image: undefined as unknown as FileList,
    });
    setEditOpen(true);
  };

  const onEditSubmit = async (data: ActivityFormValues) => {
    if (!editingActivity) return;

    let imageUrl = editingActivity.image_url;

    const file = data.image?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `activities/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('圖片上傳失敗');
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = publicUrl;
    }

    const { error: updateError } = await supabase
      .from('activities')
      .update({
        title: data.title,
        description: data.description,
        tag: data.tag,
        type: data.type,
        image_url: imageUrl,
        date: data.date ? new Date(data.date).toISOString() : null,
        location: data.location,
        fee: data.fee,
        registration_info: data.registration_info,
        registration_link: data.registration_link,
        show_registration: data.show_registration === 'true',
      })
      .eq('id', editingActivity.id);

    if (updateError) {
      console.error('Update error:', updateError);
      alert('更新失敗，請稍後再試');
      return;
    }

    alert('更新成功！');
    setEditOpen(false);
    setEditingActivity(null);
    resetEdit();
    fetchActivities();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">會員活動管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#899D5B] hover:bg-[#76894A]">新增活動</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增活動</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">活動標題</label>
                <Input {...register('title')} required placeholder="自然醫學研討會" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">標籤 (Tag)</label>
                  <Input {...register('tag')} required placeholder="研討會" />
                </div>
                <div>
                  <label className="text-sm font-medium">類型 (Type)</label>
                  <select {...register('type')} className="w-full border rounded p-2 text-sm">
                    <option value="other">其他</option>
                    <option value="workshop">工作坊</option>
                    <option value="seminar">研討會</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">活動日期</label>
                <Input type="date" {...register('date')} />
              </div>
              <div>
                <label className="text-sm font-medium">地點</label>
                <Input {...register('location')} placeholder="台北市..." />
              </div>
              <div>
                <label className="text-sm font-medium">費用說明</label>
                <Input {...register('fee')} placeholder="會員免費..." />
              </div>
              <div>
                <label className="text-sm font-medium">活動簡介</label>
                <Textarea {...register('description')} required className="h-24" />
              </div>
               <div>
                <label className="text-sm font-medium">報名說明</label>
                <Input {...register('registration_info')} placeholder="請致電..." />
              </div>
               <div>
                <label className="text-sm font-medium">報名連結 (選填)</label>
                <Input {...register('registration_link')} placeholder="https://..." />
              </div>
               <div>
                <label className="text-sm font-medium">啟用網站內建報名表單？</label>
                <select {...register('show_registration')} className="w-full border rounded p-2 text-sm">
                  <option value="false">否</option>
                  <option value="true">是</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">封面圖片</label>
                <Input type="file" accept="image/*" {...register('image')} required />
              </div>
              <Button type="submit" className="w-full bg-[#899D5B] hover:bg-[#76894A]">儲存</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>載入中...</p> : activities.map((item: Activity) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-[4/3] bg-slate-100 relative">
              <img
                src={
                  item.image_url ||
                  (item.type === 'seminar'
                    ? activitySeminar
                    : item.type === 'workshop'
                    ? activityWorkshop
                    : activityOnline)
                }
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="bg-slate-100 px-2 py-1 rounded">{item.tag}</span>
                {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                >
                  編輯
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>刪除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 編輯活動 Dialog */}
      <Dialog open={editOpen} onOpenChange={(openValue) => {
        setEditOpen(openValue);
        if (!openValue) {
          setEditingActivity(null);
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯活動</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">活動標題</label>
              <Input {...registerEdit('title')} required placeholder="自然醫學研討會" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">標籤 (Tag)</label>
                <Input {...registerEdit('tag')} required placeholder="研討會" />
              </div>
              <div>
                <label className="text-sm font-medium">類型 (Type)</label>
                <select {...registerEdit('type')} className="w-full border rounded p-2 text-sm">
                  <option value="other">其他</option>
                  <option value="workshop">工作坊</option>
                  <option value="seminar">研討會</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">活動日期</label>
              <Input type="date" {...registerEdit('date')} />
            </div>
            <div>
              <label className="text-sm font-medium">地點</label>
              <Input {...registerEdit('location')} placeholder="台北市..." />
            </div>
            <div>
              <label className="text-sm font-medium">費用說明</label>
              <Input {...registerEdit('fee')} placeholder="會員免費..." />
            </div>
            <div>
              <label className="text-sm font-medium">活動簡介</label>
              <Textarea {...registerEdit('description')} required className="h-24" />
            </div>
            <div>
              <label className="text-sm font-medium">報名說明</label>
              <Input {...registerEdit('registration_info')} placeholder="請致電..." />
            </div>
            <div>
              <label className="text-sm font-medium">報名連結 (選填)</label>
              <Input {...registerEdit('registration_link')} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium">啟用網站內建報名表單？</label>
              <select {...registerEdit('show_registration')} className="w-full border rounded p-2 text-sm">
                <option value="false">否</option>
                <option value="true">是</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">封面圖片（如不更換可留白）</label>
              <Input type="file" accept="image/*" {...registerEdit('image')} />
            </div>
            <Button type="submit" className="w-full bg-[#899D5B] hover:bg-[#76894A]">
              儲存變更
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
