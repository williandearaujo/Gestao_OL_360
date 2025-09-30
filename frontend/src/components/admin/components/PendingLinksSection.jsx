import React from 'react';
import { Link, CheckCircle } from 'lucide-react';
import AdminCard from './AdminCard';
import PendingLinkCard from '../cards/PendingLinkCard';

const PendingLinksSection = ({ pendingLinks, onRefresh, onResolvePending, onDismissPending }) => {
  const handleResolve = async (pending) => {
    try {
      await onResolvePending(pending);
      onRefresh && onRefresh();
    } catch (error) {
      console.error('Erro ao resolver pendência:', error);
    }
  };

  const handleDismiss = (pending) => {
    onDismissPending && onDismissPending(pending);
  };

  return (
    <AdminCard
      title="Vinculações Pendentes"
      description="Resolva pendências de usuários e permissões automaticamente"
      icon={Link}
      color="orange"
      stats={{
        main: pendingLinks.length,
        sub: 'Pendências'
      }}
    >
      <div className="space-y-3">
        <div className="max-h-96 overflow-y-auto space-y-3">
          {pendingLinks.length > 0 ? (
            pendingLinks.map(pending => (
              <PendingLinkCard
                key={pending.id}
                pending={pending}
                onResolve={handleResolve}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <p className="text-sm">Todas as vinculações estão em dia!</p>
              <p className="text-xs text-gray-400 mt-1">
                Quando surgirem pendências, elas aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminCard>
  );
};

export default PendingLinksSection;
