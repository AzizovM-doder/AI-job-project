'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import { useConnectionQueries } from '@/src/hooks/queries/useConnectionQueries';
import { useUserQueries } from '@/src/hooks/queries/useUserQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManageNetworkSidebar from '@/src/components/networking/ManageNetworkSidebar';
import InvitationCard from '@/src/components/networking/InvitationCard';
import { UserPlus, User, Building2, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NetworkingPage() {
  const { useGetPendingConnections } = useConnectionQueries();
  const { useGetDirectory } = useUserQueries();

  const { data: invitations, isLoading: loadingInvs } = useGetPendingConnections();
  const { data: directory, isLoading: loadingDir } = useGetDirectory();

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-12">
          
          {/* Left Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-4 sticky top-[72px]">
            <ManageNetworkSidebar />
            
            <Card className="shadow-sm border-border/60 overflow-hidden hidden md:block">
              <div className="p-4 bg-muted/30 flex items-center justify-between border-b border-border/60">
                <span className="text-[14px] font-bold">Add personal contacts</span>
              </div>
              <CardContent className="p-4 space-y-3">
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  We’ll import your address book to suggest people you know on AI-JOB.
                </p>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
                <Button className="w-full rounded-full h-8 font-bold text-xs" variant="outline">
                  Continue
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* Pending Invitations Section */}
            {(invitations && invitations.length > 0) || loadingInvs ? (
               <Card className="shadow-sm border-border/60">
                 <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between">
                   <CardTitle className="text-base font-normal">Invitations</CardTitle>
                   <Button variant="ghost" size="sm" className="text-muted-foreground font-bold hover:bg-black/5 rounded-sm">See all {invitations?.length || 0}</Button>
                 </CardHeader>
                 <CardContent className="p-0">
                    {loadingInvs ? (
                      <div className="p-4 space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : (
                      invitations?.map((inv) => (
                        <InvitationCard key={inv.id} invitation={inv} />
                      ))
                    )}
                 </CardContent>
               </Card>
            ) : null}

            {/* Directory / Suggestions Grid */}
            <Card className="shadow-sm border-border/60">
              <CardHeader className="p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-normal">People you may know based on your activity</CardTitle>
                <button className="text-[14px] font-bold text-muted-foreground hover:bg-black/5 p-1 rounded transition-colors">See all</button>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                 {loadingDir ? (
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {directory?.map((person) => (
                       <Card key={person.userId} className="overflow-hidden border-border/60 shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-shadow group">
                          <button className="absolute top-2 right-2 size-7 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="size-4" />
                          </button>
                          
                          <div className="h-20 w-full bg-gradient-to-r from-primary/10 to-accent/10" />
                          
                          <CardContent className="p-4 pt-0 -mt-10 flex flex-col items-center flex-1 w-full">
                            <div className="size-20 rounded-full border-2 border-background bg-muted overflow-hidden shrink-0">
                               {person.avatarUrl ? (
                                 <img src={person.avatarUrl} alt="User" className="size-full object-cover" />
                               ) : (
                                 <div className="size-full flex items-center justify-center font-bold text-2xl text-muted-foreground/40 bg-muted uppercase">
                                   {person.fullName?.[0] || 'U'}
                                 </div>
                               )}
                            </div>
                            <p className="mt-3 text-[14px] font-bold line-clamp-1 hover:underline cursor-pointer">{person.fullName}</p>
                            <p className="text-[12px] text-muted-foreground line-clamp-2 min-h-[32px] mt-1">{person.title || 'Professional at AI-JOB'}</p>
                            
                            <div className="flex items-center gap-1 mt-4 text-[11px] text-muted-foreground">
                               <Users className="size-3" />
                               <span>14 mutual connections</span>
                            </div>
                            
                            <div className="mt-auto w-full pt-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full rounded-full border-primary text-primary font-bold hover:bg-primary/5 h-8"
                              >
                                <UserPlus className="size-4 mr-1.5" /> Connect
                              </Button>
                            </div>
                          </CardContent>
                       </Card>
                     ))}
                   </div>
                 )}
              </CardContent>
            </Card>

          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
