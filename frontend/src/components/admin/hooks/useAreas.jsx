import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export const useAreas = () => {
  const [loading, setLoading] = useState(false);

  // ✅ CRIAR ÁREA
  const createArea = async (areaData) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/areas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(areaData)
      });

      const result = await response.json();

      if (result.success || response.ok) {
        // Log da ação
        const logs = JSON.parse(localStorage.getItem('ol_audit_logs') || '[]');
        const newLog = {
          id: Date.now(),
          user: 'Admin',
          action: 'Criou área',
          details: `${areaData.nome} (${areaData.sigla})`,
          timestamp: new Date(),
          type: 'create',
          ip: '192.168.1.100'
        };
        logs.unshift(newLog);
        localStorage.setItem('ol_audit_logs', JSON.stringify(logs));

        return { success: true, data: result };
      } else {
        throw new Error(result.error || 'Erro ao criar área');
      }
    } catch (error) {
      console.error('Erro ao criar área:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ ATUALIZAR ÁREA
  const updateArea = async (areaId, areaData) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/areas/${areaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(areaData)
      });

      const result = await response.json();

      if (result.success || response.ok) {
        // Log da ação
        const logs = JSON.parse(localStorage.getItem('ol_audit_logs') || '[]');
        const newLog = {
          id: Date.now(),
          user: 'Admin',
          action: 'Atualizou área',
          details: `${areaData.nome} (${areaData.sigla})`,
          timestamp: new Date(),
          type: 'update',
          ip: '192.168.1.100'
        };
        logs.unshift(newLog);
        localStorage.setItem('ol_audit_logs', JSON.stringify(logs));

        return { success: true, data: result };
      } else {
        throw new Error(result.error || 'Erro ao atualizar área');
      }
    } catch (error) {
      console.error('Erro ao atualizar área:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETAR ÁREA
  const deleteArea = async (areaId, areaName) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/areas/${areaId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success || response.ok) {
        // Log da ação
        const logs = JSON.parse(localStorage.getItem('ol_audit_logs') || '[]');
        const newLog = {
          id: Date.now(),
          user: 'Admin',
          action: 'Deletou área',
          details: areaName,
          timestamp: new Date(),
          type: 'delete',
          ip: '192.168.1.100'
        };
        logs.unshift(newLog);
        localStorage.setItem('ol_audit_logs', JSON.stringify(logs));

        return { success: true, data: result };
      } else {
        throw new Error(result.error || 'Erro ao deletar área');
      }
    } catch (error) {
      console.error('Erro ao deletar área:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createArea,
    updateArea,
    deleteArea
  };
};
