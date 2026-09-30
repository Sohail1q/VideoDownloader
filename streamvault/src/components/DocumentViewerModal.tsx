import React, { useState } from 'react';
import { MediaItem } from '../types';
import { X, FileText, Edit3, Eye, Copy, Download, Check } from 'lucide-react';

interface DocumentViewerModalProps {
  item: MediaItem;
  onClose: () => void;
  onUpdateContent?: (newContent: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ 
  item, 
  onClose,
  onUpdateContent
}) => {
  const [content, setContent] = useState(item.documentDetails?.content || '# Empty Document');
  const [mode, setMode] = useState<'view' | 'edit' | 'split'>('view');
  const [copied, setCopied] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = content.split('\n').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple Markdown parser renderer for headers, bold, code blocks, lists
  const renderSimpleMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="my-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-300 font-mono text-xs overflow-x-auto">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-xl sm:text-2xl font-bold text-white mt-6 mb-3 border-b border-neutral-800 pb-2">{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-lg sm:text-xl font-semibold text-neutral-100 mt-5 mb-2">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-base font-semibold text-amber-400 mt-4 mb-2">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-4 list-disc text-xs sm:text-sm text-neutral-300 my-1">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.startsWith('---')) {
        elements.push(<hr key={index} className="border-neutral-800 my-4" />);
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(<p key={index} className="text-xs sm:text-sm text-neutral-300 leading-relaxed my-1">{line}</p>);
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <pre key="code-end" className="my-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-300 font-mono text-xs overflow-x-auto">
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      );
    }

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl h-[90vh] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-white truncate">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-mono">{item.filename}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{wordCount} words</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{lineCount} lines</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-neutral-800 p-0.5 rounded-md text-xs">
              <button
                onClick={() => setMode('view')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  mode === 'view' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  mode === 'edit' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Source</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Copy markdown text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {mode === 'view' ? (
            <div className="max-w-3xl mx-auto prose prose-invert">
              {renderSimpleMarkdown(content)}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="mb-2 text-xs text-neutral-400 font-mono flex items-center justify-between">
                <span>Markdown & Plaintext Source Editor (ZFS atomic sync)</span>
                <span>UTF-8 · LF</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (onUpdateContent) onUpdateContent(e.target.value);
                }}
                className="w-full flex-1 p-4 bg-neutral-950 border border-neutral-800 rounded-lg font-mono text-xs text-neutral-200 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                placeholder="Write markdown content..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
