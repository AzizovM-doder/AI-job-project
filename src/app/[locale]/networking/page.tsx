'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useConnections } from '@/src/hooks/useConnections';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Check, X, ShieldAlert, Loader2, Globe } from 'lucide-react';

export default function NetworkingPage() {
  const { useGetMyConnections, useGetPendingRequests, useRespondRequest, useDeleteConnection } = useConnections();

  const { data: connections, isLoading: loadingConnections } = useGetMyConnections();
  const { data: pending, isLoading: loadingPending } = useGetPendingRequests();
  const respondMutation = useRespondRequest();
  const deleteMutation = useDeleteConnection();

  const handleResponse = (requestId: number, accept: boolean) => {
    respondMutation.mutate({ requestId, accept });
  };

  const handleDelete = (id: number) => {
    if (confirm('TERMINATE_CONNECTION_CONFIRME?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-1">
          <div className="flex items-center space-x-2">
            <Globe className="size-6 text-primary animate-pulse" />
            <h1 className="text-3xl font-black terminal-glow uppercase">NEURAL_NETWORK_v4.0</h1>
          </div>
          <p className="text-xs text-muted-foreground tracking-[0.3em]">MANAGING INTER-ENTITY CONNECTIONS AND NODE LINKS</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Invitations */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-sm font-bold flex items-center border-b border-primary/20 pb-2">
              <ShieldAlert className="mr-2 size-4 text-primary" /> PENDING_LINK_REQUESTS
            </h2>
            
            {loadingPending ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-primary/5 border border-primary/10" />
                <div className="h-20 bg-primary/5 border border-primary/10" />
              </div>
            ) : pending?.length ? (
              pending.map((req) => (
                <Card key={req.id} className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4 flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="size-8 bg-primary/20 flex items-center justify-center font-bold text-xs border border-primary/40">
                        {req.requesterName[0].toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold truncate">{req.requesterName.toUpperCase()}</p>
                        <p className="text-[9px] text-muted-foreground">REQUEST_INCOMING</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 h-7 text-[10px]"
                        onClick={() => handleResponse(req.id, true)}
                        disabled={respondMutation.isPending}
                      >
                        <Check className="mr-1 size-3" /> ACCEPT
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1 h-7 text-[10px]"
                        onClick={() => handleResponse(req.id, false)}
                        disabled={respondMutation.isPending}
                      >
                        <X className="mr-1 size-3" /> DECLINE
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-[10px] text-muted-foreground uppercase opacity-50 italic">NO_PENDING_INTRUSIONS</p>
            )}
          </div>

          {/* Established Connections */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold flex items-center border-b border-primary/20 pb-2">
              <Users className="mr-2 size-4 text-primary" /> ACTIVE_SYNAPSE_LINKS
            </h2>

            {loadingConnections ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-primary/5 border border-primary/10 animate-pulse" />
                ))}
              </div>
            ) : connections?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((conn) => (
                  <Card key={conn.id} className="border-primary/10 hover:border-primary/40 transition-colors group">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="size-10 bg-primary/5 border border-primary/20 flex items-center justify-center font-bold">
                        {conn.addresseeName[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold truncate">{conn.addresseeName.toUpperCase()}</p>
                        <p className="text-[10px] text-muted-foreground">LINK_ESTABLISHED: {new Date(conn.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={() => handleDelete(conn.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-20 border border-dashed border-primary/10 bg-primary/5">
                <Users className="size-12 mx-auto mb-4 opacity-10" />
                <p className="text-xs text-muted-foreground uppercase tracking-widest">ISOLATED_NODE: NO_CONNECTIONS_DETECTED</p>
                <Button variant="outline" className="mt-6 text-[10px]">SCAN_FOR_ENTITIES</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
