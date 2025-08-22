import { useEffect } from 'react';
import { MessageCircle, ShoppingBag, Briefcase, GraduationCap, Bell, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../store/authStore';
import { generateAvatar } from '../utils';

export function Dashboard() {
  const { user, logout, getCurrentUser } = useAuthStore();

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
      title: 'Global Chat',
      description: 'Connect with your campus community',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">College Buddy</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatarUrl || generateAvatar(user?.name || 'User')}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            What would you like to do today?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Chat Activity</CardTitle>
              <CardDescription>Latest messages from your campus community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={generateAvatar('John Doe')}
                    alt="John"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-sm text-gray-600">Looking for someone to share textbook costs...</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <img
                    src={generateAvatar('Sarah Wilson')}
                    alt="Sarah"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Wilson</p>
                    <p className="text-sm text-gray-600">Anyone interested in forming a study group for CS101?</p>
                    <p className="text-xs text-gray-400">4 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace Activity</CardTitle>
              <CardDescription>Recent listings from your campus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Calculus Textbook</p>
                    <p className="text-sm text-gray-600">Excellent condition - $45</p>
                    <p className="text-xs text-gray-400">Posted 1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mini Fridge</p>
                    <p className="text-sm text-gray-600">Perfect for dorm room - $80</p>
                    <p className="text-xs text-gray-400">Posted 3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
