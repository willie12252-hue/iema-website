import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface FacultyFormValues {
  name: string;
  title: string;
  description: string;
  details?: string;
  expertise?: string;
  image: FileList;
}

interface Faculty {
  id: string;
  name: string;
  title: string;
  description: string;
  details?: string;
  image_url: string;
  expertise: string[];
}

export default function FacultyManager() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FacultyFormValues>();
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
  } = useForm<FacultyFormValues>();

  const fetchFaculty = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faculty').select('*').order('created_at', { ascending: true });
    if (error) console.error('Error fetching faculty:', error);
    else setFaculty(data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFaculty();
  }, []);

  const onSubmit = async (data: FacultyFormValues) => {
    // 1. Upload Image to Storage
    const file = data.image[0];
    if (!file) return alert('請選擇圖片');

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `faculty/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return alert('圖片上傳失敗');
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

    // 2. Insert into DB
    const { error: insertError } = await supabase.from('faculty').insert([{
      name: data.name,
      title: data.title,
      description: data.description,
      details: data.details,
      image_url: publicUrl,
      expertise: data.expertise ? data.expertise.split(',').map((s: string) => s.trim()) : [],
    }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return alert('新增資料失敗');
    }

    alert('新增成功！');
    setOpen(false);
    reset();
    fetchFaculty();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除嗎？')) return;
    const { error } = await supabase.from('faculty').delete().eq('id', id);
    if (error) alert('刪除失敗');
    else fetchFaculty();
  };

  const openEditDialog = (member: Faculty) => {
    setEditingFaculty(member);
    resetEdit({
      name: member.name,
      title: member.title,
      description: member.description,
      details: member.details,
      expertise: member.expertise?.join(', '),
      image: undefined as unknown as FileList,
    });
    setEditOpen(true);
  };

  const onEditSubmit = async (data: FacultyFormValues) => {
    if (!editingFaculty) return;

    let imageUrl = editingFaculty.image_url;
    const file = data.image?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `faculty/${fileName}`;

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

    const expertiseArr = data.expertise
      ? data.expertise
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const { error: updateError } = await supabase
      .from('faculty')
      .update({
        name: data.name,
        title: data.title,
        description: data.description,
        details: data.details,
        expertise: expertiseArr,
        image_url: imageUrl,
      })
      .eq('id', editingFaculty.id);

    if (updateError) {
      console.error('Update error:', updateError);
      alert('更新失敗，請稍後再試');
      return;
    }

    alert('更新成功！');
    setEditOpen(false);
    setEditingFaculty(null);
    resetEdit();
    fetchFaculty();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">師資陣容管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#899D5B] hover:bg-[#76894A]">新增師資</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增師資資料</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">姓名</label>
                <Input {...register('name')} required placeholder="王大明" />
              </div>
              <div>
                <label className="text-sm font-medium">職稱</label>
                <Input {...register('title')} required placeholder="資深芳療講師" />
              </div>
              <div>
                <label className="text-sm font-medium">簡介 (顯示於卡片)</label>
                <Textarea {...register('description')} required placeholder="簡短介紹..." />
              </div>
              <div>
                <label className="text-sm font-medium">詳細經歷 (彈窗內容)</label>
                <Textarea {...register('details')} className="h-32" placeholder="詳細經歷與證照..." />
              </div>
              <div>
                <label className="text-sm font-medium">專長 (用逗號分隔)</label>
                <Input {...register('expertise')} placeholder="芳療, 按摩, 經絡" />
              </div>
              <div>
                <label className="text-sm font-medium">照片</label>
                <Input type="file" accept="image/*" {...register('image')} required />
              </div>
              <Button type="submit" className="w-full bg-[#899D5B] hover:bg-[#76894A]">儲存</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>載入中...</p> : faculty.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square bg-slate-100 relative">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{item.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                  編輯
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>刪除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 編輯師資 Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(openValue) => {
          setEditOpen(openValue);
          if (!openValue) setEditingFaculty(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯師資</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">姓名</label>
              <Input {...registerEdit('name')} required placeholder="王大明" />
            </div>
            <div>
              <label className="text-sm font-medium">職稱</label>
              <Input {...registerEdit('title')} required placeholder="資深芳療講師" />
            </div>
            <div>
              <label className="text-sm font-medium">簡介 (顯示於卡片)</label>
              <Textarea {...registerEdit('description')} required placeholder="簡短介紹..." />
            </div>
            <div>
              <label className="text-sm font-medium">詳細經歷 (彈窗內容)</label>
              <Textarea {...registerEdit('details')} className="h-32" placeholder="詳細經歷與證照..." />
            </div>
            <div>
              <label className="text-sm font-medium">專長 (用逗號分隔)</label>
              <Input {...registerEdit('expertise')} placeholder="芳療, 按摩, 經絡" />
            </div>
            <div>
              <label className="text-sm font-medium">照片（如不更換可留白）</label>
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
