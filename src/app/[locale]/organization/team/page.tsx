'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Loader2, 
  Search, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  MoreVertical,
  X,
  User,
  ShieldAlert,
  Crown
} from 'lucide-react';
import { Organization, OrganizationMemberRole } from '@/types/organization';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export default function TeamPage() {
  const {
    useGetMyOrganizations,
    useGetMembersByOrganization,
    useInviteMember,
    useRemoveMember,
    useUpdateMemberRole,
  } = useOrganizationQueries();

  const { useGetDirectory } = useUserQueries();

  const { data: orgs } = useGetMyOrganizations();
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (orgs?.length && !activeOrg) setActiveOrg(orgs[0]);
  }, [orgs, activeOrg]);

  const { data: members, isLoading: membersLoading } = useGetMembersByOrganization(activeOrg?.id ?? 0);
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const updateMember = useUpdateMemberRole();

  // User Search State
  const [userSearch, setUserSearch] = useState('');
  const { data: userDirectory, isLoading: searchLoading } = useGetDirectory(userSearch);
  const [selectedUser, setSelectedUser] = useState<{ userId: number, fullName: string | null } | null>(null);
  const [inviteRole, setInviteRole] = useState<OrganizationMemberRole>(OrganizationMemberRole.Member);

  const handleInvite = () => {
    if (!selectedUser || !activeOrg) return;
    inviteMember.mutate(
      { 
        organizationId: activeOrg.id, 
        userId: selectedUser.userId, 
        role: inviteRole 
      },
      { 
        onSuccess: () => {
          setSelectedUser(null);
          setUserSearch('');
        } 
      }
    );
  };

  const handleRemove = (memberId: number) => {
    if (!confirm('Are you sure you want to remove this member from your organization?')) return;
    removeMember.mutate(memberId);
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role?.toLowerCase()) {
      case 'owner': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'admin': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'recruiter': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default: return 'text-muted-foreground bg-muted/50 border-border/50';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
               <ShieldCheck className="size-4" /> Security & Governance
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              {activeOrg?.name?.toUpperCase() || 'ORGANIZATION'} <span className="text-primary">/</span> TEAM
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Manage permissions, roles, and collaboration access.
            </p>
          </div>
          
          <div className="flex gap-4">
             <Card className="bg-primary/5 border-none px-4 py-2 rounded-2xl flex items-center gap-3">
               <Users className="size-5 text-primary" />
               <div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Total Capacity</p>
                 <p className="text-sm font-black">{members?.length || 0} Members</p>
               </div>
             </Card>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Invitation Panel */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-2 border-primary/10 shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="size-5 text-primary" /> Recruit Member
                </CardTitle>
                <CardDescription>Search our global directory to find and invite professionals.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-9 rounded-xl border-2 focus-visible:ring-primary/20"
                    />
                  </div>

                  {/* Search Results */}
                  {userSearch.length >= 2 && (
                    <div className="absolute z-20 w-[calc(100%-3rem)] bg-background border rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                      {searchLoading ? (
                        <div className="p-4 text-center"><Loader2 className="size-4 animate-spin mx-auto" /></div>
                      ) : userDirectory?.length ? (
                        userDirectory.map((u) => (
                          <button
                            key={u.userId}
                            className="w-full p-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                            onClick={() => {
                              setSelectedUser({ userId: u.userId, fullName: u.fullName });
                              setUserSearch('');
                            }}
                          >
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                              {u.fullName?.[0] || 'U'}
                            </div>
                            <div>
                               <p className="text-sm font-bold">{u.fullName}</p>
                               <p className="text-[10px] text-muted-foreground">{u.email}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-muted-foreground italic">No users found.</div>
                      )}
                    </div>
                  )}

                  {selectedUser && (
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                       <div className="flex items-center gap-2">
                         <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">
                           {selectedUser.fullName?.[0] || 'U'}
                         </div>
                         <span className="text-sm font-bold">{selectedUser.fullName}</span>
                       </div>
                       <Button variant="ghost" size="icon" className="size-6 rounded-full" onClick={() => setSelectedUser(null)}>
                         <X className="size-4 text-muted-foreground" />
                       </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Assign Role</label>
                    <Select value={inviteRole} onValueChange={(v: OrganizationMemberRole) => setInviteRole(v)}>
                       <SelectTrigger className="rounded-xl border-2">
                         <SelectValue placeholder="Select Role" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                         {Object.values(OrganizationMemberRole).map((r) => (
                           <SelectItem key={r} value={r} className="font-medium">{r}</SelectItem>
                         ))}
                       </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full rounded-2xl font-black h-12 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                    onClick={handleInvite}
                    disabled={inviteMember.isPending || !selectedUser}
                  >
                    {inviteMember.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <UserPlus className="size-4 mr-2" />}
                    Deploy Invite
                  </Button>
                </div>
                
                {inviteMember.isSuccess && (
                  <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="size-3" /> Mission Broadcasted Successfully
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Members Table */}
          <div className="lg:col-span-2">
            <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
              <div className="bg-muted/30 p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                     <Users className="size-5 text-primary" /> Active Personnel
                   </h2>
                   <CardDescription>Core team and operational members.</CardDescription>
                </div>
              </div>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <TableCell className="pl-6">Member</TableCell>
                      <TableCell className="hidden md:table-cell">Identity</TableCell>
                      <TableCell className="text-center">Privileges</TableCell>
                      <TableCell className="text-right pr-6">Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membersLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4} className="p-4"><Skeleton className="h-10 w-full rounded-xl" /></TableCell>
                        </TableRow>
                      ))
                    ) : members?.length ? (
                      members.map((member) => (
                        <TableRow key={member.id} className="group hover:bg-muted/20 transition-colors">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-2xl bg-muted border-2 border-background shadow-sm flex items-center justify-center font-black text-primary overflow-hidden group-hover:scale-105 transition-transform">
                                {member.fullName ? (
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.userId}`} alt={member.fullName} className="size-full object-cover" />
                                ) : (
                                  <User className="size-5" />
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <p className="font-bold tracking-tight text-foreground/90 leading-tight">
                                  {member.fullName || `OPERATOR_${member.userId}`}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                  {member.role === 'Owner' && <Crown className="size-3 inline-block mr-1 text-amber-500" />}
                                  {member.role || 'Member'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-medium italic">
                            {member.email?.toLowerCase()}
                          </TableCell>
                          <TableCell className="text-center">
                            {member.role === 'Owner' ? (
                               <span className="text-[10px] font-black tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">UNRESTRICTED</span>
                            ) : (
                              <Select 
                                defaultValue={member.role} 
                                onValueChange={(v: OrganizationMemberRole) => 
                                  updateMember.mutate({ id: member.id, organizationId: activeOrg!.id, userId: member.userId, role: v })
                                }
                              >
                                <SelectTrigger className="h-8 rounded-lg border-none bg-muted/50 text-[10px] font-bold w-28 mx-auto">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl">
                                  {Object.values(OrganizationMemberRole).map((r) => (
                                    <SelectItem key={r} value={r} className="text-xs font-bold">{r.toUpperCase()}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl shadow-xl">
                                <DropdownMenuItem className="text-xs font-bold gap-2">
                                  <Mail className="size-3" /> Send Message
                                </DropdownMenuItem>
                                {member.role !== 'Owner' && (
                                  <DropdownMenuItem 
                                    className="text-xs font-bold text-destructive focus:text-destructive gap-2"
                                    onClick={() => handleRemove(member.id)}
                                  >
                                    <Trash2 className="size-3" /> Terminate Access
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-60 text-center space-y-4">
                           <ShieldAlert className="size-12 text-muted-foreground/20 mx-auto" />
                           <p className="text-sm font-medium text-muted-foreground">Team directory is currently empty.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
