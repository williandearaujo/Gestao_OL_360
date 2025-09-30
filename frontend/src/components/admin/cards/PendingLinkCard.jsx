import React from 'react';
import { UserCheck, Users, Link, CheckCircle } from 'lucide-react';
import { Button } from '../../ui';

const PendingLinkCard = ({ pending, onResolve, onDismiss }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'manager_without_user': return UserCheck;
      case 'user_without_role': return Users;
      default: return Link;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'manager_without_user': return 'orange';
      case 'user_without_role': return 'blue';
      default: return 'gray';
    }
  };

  const TypeIcon = getTypeIcon(pending.type);

  return (
    <div className="bg-white p-4 rounded-lg border border-l-4 border-l-orange-400 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 bg-${getTypeColor(pending.type)}-50 text-${getTypeColor(pending.type)}-600 rounded-lg flex items-center justify-center`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">
              {pending.managerName || pending.userName}
            </h4>
            <p className="text-sm text-gray-600">
              {pending.managerEmail || pending.userEmail}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {pending.action}
            </p>
            {pending.confidence > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">
                  Confiança: {pending.confidence}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${pending.confidence}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {pending.confidence > 70 && (
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle}
              onClick={() => onResolve(pending)}
            >
              Resolver
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(pending)}
          >
            Dispensar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingLinkCard;
