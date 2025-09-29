import { useState, useEffect } from 'react';
import { knowledgeService } from '../services/knowledgeService';

export const useKnowledge = () => {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todo o catálogo de conhecimentos
  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await knowledgeService.getAll();
      setKnowledge(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar conhecimentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Criar conhecimento
  const createKnowledge = async (knowledgeData) => {
    try {
      const newKnowledge = await knowledgeService.create(knowledgeData);
      setKnowledge(prev => [...prev, newKnowledge]);
      return newKnowledge;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Atualizar conhecimento
  const updateKnowledge = async (id, knowledgeData) => {
    try {
      const updatedKnowledge = await knowledgeService.update(id, knowledgeData);
      setKnowledge(prev => prev.map(k =>
        k.id === id ? updatedKnowledge : k
      ));
      return updatedKnowledge;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Deletar conhecimento
  const deleteKnowledge = async (id) => {
    try {
      await knowledgeService.delete(id);
      setKnowledge(prev => prev.filter(k => k.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  return {
    knowledge,
    loading,
    error,
    fetchKnowledge,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge
  };
};
