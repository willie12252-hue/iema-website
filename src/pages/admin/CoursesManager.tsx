import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface CourseFormValues {
  title: string;
  description: string;
  link: string;
  button_text: string;
  image: FileList;
}

interface Course {
  id: string;
  title: string;
  description: string;
  link: string;
  button_text: string;
  image_url: string;
}

export default function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CourseFormValues>();
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
  } = useForm<CourseFormValues>();

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
    if (error) console.error('Error fetching courses:', error);
    else setCourses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  }, []);

  const onSubmit = async (data: CourseFormValues) => {
    // 1. Upload Image to Storage
    const file = data.image[0];
    if (!file) return alert('請選擇圖片');

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `courses/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return alert('圖片上傳失敗');
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

    // 2. Insert into DB
    const { error: insertError } = await supabase.from('courses').insert([{
      title: data.title,
      description: data.description,
      link: data.link,
      button_text: data.button_text,
      image_url: publicUrl,
    }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return alert('新增資料失敗');
    }

    alert('新增成功！');
    setOpen(false);
    reset();
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除嗎？')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert('刪除失敗');
    else fetchCourses();
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    resetEdit({
      title: course.title,
      description: course.description,
      link: course.link,
      button_text: course.button_text,
      image: undefined as unknown as FileList,
    });
    setEditOpen(true);
  };

  const onEditSubmit = async (data: CourseFormValues) => {
    if (!editingCourse) return;

    let imageUrl = editingCourse.image_url;
    const file = data.image?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `courses/${fileName}`;

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
      .from('courses')
      .update({
        title: data.title,
        description: data.description,
        link: data.link,
        button_text: data.button_text,
        image_url: imageUrl,
      })
      .eq('id', editingCourse.id);

    if (updateError) {
      console.error('Update error:', updateError);
      alert('更新失敗，請稍後再試');
      return;
    }

    alert('更新成功！');
    setEditOpen(false);
    setEditingCourse(null);
    resetEdit();
    fetchCourses();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">專業課程管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#899D5B] hover:bg-[#76894A]">新增課程</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增課程資料</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">課程名稱</label>
                <Input {...register('title')} required placeholder="情緒芳療師認證課程" />
              </div>
              <div>
                <label className="text-sm font-medium">簡介</label>
                <Textarea {...register('description')} required placeholder="課程內容..." />
              </div>
              <div>
                <label className="text-sm font-medium">報名連結 (Google Form 或 線上課程連結)</label>
                <Input {...register('link')} required placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium">按鈕文字</label>
                <Input {...register('button_text')} required defaultValue="查看線上課程" />
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
        {loading ? <p>載入中...</p> : courses.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-[4/3] bg-slate-100 relative">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                  編輯
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={item.link} target="_blank" rel="noreferrer">預覽連結</a>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>刪除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 編輯課程 Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(openValue) => {
          setEditOpen(openValue);
          if (!openValue) setEditingCourse(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯課程</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">課程名稱</label>
              <Input {...registerEdit('title')} required placeholder="情緒芳療師認證課程" />
            </div>
            <div>
              <label className="text-sm font-medium">簡介</label>
              <Textarea {...registerEdit('description')} required placeholder="課程內容..." />
            </div>
            <div>
              <label className="text-sm font-medium">報名連結 (Google Form 或 線上課程連結)</label>
              <Input {...registerEdit('link')} required placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium">按鈕文字</label>
              <Input {...registerEdit('button_text')} required />
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
