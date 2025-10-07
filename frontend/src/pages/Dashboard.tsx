import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ShoppingBag, Briefcase, GraduationCap, Bell, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../store/authStore';
import { generateAvatar } from '../utils';

export default function Dashboard() {
  const { user, logout, getCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  const handleLogout = () => {
    logout();
  };

  const quickActions = [
    {
      title: 'Messages',
      description: 'View your conversations',
      icon: MessageCircle,
      color: 'bg-blue-500',
      href: '/chat',
    },
    {
      title: 'Marketplace',
      description: 'Buy and sell with fellow students',
      icon: ShoppingBag,
      color: 'bg-green-500',
      href: '/marketplace',
    },
    {
      title: 'Job Board',
      description: 'Find internships and part-time jobs',
      icon: Briefcase,
      color: 'bg-purple-500',
      href: '/jobs',
    },
    {
      title: 'Tutoring',
      description: 'Get help or offer tutoring services',
      icon: GraduationCap,
      color: 'bg-orange-500',
      href: '/tutoring',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'message',
      content: 'New message from Harinadh',
      time: '2 minutes ago',
    },
    {
      id: '2',
      type: 'listing',
      content: 'Your textbook listing got a new inquiry',
      time: '1 hour ago',
    },
    {
      id: '3',
      type: 'job',
      content: 'New part-time opportunity posted',
      time: '3 hours ago',
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={generateAvatar(user.email)}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-sm text-gray-500">College ID: {user.collegeId}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.title} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(action.href)}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900">{activity.content}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Campus Stats */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Campus Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Listings</CardTitle>
                <CardDescription>Items for sale on campus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">247</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Available Jobs</CardTitle>
                <CardDescription>Part-time opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">38</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Tutors</CardTitle>
                <CardDescription>Students offering help</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">94</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

export { Dashboard };
