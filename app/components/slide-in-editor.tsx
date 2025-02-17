import React from 'react';
import { X } from 'lucide-react';

interface SlideInEditorProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data?: T;
  title?: string;
}

const SlideInEditor = <T extends Record<string, any>>({
  isOpen,
  onClose,
  data,
  title = "Details"
}: SlideInEditorProps<T>) => {
  const renderDataDetails = (data: T) => {
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="slide-in-editor-field">
            <label className="slide-in-editor-label">
              {key.replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, char => char.toUpperCase())}
            </label>
            <div className="slide-in-editor-value">
              {value === null || value === undefined ? '-' :
               typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
               value instanceof Date ? value.toLocaleDateString() :
               String(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className={`slide-in-editor ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="slide-in-editor-header">
            <h2 className="slide-in-editor-title">{title}</h2>
            <button
              onClick={onClose}
              className="slide-in-editor-close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="slide-in-editor-content">
            {data ? renderDataDetails(data) : <div>No data selected</div>}
          </div>

          <div className="slide-in-editor-footer">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="slide-in-editor-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="slide-in-editor-overlay"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default SlideInEditor;
