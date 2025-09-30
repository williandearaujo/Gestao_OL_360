import { useState, useEffect } from 'react';

// ✅ API SERVICE EXTRAÍDO
const API_BASE_URL = 'http://localhost:8000';

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  }
};

const dataService = {
  async getAllData() {
    try {
      const [knowledge, employees, employeeLinks] = await Promise.all([
        api.get('/knowledge'),
        api.get('/employees'),
        api.get('/employee-knowledge')
      ]);

      return {
        knowledge: knowledge.data || [],
        employees: employees.data || [],
        employeeLinks: employeeLinks.data || []
      };
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      return { knowledge: [], employees: [], employeeLinks: [] };
    }
  }
};

export const useDashboardData = () => {
  const [data, setData] = useState({ knowledge: [], employees: [], employeeLinks: [] });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await dataService.getAllData();
      setData(result);
    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return { data, loading, refreshData: loadDashboardData };
};
