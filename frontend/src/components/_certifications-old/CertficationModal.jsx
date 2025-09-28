import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const CertificationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  certification,
  vendors,
  areas 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'CERTIFICACAO',
    codigo: '',
    vendor: '',
    area: '',
    link: '',
    validade_meses: ''
  });

  useEffect(() => {
    if (certification) {
      setFormData({
        nome: certification.nome || '',
        tipo: certification.tipo || 'CERTIFICACAO',
        codigo: certification.codigo || '',
        vendor: certification.vendor || '',
        area: certification.area || '',
        link: certification.link || '',
        validade_meses: certification.validade_meses || ''
      });
    } else {
      setFormData({
        nome: '',
        tipo: 'CERTIFICACAO',
        codigo: '',
        vendor: '',
        area: '',
        link: '',
        validade_meses: ''
      });
    }
  }, [certification, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: certification?.id || Date.now(),
      validade_meses: formData.validade_meses ? parseInt(formData.validade_meses) : null
    });
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certification ? "Editar Certificação" : "Nova Certificação"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Certificação *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 focus:border-ol-brand-500"
              placeholder="Ex: Certified Information Systems Security Professional"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              required
              value={formData.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 focus:border-ol-brand-500"
            >
              <option value="CERTIFICACAO">Certificação</option>
              <option value="CURSO">Curso</option>
            </select>
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <input
              type="text"
              required
              value={formData.codigo}
              onChange={(e) => handleChange('codigo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 focus:border-ol-brand-500"
              placeholder="Ex: CISSP-001"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor *
            </label>
            <input
              type="text"
              required
              list="vendors-list"
              value={formData.vendor}
              onChange={(e) => handleChange('vendor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 focus:border-ol-brand-500"
              placeholder="Ex: ISC2"
            />
            <datalist id="vendors-list">
              {vendors.map(vendor => (
                <option key={vendor} value={vendor} />
              ))}
            </datalist>
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <input
              type="text"
              list="areas-list"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 focus:border-ol-brand-500"
              placeholder="Ex: Cibersegurança"
            />
            <datalist id="areas-list">
              {areas.map(area => (
                <option key={area} value={area} />
              ))}
            </datalist>
          </div>

          {/* Link */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Oficial
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 focus:border-ol-brand-500"
              placeholder="https://www.exemplo.com/certificacao"
            />
          </div>

          {/* Validade em Meses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validade (meses)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={formData.validade_meses}
              onChange={(e) => handleChange('validade_meses', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 focus:border-ol-brand-500"
              placeholder="Ex: 36"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe vazio se não expira
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ol-brand-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-ol-brand-600 border border-transparent rounded-md hover:bg-ol-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ol-brand-500"
          >
            {certification ? "Salvar" : "Criar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CertificationModal;
