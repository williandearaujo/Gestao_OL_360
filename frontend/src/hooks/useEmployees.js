import { useState, useEffect } from 'react';
import { employeesService } from '../services/employeesService';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os funcionários
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeesService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar funcionários:', err);
    } finally {
      setLoading(false);
    }
  };

  // Criar funcionário
  const createEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeesService.create(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Atualizar funcionário
  const updateEmployee = async (id, employeeData) => {
    try {
      const updatedEmployee = await employeesService.update(id, employeeData);
      setEmployees(prev => prev.map(emp =>
        emp.id === id ? updatedEmployee : emp
      ));
      return updatedEmployee;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Deletar funcionário
  const deleteEmployee = async (id) => {
    try {
      await employeesService.delete(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};
