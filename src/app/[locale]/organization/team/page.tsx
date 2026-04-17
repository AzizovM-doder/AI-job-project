'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { Organization, OrganizationMemberRole } from '@/types/organization';

export default function TeamPage() {
  const {
    useGetMyOrganizations,
    useGetMembersByOrganization,
    useInviteMember,
    useRemoveMember,
    useUpdateMemberRole,
  } = useOrganizationQueries();

  const { data: orgs } = useGetMyOrganizations();
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (orgs?.length && !activeOrg) setActiveOrg(orgs[0]);
  }, [orgs, activeOrg]);

  const { data: members, isLoading } = useGetMembersByOrganization(activeOrg?.id ?? 0);
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const updateMember = useUpdateMemberRole();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrganizationMemberRole>(OrganizationMemberRole.Member);

  const handleInvite = () => {
    if (!inviteEmail || !activeOrg) return;
    inviteMember.mutate(
      { organizationId: activeOrg.id, email: inviteEmail, role: inviteRole },
      { onSuccess: () => setInviteEmail('') }
    );
  };

  const handleRemove = (memberId: number) => {
    if (!confirm('REMOVE_MEMBER_FROM_ORGANIZATION?')) return;
    removeMember.mutate(memberId);
  };

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-primary/20 pb-6">
          <div className="flex items-center gap-2 text-primary mb-2">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">TEAM_MANAGEMENT</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter terminal-glow">
            {activeOrg?.name?.toUpperCase() || 'ORG'} / TEAM
          </h1>
        </header>

        {/* Invite Form */}
        <Card className="border-primary/20 bg-primary/5 rounded-none">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <UserPlus className="size-4" /> INVITE_MEMBER
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
                className="rounded-none flex-1"
                type="email"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as OrganizationMemberRole)}
                className="bg-background border border-primary/20 px-3 text-sm rounded-none"
              >
                {Object.values(OrganizationMemberRole).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Button
                className="rounded-none"
                onClick={handleInvite}
                disabled={inviteMember.isPending || !inviteEmail}
              >
                {inviteMember.isPending ? <Loader2 className="size-4 animate-spin" /> : 'SEND_INVITE'}
              </Button>
            </div>
            {inviteMember.isSuccess && (
              <p className="text-[10px] text-green-400 tracking-widest">INVITE_SENT_SUCCESSFULLY</p>
            )}
            {inviteMember.isError && (
              <p className="text-[10px] text-destructive tracking-widest">ERROR: FAILED_TO_SEND_INVITE</p>
            )}
          </CardContent>
        </Card>

        {/* Members List */}
        <div className="border border-primary/20 overflow-hidden">
          <div className="bg-primary/5 border-b border-primary/20 p-4 flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase">ACTIVE_MEMBERS</span>
            <span className="ml-auto text-[10px] font-mono text-muted-foreground">
              COUNT: {members?.length ?? 0}
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center animate-pulse text-[10px] tracking-widest">LOADING_TEAM_DATA...</div>
          ) : members?.length ? (
            <table className="w-full text-[10px] uppercase tracking-widest">
              <thead className="border-b border-primary/10">
                <tr>
                  <th className="p-4 text-left font-black">MEMBER</th>
                  <th className="p-4 text-left font-black hidden md:table-cell">EMAIL</th>
                  <th className="p-4 text-center font-black">ROLE</th>
                  <th className="p-4 text-right font-black">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <div className="size-7 bg-primary/20 flex items-center justify-center text-[10px] font-bold border border-primary/30">
                        {(member.fullName || 'U')[0].toUpperCase()}
                      </div>
                      {(member.fullName || `USER_${member.userId}`).toUpperCase()}
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                      {member.email?.toLowerCase() || '—'}
                    </td>
                    <td className="p-4 text-center">
                      <select
                        defaultValue={member.role}
                        onChange={(e) =>
                          updateMember.mutate({
                            id: member.id,
                            data: { role: e.target.value as OrganizationMemberRole },
                          })
                        }
                        className="bg-transparent text-primary text-[10px] border border-primary/20 px-2 py-0.5"
                      >
                        {Object.values(OrganizationMemberRole).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      {member.role !== OrganizationMemberRole.Owner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none text-destructive hover:bg-destructive/10 h-7 w-7"
                          onClick={() => handleRemove(member.id)}
                          disabled={removeMember.isPending}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-[10px] text-muted-foreground tracking-widest">
              NO_MEMBERS_FOUND — SEND_INVITE_ABOVE
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
