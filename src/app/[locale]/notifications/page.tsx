'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import { useNotificationQueries } from '@/src/hooks/queries/useNotificationQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Settings, MoreHorizontal, User, Briefcase, Heart, MessageSquare, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import ThreeColumnLayout from '@/src/components/layouts/ThreeColumnLayout';

export default function NotificationsPage() {
  const { useGetNotificationsPaged, useMarkAsRead } = useNotificationQueries();
  const { data: notifications, isLoading, isError } = useGetNotificationsPaged({ PageSize: 20 });
  const markAsRead = useMarkAsRead();

  const getIcon = (type: string) => {
    switch(type) {
      case 'ConnectionRequest': return <UserPlus className="size-5 text-blue-500" />;
      case 'NewJob': return <Briefcase className="size-5 text-orange-500" />;
      case 'PostLike': return <Heart className="size-5 text-red-500 fill-current" />;
      case 'PostComment': return <MessageSquare className="size-5 text-emerald-500" />;
      default: return <Bell className="size-5 text-primary" />;
    }
  };

  const LeftColumn = (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-border/60">
        <CardTitle className="text-base font-bold">Manage your Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="py-2">
           <button className="w-full px-4 py-3 text-left text-sm font-bold text-primary bg-primary/5 border-l-4 border-l-primary transition-colors">
             All Notifications
           </button>
           <button className="w-full px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors">
             Mentions
           </button>
           <button className="w-full px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors">
             My posts
           </button>
        </div>
      </CardContent>
    </Card>
  );

  const RightColumn = (
     <div className="sticky top-[72px] space-y-4">
        <Card className="shadow-sm border-border/60 text-center p-6">
           <p className="text-xs text-muted-foreground leading-relaxed">
             Get the latest jobs and industry news
           </p>
           <div className="flex justify-center -space-x-2 my-4">
             <div className="size-12 rounded-full border-2 border-background bg-muted" />
             <div className="size-12 rounded-full border-2 border-background bg-muted" />
           </div>
           <Button variant="outline" className="w-full rounded-full h-8 font-bold text-xs border-primary text-primary">
             Follow
           </Button>
        </Card>
     </div>
  );

  return (
    <ProtectedRoute>
      <PageTransition>
        <ThreeColumnLayout
           left={LeftColumn}
           right={RightColumn}
           main={
             <div className="space-y-3">
               <Card className="shadow-sm border-border/60">
                 <CardContent className="p-0 overflow-hidden">
                    {isLoading ? (
                      [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="p-4 flex gap-3 border-b border-border/40">
                          <Skeleton className="size-12 rounded-full shrink-0" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))
                    ) : isError ? (
                      <div className="p-20 text-center text-destructive font-bold text-xs uppercase tracking-widest bg-destructive/5">
                        [!] DATA_SYNC_FAILED
                      </div>
                    ) : notifications?.items && notifications.items.length > 0 ? (
                      notifications.items.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={cn(
                            "group p-4 flex gap-3 border-b border-border/40 hover:bg-muted/30 transition-colors relative",
                            !notif.isRead && "bg-primary/[0.03] border-l-4 border-l-primary"
                          )}
                          onClick={() => !notif.isRead && markAsRead.mutate(notif.id)}
                        >
                          <div className="size-12 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center border">
                             {getIcon(notif.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0 pr-8">
                             <div className="flex items-start justify-between">
                               <p className={cn(
                                 "text-[14px] leading-snug",
                                 !notif.isRead ? "font-bold text-foreground" : "text-muted-foreground font-normal"
                               )}>
                                 {notif.message}
                               </p>
                             </div>
                             <p className="text-[12px] text-muted-foreground mt-1">
                               {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                             </p>
                          </div>

                          <div className="absolute right-3 top-4 hidden group-hover:block">
                            <Button variant="ghost" size="icon" className="size-8 rounded-full">
                              <MoreHorizontal className="size-5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-20 text-center text-muted-foreground">
                        <Bell className="size-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-lg text-foreground">No notifications yet</p>
                        <p className="text-sm">We'll let you know when something important happens.</p>
                      </div>
                    )}
                 </CardContent>
               </Card>
             </div>
           }
        />
      </PageTransition>
    </ProtectedRoute>
  );
}
