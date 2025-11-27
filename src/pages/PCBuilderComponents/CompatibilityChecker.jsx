// src/components/PCBuilderComponents/CompatibilityChecker.jsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, Lightbulb } from 'lucide-react';

const CompatibilityChecker = ({ compatibility, className = '' }) => {
  if (!compatibility) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-900">Compatibility Check</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Add components to check compatibility
        </p>
      </div>
    );
  }

  const { isValid, issues = [], warnings = [] } = compatibility;
  const errorIssues = issues.filter(issue => issue.severity === 'error');
  const warningIssues = issues.filter(issue => issue.severity === 'warning');

  const getStatusColor = () => {
    if (errorIssues.length > 0) return 'red';
    if (warningIssues.length > 0 || warnings.length > 0) return 'yellow';
    return 'green';
  };

  const getStatusIcon = () => {
    const color = getStatusColor();
    const iconClass = "w-5 h-5";
    
    switch (color) {
      case 'red':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'yellow':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'green':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getStatusMessage = () => {
    if (errorIssues.length > 0) {
      return `${errorIssues.length} compatibility ${errorIssues.length === 1 ? 'issue' : 'issues'} found`;
    }
    if (warningIssues.length > 0 || warnings.length > 0) {
      const totalWarnings = warningIssues.length + warnings.length;
      return `${totalWarnings} ${totalWarnings === 1 ? 'warning' : 'warnings'} found`;
    }
    return 'All components are compatible';
  };

  const getStatusDescription = () => {
    if (errorIssues.length > 0) {
      return 'Critical compatibility issues detected. These must be resolved before proceeding.';
    }
    if (warningIssues.length > 0 || warnings.length > 0) {
      return 'Some compatibility warnings detected. Review these recommendations.';
    }
    return 'Your component selection looks great! No compatibility issues detected.';
  };

  const renderIssue = (issue, index) => (
    <div key={index} className={`p-3 rounded-lg border-l-4 ${
      issue.severity === 'error' 
        ? 'bg-red-50 border-red-400' 
        : 'bg-yellow-50 border-yellow-400'
    }`}>
      <div className="flex items-start space-x-2">
        {issue.severity === 'error' ? (
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            issue.severity === 'error' ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {issue.message}
          </p>
          {issue.component1 && issue.component2 && (
            <p className={`text-xs mt-1 ${
              issue.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              Affects: {issue.component1} ↔ {issue.component2}
            </p>
          )}
          {issue.autoFix && (
            <div className="mt-2">
              <div className="flex items-start space-x-1">
                <Lightbulb className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  <strong>Suggestion:</strong> {issue.autoFix}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWarning = (warning, index) => (
    <div key={index} className="p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400">
      <div className="flex items-start space-x-2">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-800">{warning.message}</p>
          {warning.component && (
            <p className="text-xs mt-1 text-blue-600">
              Component: {warning.component}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium text-gray-900">Compatibility Status</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            getStatusColor() === 'red' 
              ? 'bg-red-100 text-red-800'
              : getStatusColor() === 'yellow'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {getStatusMessage()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {getStatusDescription()}
        </p>
        {compatibility.lastChecked && (
          <p className="text-xs text-gray-500 mt-2">
            Last checked: {new Date(compatibility.lastChecked).toLocaleString()}
          </p>
        )}
      </div>

      <div className="p-4">
        {/* Critical Issues */}
        {errorIssues.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              Critical Issues ({errorIssues.length})
            </h4>
            <div className="space-y-2">
              {errorIssues.map(renderIssue)}
            </div>
          </div>
        )}

        {/* Warning Issues */}
        {warningIssues.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Warnings ({warningIssues.length})
            </h4>
            <div className="space-y-2">
              {warningIssues.map(renderIssue)}
            </div>
          </div>
        )}

        {/* General Warnings */}
        {warnings.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Recommendations ({warnings.length})
            </h4>
            <div className="space-y-2">
              {warnings.map(renderWarning)}
            </div>
          </div>
        )}

        {/* All Good */}
        {isValid && errorIssues.length === 0 && warningIssues.length === 0 && warnings.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <h4 className="text-lg font-medium text-green-800 mb-1">Perfect Compatibility!</h4>
            <p className="text-sm text-green-600">
              All selected components work together seamlessly.
            </p>
          </div>
        )}

        {/* Compatibility Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
            <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
            Compatibility Tips
          </h5>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Ensure your motherboard socket matches your processor</li>
            <li>• Check memory type compatibility (DDR4 vs DDR5)</li>
            <li>• Verify your power supply can handle all components</li>
            <li>• Confirm your case can fit the graphics card length</li>
            <li>• Check if your cooler is compatible with your processor socket</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityChecker;