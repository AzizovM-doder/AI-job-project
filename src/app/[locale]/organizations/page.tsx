'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { useAuthStore } from '@/store/authStore';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Search, 
  Plus, 
  MapPin, 
  Briefcase, 
  Globe, 
  ArrowRight, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function OrganizationsHub() {
  const t = useTranslations('Organization');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    useGetOrganizationsPaged, 
    useGetMyOrganizations,
    useSearchOrganizations 
  } = useOrganizationQueries();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Queries
  const { data: pagedResult, isLoading: listLoading } = useGetOrganizationsPaged({ 
    Name: searchQuery, 
    PageNumber: page, 
    PageSize: pageSize 
  });
  
  const { data: myOrgs, isLoading: myOrgsLoading } = useGetMyOrganizations();
  const isBusinessUser = user?.role === 'Organization';

  const handleOrgClick = (id: number) => {
    router.push(`/${locale}/organizations/${id}`);
  };

  const handleManageClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    router.push(`/${locale}/organization/dashboard`);
  };

  return (
    <PageTransition className="container max-w-7xl mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary/5 border-2 border-primary/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 size-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
            <Globe className="size-3" /> Discover Innovation
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[0.9]">
            The World&apos;s Most <span className="text-primary italic">Ambitious</span> Companies.
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Browse through hundreds of organizations, from disruptive startups to global enterprises. Find where you belong next.
          </p>
          
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, industry, or location..."
              className="pl-12 h-14 bg-background border-2 border-transparent focus:border-primary/20 shadow-xl rounded-2xl text-lg font-medium transition-all"
            />
          </div>
        </div>
      </section>

      {/* My Organizations Section (For business users or owners) */}
      {isBusinessUser && myOrgs && myOrgs.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 uppercase">
                <ShieldCheck className="size-6 text-primary" /> Your Empire
              </h2>
              <p className="text-sm text-muted-foreground font-medium">Manage the organizations you lead.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myOrgs.map((org) => (
              <Card 
                key={org.id} 
                className="group cursor-pointer hover:shadow-2xl hover:shadow-primary/5 border border-primary/20 bg-primary/5 transition-all duration-500 overflow-hidden relative rounded-[2rem]"
                onClick={() => handleOrgClick(org.id)}
              >
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Zap className="size-6 text-primary animate-pulse" />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-background border-2 border-primary/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {org.logoUrl ? (
                        <img src={org.logoUrl} alt={org.name || ''} className="size-full object-cover" />
                      ) : (
                        <Building2 className="size-8 text-primary/30" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-xl tracking-tight leading-none mb-1">
                        {org.name?.toUpperCase() || 'UNTITLED_ORG'}
                      </h3>
                      <p className="text-xs font-bold text-primary tracking-widest uppercase opacity-70">
                        {org.type || 'STARTUP'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full font-bold uppercase tracking-widest text-[10px] h-8 hover:bg-primary hover:text-primary-foreground border-primary/20"
                      onClick={(e) => handleManageClick(e, org.id)}
                    >
                      DASHBOARD
                    </Button>
                    <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Organizations Discovery Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
             <h2 className="text-2xl font-black tracking-tight uppercase">Discovery Feed</h2>
             <p className="text-sm text-muted-foreground font-medium">
               Showing {pagedResult?.totalCount || 0} results matching your search.
             </p>
          </div>
          {isBusinessUser && (
             <Button 
               className="rounded-full font-bold px-6 shadow-lg shadow-primary/20 group uppercase tracking-widest text-xs"
               onClick={() => router.push(`/${locale}/organization/profile`)}
             >
               <Plus className="mr-2 size-4 group-hover:rotate-90 transition-transform" /> Register Entity
             </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listLoading ? (
            Array(pageSize).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-3xl" />
                <div className="flex items-center gap-4 px-2">
                  <Skeleton className="size-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : pagedResult?.items && pagedResult.items.length > 0 ? (
            pagedResult.items.map((org) => (
              <Card 
                key={org.id}
                className="group relative overflow-hidden rounded-[2.5rem] bg-card border border-border/60 hover:border-primary/30 transition-all duration-700 hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:shadow-primary/10"
                onClick={() => handleOrgClick(org.id)}
              >
                <div className="h-24 bg-gradient-to-br from-primary/10 via-background to-accent/5 group-hover:from-primary/20 transition-colors duration-700" />
                <CardContent className="px-8 pb-8 -mt-10">
                  <div className="flex flex-col gap-5">
                    <div className="size-20 bg-background rounded-3xl border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-700">
                      {org.logoUrl ? (
                         <img src={org.logoUrl} alt={org.name || ''} className="size-full object-cover" />
                      ) : (
                         <div className="size-full bg-primary/5 flex items-center justify-center text-primary font-black text-2xl">
                           {org.name?.[0]?.toUpperCase() || 'O'}
                         </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10">
                           {org.type}
                         </span>
                         <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                           <MapPin className="size-3" /> {org.location || 'Remote'}
                         </div>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                        {org.name || 'Anonymous Entity'}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] leading-relaxed font-medium">
                        {org.description || 'Creating impact through technological excellence and visionary leadership.'}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-end">
                       <Button variant="ghost" className="rounded-full size-10 p-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                         <ArrowRight className="size-5" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
               <div className="size-20 bg-muted mx-auto rounded-full flex items-center justify-center">
                 <Search className="size-8 text-muted-foreground/40" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-xl font-bold">No Organizations Found</h3>
                 <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
               </div>
               <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Searches</Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagedResult && pagedResult.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!pagedResult.hasPrevious}
              className="rounded-xl border-2"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div className="px-6 py-2 rounded-xl bg-muted/50 font-black text-sm tracking-widest border border-border/40">
              {pagedResult.pageNumber} / {pagedResult.totalPages}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setPage(p => Math.min(pagedResult.totalPages, p + 1))}
              disabled={!pagedResult.hasNext}
              className="rounded-xl border-2"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-foreground text-background rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 size-full opacity-5 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase">
             Ready to scale your vision?
           </h2>
           <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl mx-auto opacity-80 decoration-primary underline-offset-4 decoration-2">
             Join the network of top-tier professional organizations and start building your team with AI-powered precision.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Button 
               size="lg" 
               className="h-14 px-10 rounded-full font-black text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/40 uppercase tracking-tighter"
               onClick={() => router.push(`/${locale}/register?role=Organization`)}
             >
               Launch Your Org <Zap className="ml-2 size-5" />
             </Button>
             <Button 
               size="lg" 
               variant="outline" 
               className="h-14 px-10 rounded-full font-black text-lg border-2 border-white/20 hover:bg-white/10 transition-all uppercase tracking-tighter"
             >
               Contact Sales
             </Button>
           </div>
        </div>
      </section>
    </PageTransition>
  );
}
