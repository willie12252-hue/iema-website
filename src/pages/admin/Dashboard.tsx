import { Link, Route, Switch, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

import FacultyManager from './FacultyManager';
import CoursesManager from './CoursesManager';
import ActivitiesManager from './ActivitiesManager';
import HeroManager from './HeroManager';

const Sidebar = () => (
  <div className="w-64 bg-slate-800 text-white min-h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
    <div className="p-6 border-b border-slate-700">
      <h2 className="font-serif text-xl font-bold">IEMA 後台管理</h2>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <Link href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
        總覽
      </Link>
      <Link href="/admin/hero" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
        首頁輪播管理
      </Link>
      <Link href="/admin/faculty" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
        師資陣容管理
      </Link>
      <Link href="/admin/courses" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
        專業課程管理
      </Link>
      <Link href="/admin/activities" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
        會員活動管理
      </Link>
    </nav>
    <div className="p-4 border-t border-slate-700">
      <Button 
        variant="destructive" 
        className="w-full" 
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = '/#/admin/login';
        }}
      >
        登出
      </Button>
    </div>
  </div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({ faculty: 0, courses: 0, activities: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: facultyCount } = await supabase.from('faculty').select('*', { count: 'exact', head: true });
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      const { count: activitiesCount } = await supabase.from('activities').select('*', { count: 'exact', head: true });
      setStats({ 
        faculty: facultyCount || 0, 
        courses: coursesCount || 0, 
        activities: activitiesCount || 0 
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">歡迎回來，管理員</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-500 mb-2">目前師資</h3>
          <p className="text-4xl font-bold text-[#899D5B]">{stats.faculty}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-500 mb-2">上架課程</h3>
          <p className="text-4xl font-bold text-[#899D5B]">{stats.courses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-500 mb-2">活動總數</h3>
          <p className="text-4xl font-bold text-[#899D5B]">{stats.activities}</p>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLocation('/admin/login');
      } else {
        setUser(session.user);
      }
    };
    checkAuth();
  }, [setLocation]);

  // Optionally show a loading spinner while checking auth
  // But for better UX, we can just render nothing or a minimal loader
  if (!user && location !== '/admin/login') { 
     // We are checking auth, maybe render null or loader. 
     // However, setLocation is async-ish, so user might see this briefly.
     return <div className="flex h-screen items-center justify-center">載入中...</div>;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen pl-64">
      <Sidebar />
      <div className="flex-1 w-full">
        <Switch>
          <Route path="/admin/dashboard" component={DashboardHome} />
          <Route path="/admin/faculty" component={FacultyManager} />
          <Route path="/admin/courses" component={CoursesManager} />
          <Route path="/admin/activities" component={ActivitiesManager} />
          <Route path="/admin/hero" component={HeroManager} />
          <Route path="/admin/*" component={DashboardHome} />
        </Switch>
      </div>
    </div>
  );
}
