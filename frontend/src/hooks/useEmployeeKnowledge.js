import { useState, useEffect } from 'react';
import { employeesService } from '../services/employeesService';

export const useEmployeeKnowledge = () => {
  const [employeeKnowledge, setEmployeeKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Adicionar conhecimento a funcionário
  const addKnowledgeToEmployee = async (employeeId, knowledgeData) => {
    try {
      setLoading(true);
      const result = await employeesService.addKnowledge(employeeId, knowledgeData);
      setEmployeeKnowledge(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar conhecimentos de um funcionário
  const getEmployeeKnowledge = async (employeeId) => {
    try {
      setLoading(true);
      const data = await employeesService.getKnowledge(employeeId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employeeKnowledge,
    loading,
    error,
    addKnowledgeToEmployee,
    getEmployeeKnowledge
  };
};
