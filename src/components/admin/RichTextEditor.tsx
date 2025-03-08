import { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
}: RichTextEditorProps) {
  const [editor, setEditor] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editor) {
      editor.innerHTML = value;
    }
  }, [editor, value]);

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editor) {
      onChange(editor.innerHTML);
      editor.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center space-x-2 p-2 border-b bg-gray-50">
        <button
          onClick={() => execCommand('bold')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          onClick={() => execCommand('justifyLeft')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => execCommand('justifyCenter')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => execCommand('justifyRight')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={setEditor}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none"
        placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
      />
    </div>
  );
}